import React, { useState } from 'react';

function UploadPicture({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !window.electronAPI?.saveImage) {
      setMessage('❌ Electron API not available');
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const buffer = reader.result;
      window.electronAPI.saveImage({
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
