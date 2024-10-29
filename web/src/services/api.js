import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Upload file function
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/', formData);
  return response.data;
};

// Retrieve processed data
export const fetchFiles = async () => {
    try {
        const response = await axios.get(`${API_URL}/files/`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching files:", error);
        return [];
    }
};