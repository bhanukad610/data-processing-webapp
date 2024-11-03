import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFiles } from '../services/api';
import './styles/DataViewer.css';

const DataViewer = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await fetchFiles(currentPage);
        setFiles(data.results);
        setTotalPages(Math.ceil(data.count / 5));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    loadFiles();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="data-viewer-container">
      <h2>Data Viewer</h2>

      <Link to="/" className="back-button">
        &larr; Back to Home
      </Link>

      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* File List */}
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.id}>
            <p><strong>File:</strong> {file.file}</p>
            <p><strong>Uploaded At:</strong> {new Date(file.created_at).toLocaleString()}</p>
            <ul>
              {file.data_types.map((type, index) => (
                <li key={index}>
                  <strong>{type.column_name}:</strong> {type.data_type}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataViewer;