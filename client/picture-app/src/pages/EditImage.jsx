import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 🔐 Electron fallback-safe require
const electron = window.require ? window.require('electron') : null;
const ipcRenderer = electron?.ipcRenderer;

function EditImage() {
  const [imageSrc, setImageSrc] = useState(''); // Default as empty string
  const [editedImage, setEditedImage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // On load, get the image path from the query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const imgPath = queryParams.get('img');
    if (imgPath) {
      setImageSrc(decodeURIComponent(imgPath)); // Decode and set the image path
    }
  }, [location]);

  // Go back to the gallery page
  const handleBack = () => {
    navigate('/content');
  };

  // Go to the crop page
  const handleCrop = () => {
    console.log("Sending image path to crop page:", imageSrc); // Log the path being passed
    navigate('/crop-image', { state: { imageSrc } }); // Pass image source to the crop page

  };

  // Apply black and white filter to the image
  const handleBlackAndWhite = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgElement = document.getElementById('imageToEdit'); // Get the image element

    // Check if image exists before applying filter
    if (!imgElement) return;

    // Set canvas size to match the image size
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0); // Draw the image onto the canvas

    // Get pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Loop through each pixel and convert it to grayscale (average of RGB)
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }

    // Put the modified image data back to the canvas
    ctx.putImageData(imageData, 0, 0);

    // Set the edited image as a data URL for the canvas
    setEditedImage(canvas.toDataURL());
  };

  // Save the image
  const handleSave = () => {
    if (!editedImage) return; // Avoid saving if no image is edited
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited_image.png'; // Specify the file name for saving
    link.click(); // Trigger the download
  };

  // Handle Delete
  const handleDelete = async () => {
    const imageName = imageSrc.split('/').pop(); // Extract image name from the src URL
    // const result = await ipcRenderer.invoke('delete-image', { name: imageName });
    const result = await window.electronAPI.deleteImage({ name: imageName });

    
    if (result.success) {
      alert(result.message); // Notify the user of successful deletion
      navigate('/content'); // Redirect back to the gallery page
    } else {
      alert(result.message); // Notify the user of the failure
    }
  };

  // If no image is provided, do not render the image element
  if (!imageSrc) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      {/* Image on the left */}
      <div style={{ width: '70%', padding: '10px' }}>
        {imageSrc && (
          <img
            id="imageToEdit"
            src={editedImage || imageSrc}  // If edited image exists, use it, otherwise use the original
            alt="Edit"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
      </div>

      {/* Sidebar on the right */}
      <div style={{ width: '30%', padding: '20px', textAlign: 'center' }}>
        <button
          onClick={handleBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1f7a8c',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          Back to Gallery
        </button>

        {/* Black & White Button */}
        <button
          onClick={handleBlackAndWhite}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1f7a8c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          Apply Black & White
        </button>

        {/* Crop Button */}
        <button
          onClick={handleCrop}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1f7a8c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          Crop Image
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Save Image
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '10px',
          }}
        >
          Delete Image
        </button>
      </div>
    </div>
  );
}

export default EditImage;
