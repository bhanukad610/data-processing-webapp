import React, { useEffect, useState } from 'react';
import { fetchFiles } from '../services/api';
import './styles/DataViewer.css';

const DataViewer = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const loadFiles = async () => {
            const data = await fetchFiles();
            setFiles(data);
        };
        loadFiles();
    }, []);

    return (
        <div className="data-viewer">
            <h2>Uploaded Files</h2>
            <div className="file-list">
                {files.length > 0 ? (
                    files.map(file => (
                        <div key={file.id} className="file-card">
                            <h3>File ID: {file.id}</h3>
                            <p><strong>Uploaded At:</strong> {new Date(file.uploaded_at).toLocaleString()}</p>
                            <p><strong>File:</strong> <a href={file.file} target="_blank" rel="noopener noreferrer">{file.file}</a></p>
                            <h4>Data Types:</h4>
                            {file.data_types.length > 0 ? (
                                <table className="data-types-table">
                                    <thead>
                                        <tr>
                                            <th>Column Name</th>
                                            <th>Data Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {file.data_types.map((dataType, index) => (
                                            <tr key={index}>
                                                <td>{dataType.column_name}</td>
                                                <td>{dataType.data_type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No data types available.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No files uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default DataViewer;