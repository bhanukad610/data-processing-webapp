import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import { Link } from 'react-router-dom';
import './styles/FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseTypes, setResponseTypes] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadFile(file);
        setResponseTypes(response);
        alert('File uploaded successfully');
      } catch (error) {
        alert('Failed to upload file');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClear = () => {
    setFile(null);
    setResponseTypes(null);
  };

  return (
    <div className="file-upload-container">
      <h2 className="upload-title">Upload Your File</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          aria-label="Choose file"
        />
        <button type="submit" className="upload-button" disabled={isLoading || !file}>
          {isLoading ? 'Uploading...' : 'Upload File'}
        </button>
        <button type="button" className="clear-button" onClick={handleClear} disabled={!file && !responseTypes}>
          Clear
        </button>
      </form>
      <Link to="/data-viewer" className="data-viewer-link">
        <button className="viewer-button">Go to Data Viewer</button>
      </Link>

      {responseTypes && (
        <div className="response-data">
          <h3>Data Types Inferred:</h3>
          <ul>
            {Object.entries(responseTypes).map(([column, dataType]) => (
              <li key={column}>
                <strong>{column}:</strong> {dataType}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;