import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFiles } from '../services/api';
import './styles/DataViewer.css';

const DataViewer = () => {
  const [files, setFiles] = useState([]);
  const [sortOption, setSortOption] = useState('name-asc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await fetchFiles();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    loadFiles();
  }, []);

  // Sort the files based on selected option
  const sortedFiles = [...files].sort((a, b) => {
    if (sortOption === 'name-asc') return a.file.localeCompare(b.file);
    if (sortOption === 'name-desc') return b.file.localeCompare(a.file);
    if (sortOption === 'time-asc') return new Date(a.uploaded_at) - new Date(b.uploaded_at);
    if (sortOption === 'time-desc') return new Date(b.uploaded_at) - new Date(a.uploaded_at);
    return 0;
  });

  // Filter files based on search query
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

      {/* File List */}
      <ul className="file-list">
        {filteredFiles.map((file) => (
          <li key={file.id}>
            <p><strong>File:</strong> {file.file}</p>
            <p><strong>Uploaded At:</strong> {new Date(file.uploaded_at).toLocaleString()}</p>
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