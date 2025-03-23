import fitz  # PyMuPDF
import re

def extract_resume_data(pdf_path):
    data = {'name': '', 'email': '', 'phone': '', 'skills': ''}
    with fitz.open(pdf_path) as doc:
        text = ''
        for page in doc:
            text += page.get_text()
        # Extract email
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        if email_match:
            data['email'] = email_match.group(0)
        # Extract phone
        phone_match = re.search(r'\b\d{10}\b', text)
        if phone_match:
            data['phone'] = phone_match.group(0)
        # Extract name and skills using custom logic or NLP models
        # ...
    return data
