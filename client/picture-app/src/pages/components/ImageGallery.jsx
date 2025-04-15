import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ImageGallery.css';

function ImageGallery({ refreshKey }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.electronAPI?.getImages) {
      setError("❌ Electron API (getImages) is not available.");
      console.error("window.electronAPI.getImages is missing.");
      return;
    }

    window.electronAPI.getImages()
      .then((imgs) => {
        console.log("📂 Received images from Electron:", imgs);
        setImages(imgs);
      })
      .catch((err) => {
        setError(`Failed to load images: ${err.message}`);
        console.error("Error fetching images:", err);
      });
  }, [refreshKey]);

  return (
    <div className="gallery-container">
      <h3>Your Images</h3>

      {error && <p className="error-message">{error}</p>}

      <div className="image-grid">
        {images.length === 0 ? (
          <p className="no-images-message">No images available.</p>
        ) : (
          images.map((img, idx) => (
            <div key={idx} className="image-card">
              <img
                src={img.path}
                alt={img.name}
                className="image"
                onError={(e) => {
                  console.error(`❌ Failed to load: ${img.path}`);
                  e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                }}
                onLoad={() => {
                  console.log(`✅ Successfully loaded: ${img.path}`);
                }}
              />
              <div className="image-name">{img.name}</div>
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
