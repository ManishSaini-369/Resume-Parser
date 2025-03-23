from django.urls import path
from .views import get_todos, CustomTokenObtainPairView, CustomTokenRefreshView, logout, register, is_logged_in, ResumeUploadView, ResumeListView, ResumeDownloadView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', logout),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('todos/', get_todos),
    path('register/', register),
    path('authenticated/', is_logged_in),
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('resumes/', ResumeListView.as_view(), name='resume-list'),
    path('resumes/<int:pk>/download/', ResumeDownloadView.as_view(), name='resume-download'),

]