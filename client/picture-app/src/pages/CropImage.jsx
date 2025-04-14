import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Import the cropperjs CSS
import { useLocation } from 'react-router-dom';

function CropImage() {
  const [imageSrc, setImageSrc] = useState('');
  const cropperRef = useRef(null); // Reference to the Cropper component
  const location = useLocation(); // Use useLocation to get passed state

  // On load, get the image path from the passed state
  useEffect(() => {
    if (location.state && location.state.imageSrc) {
      setImageSrc(location.state.imageSrc); // Set the image path received from EditImage
      console.log("Received image path in CropPage:", location.state.imageSrc);
    } else {
      console.log("No image source found in state");
    }
  }, [location]);

  // Save the cropped image
  const handleSave = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current?.cropper; // Get the cropper instance
      if (!cropper) {
        console.error("Cropper instance is not initialized");
        return;
      }

      const canvas = cropper.getCroppedCanvas(); // Get the cropped canvas

      if (!canvas) {
        console.error("Failed to get cropped canvas");
        return;
      }

      // Convert the canvas to a data URL (base64 encoded image)
      const croppedImage = canvas.toDataURL(); // Convert canvas to image data URL
      console.log("Cropped Image Data URL:", croppedImage);

      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = croppedImage; // Use the data URL as the href for the download link
      link.download = 'cropped_image.png'; // Specify the file name for saving
      link.click(); // Trigger the download
    } else {
      console.error("Cropper reference not found!");
    }
  };

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      {/* Image on the left */}
      <div style={{ width: '70%', padding: '10px' }}>
        {imageSrc ? (
          <>
            <h3>Crop Your Image</h3>
            <Cropper
              src={imageSrc} // Set the image source to crop
              style={{ width: '100%' }} // Make sure the cropper fits in the container
              ref={cropperRef} // Attach the ref to the cropper
              viewMode={1} // Set the cropper's view mode to limit movement
              dragMode="move" // Allow moving the image within the cropper
              guides={true} // Display guides
              responsive={true} // Ensure cropper is responsive
              autoCropArea={0.8} // Set initial crop area size
              background={true} // Show the background image when cropping
              checkOrientation={false} // Prevent orientation check (avoid issues with some devices)
            />
          </>
        ) : (
          <p>Loading Image...</p> // Show loading message if no image is found
        )}
      </div>

      {/* Sidebar on the right */}
      <div style={{ width: '30%', padding: '20px', textAlign: 'center' }}>
        <button
          onClick={() => window.history.back()}
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
          Back to Edit
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
          Save Cropped Image
        </button>
      </div>
    </div>
  );
}

export default CropImage;

