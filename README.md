# Project Setup Guide

This project consists of two parts:
1. **Backend** - Django Application
2. **Frontend** - React Application

## Backend Setup
Follow these steps to set up and run the backend:

1. **Create a Virtual Environment**
   ```bash
   cd backend
   python -m venv env
   ````

2. **Activate the Virtual Environment**
   - On Windows:
     ```bash
     env\Scripts\activate
     ```
   - On Mac/Linux:
     ```bash
     source env/bin/activate
     ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Run the Server**
   ```bash
   python manage.py runserver
   ```

The backend will now be running.

## Frontend Setup
Follow these steps to set up and run the frontend:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Run the Frontend:
   ```bash
   npm start
   ```

The frontend will now be running and accessible at the designated port (commonly `http://localhost:3000`).

---
If you encounter any issues, ensure all dependencies are correctly installed and services are properly running.