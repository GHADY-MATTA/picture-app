import React, { useState } from 'react';

// 🔐 Electron fallback-safe require
const electron = window.require ? window.require('electron') : null;
const ipcRenderer = electron?.ipcRenderer;

function UploadPicture({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !ipcRenderer) return;

    const reader = new FileReader();
    reader.onload = function () {
      const buffer = reader.result;
      ipcRenderer.invoke('save-image', {
        name: file.name,
        data: buffer
      }).then((res) => {
        setMessage(res);
        setFile(null);

        if (onUploadSuccess) {
          onUploadSuccess(); // ✅ Trigger gallery refresh
        }
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h3>Upload a Picture</h3>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload}>Save</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadPicture;
