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
export const fetchFiles = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/files/`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching files:", error);
      return { results: [], count: 0 };
    }
  };
  
  export const fetchFilteredFiles = async (page = 1, search = '') => {
    try {
      const endpoint = search ? `${API_URL}/files/search/` : `${API_URL}/files/`;
      const response = await axios.get(endpoint, {
        params: { page, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching files:", error);
      return { results: [], count: 0 };
    }
  };