import axios from 'axios';

// const BASE_URL = 'http://127.0.0.1:8000/api/'
const BASE_URL = 'https://resume-parser-s74a.onrender.com/api/'

const LOGIN_URL = `${BASE_URL}login/`
const REGISTER_URL = `${BASE_URL}register/`
const LOGOUT_URL = `${BASE_URL}logout/`
const NOTES_URL = `${BASE_URL}todos/`
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`
const GETRESUME_URL = `${BASE_URL}resumes/`

axios.defaults.withCredentials = true; 

export const login = async (username, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL, 
            { username, password },  // Object shorthand for cleaner syntax
            { withCredentials: true }  // Ensures cookies are included
        );
        
        // Check if the response contains a success attribute (depends on backend response structure)
        return response.data
    } catch (error) {
        console.error("Login failed:", error);
        return false;  // Return false or handle the error as needed
    }
};

export const get_notes = async () => {
    const response = await axios.get(NOTES_URL, { withCredentials: true });
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(LOGOUT_URL, { withCredentials: true });
    return response.data;
};

export const register = async (username, email, password) => {
    const response = await axios.post(REGISTER_URL, {username, email, password}, { withCredentials: true });
    return response.data;
};

export const authenticated_user = async () => {
    const response = await axios.get(AUTHENTICATED_URL, { withCredentials: true });
    return response.data
}

export const upload_file = async (file) => {
    const formData = new FormData();
    formData.append('pdf_file', file);

    try {
        const response = await axios.post(
            `${BASE_URL}upload/`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        return false;
    }
};

export const get_parsed_data = async () => {
    try {
        const response = await axios.get(`${BASE_URL}parsed-data/`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching parsed data:', error);
        return [];
    }
};

export const get_resumes = async () => {
    try {
        const response = await axios.get(GETRESUME_URL, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching resumes:', error);
        throw error;  // Ensure the error can be caught in your component
    }
};
