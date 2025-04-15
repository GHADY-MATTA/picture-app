import React, { useState } from 'react';
import "./ContentPage";
import Navbar from './components/Navbar';
import UploadPicture from './components/UploadPicture';
import ImageGallery from './components/ImageGallery'; // (we'll build this next)
import ChatBox from './components/ChatBox';

function ContentPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="content-page">
      <Navbar />
      <div className="content-container">
        <h2>Welcome to your gallery!</h2>
         <div className="p-4">
      <ChatBox />
    </div>
        <UploadPicture onUploadSuccess={handleRefresh} />
        <ImageGallery refreshKey={refreshKey} />
       
      </div>
    </div>
  );
}

export default ContentPage;
