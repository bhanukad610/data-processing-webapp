import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import './styles/FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const response = await uploadFile(file);
        alert('File uploaded successfully');
        console.log(response);
      } catch (error) {
        alert('Failed to upload file');
        console.error(error);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload File</button>
      </form>
    </div>
  );
};

export default FileUpload;