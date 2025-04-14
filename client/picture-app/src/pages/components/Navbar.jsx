import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Ensure you have the correct CSS file

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo/Title */}
        <Link to="/" className="logo">
          Gallery
        </Link>

        {/* Desktop Navbar Links */}
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/content" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/upload" className="nav-link">Upload</Link>
          </li>
          <li>
            <Link to="/" className="nav-link" onClick={() => { localStorage.removeItem('token'); }}>Logout</Link>
          </li>
        </ul>

        {/* Mobile Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
