import React from 'react';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import DataViewer from './components/DataViewer';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/data-viewer" element={<DataViewer />} />
        </Routes>
      </div>
      <div>
      <Link to="/data-viewer">
        <button>Go to Data Viewer</button>
      </Link>
      </div>
    </Router>
  );
}

export default App;