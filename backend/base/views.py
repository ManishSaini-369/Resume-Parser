from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ResumeSerializer
from .utils import extract_resume_data
from rest_framework import generics
import pdfplumber
import re

from .models import Todo
from .models import Resume
from .serializers import TodoSerializer, UserRegisterSerializer, UserSerializer
from django.http import FileResponse, Http404
from datetime import datetime, timedelta
from rest_framework.authentication import TokenAuthentication


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.error)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            seriliazer = UserSerializer(request.user, many=False)

            res = Response()

            res.data = {'success':True}

            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.data.update(tokens)
            return res
        
        except Exception as e:
            print(e)
            return Response({'success':False})
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:

        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('response_token', path='/', samesite='None')

        return res

    except Exception as e:
        print(e)
        return Response({'success':False})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todos(request):
    user = request.user
    todos = Todo.objects.filter(owner=user)
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)

# Improved Extraction Function
def extract_resume_data(pdf_path):
    data = {"name": "", "email": "", "phone": "", "skills": ""}

    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    if not text.strip():
        image = Image.open(pdf_path)
        text = pytesseract.image_to_string(image)

    data["email"] = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text).group(0) if re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text) else ""
    data["phone"] = re.search(r'\b\d{10}\b', text).group(0) if re.search(r'\b\d{10}\b', text) else ""

    skills_keywords = ["Python", "Django", "JavaScript", "React", "SQL", "APIs", "AWS"]
    extracted_skills = [skill for skill in skills_keywords if skill.lower() in text.lower()]
    data["skills"] = ', '.join(extracted_skills)

    return data

class ResumeUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = ResumeSerializer(data=request.data)
        if file_serializer.is_valid():
            resume_instance = file_serializer.save()

            # Extract data and update the instance
            extracted_data = extract_resume_data(resume_instance.pdf_file.path)
            print("Extracted Data:", extracted_data)
            for key, value in extracted_data.items():
                if key == 'skills' and isinstance(value, str):
                    value = [skill.strip() for skill in value.split(',')]  # Convert string to list
                setattr(resume_instance, key, value)
            resume_instance.save()  

            # Include both extracted data and saved data in the response
            response_data = {
                "file_data": file_serializer.data,      # File details
                "saved_data": {
                    "name": resume_instance.name,
                    "email": resume_instance.email,
                    "phone": resume_instance.phone,
                    "skills": resume_instance.skills
                }
            }

            return Response(response_data, status=201)
        else:
            return Response(file_serializer.errors, status=400)


class ResumeListView(generics.ListAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        print("✅ ResumeListView accessed")
        return super().get(request, *args, **kwargs)

class ResumeDownloadView(APIView):
    uthentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk, *args, **kwargs):
        try:
            resume = Resume.objects.get(pk=pk)
            pdf_path = resume.pdf_file.path
            if os.path.exists(pdf_path):
                return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
            else:
                raise Http404("File not found")
        except Resume.DoesNotExist:
            raise Http404("Resume not found")