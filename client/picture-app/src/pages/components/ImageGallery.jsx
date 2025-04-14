import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link to handle navigation
import './ImageGallery.css'; // Make sure to import the correct CSS file

const electron = window.require ? window.require('electron') : null;
const ipcRenderer = electron?.ipcRenderer;

function ImageGallery({ refreshKey }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ipcRenderer) {
      setError("Electron's ipcRenderer is not available.");
      console.error("ipcRenderer is not available.");
      return;
    }

    ipcRenderer.invoke('get-images')
      .then((imgs) => {
        console.log("📂 Received images from Electron:", imgs);
        setImages(imgs);
      })
      .catch((err) => {
        setError(`Failed to load images: ${err.message}`);
        console.error("Error fetching images:", err);
      });
  }, [refreshKey]);  // Re-fetch when refreshKey changes

  return (
    <div className="gallery-container">
      <h3>Your Images</h3>

      {error && <p className="error-message">{error}</p>} {/* Error message if any */}

      <div className="image-grid">
        {images.length === 0 ? (
          <p className="no-images-message">No images available.</p>
        ) : (
          images.map((img, idx) => (
            <div key={idx} className="image-card">
              {/* Image */}
              <img
                src={img.path}
                alt={img.name}
                className="image"
                onError={(e) => {
                  console.error(`❌ Failed to load: ${img.path}`);
                  e.target.src = 'https://via.placeholder.com/150?text=Image+Error'; // Fallback image
                }}
                onLoad={() => {
                  console.log(`✅ Successfully loaded: ${img.path}`);
                }}
              />

              {/* Image Name */}
              <div className="image-name">{img.name}</div>

              {/* Hover effect with Edit Button */}
              <div className="hover-overlay">
                <Link to={`/edit-image?img=${encodeURIComponent(img.path)}`} className="edit-link">
                  <span>Edit</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ImageGallery;
