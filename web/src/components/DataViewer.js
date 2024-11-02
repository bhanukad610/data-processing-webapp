import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFiles } from '../services/api';
import './styles/DataViewer.css';

const DataViewer = () => {
  const [files, setFiles] = useState([]);
  const [sortOption, setSortOption] = useState('name-asc');
  const [searchQuery, setSearchQuery] = useState('');
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

  const sortedFiles = [...files].sort((a, b) => {
    if (sortOption === 'name-asc') return a.file.localeCompare(b.file);
    if (sortOption === 'name-desc') return b.file.localeCompare(a.file);
    if (sortOption === 'time-asc') return new Date(a.created_at) - new Date(b.created_at);
    if (sortOption === 'time-desc') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  const filteredFiles = sortedFiles.filter(file =>
    file.file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="data-viewer-container">
      <h2>Data Viewer</h2>

      <Link to="/" className="back-button">
        &larr; Back to Home
      </Link>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by file name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Sort Controls */}
      <div className="sort-controls">
        <label>Sort By:</label>
        <button onClick={() => setSortOption('name-asc')}>Name Asc</button>
        <button onClick={() => setSortOption('name-desc')}>Name Desc</button>
        <button onClick={() => setSortOption('time-asc')}>Time Asc</button>
        <button onClick={() => setSortOption('time-desc')}>Time Desc</button>
      </div>

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
        {filteredFiles.map((file) => (
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