import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ContentPage from './pages/ContentPage';
import EditImage from './pages/EditImage';
import CropImage from './pages/CropImage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/edit-image" element={<EditImage />} /> 
          <Route path="/crop-image" element={<CropImage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
