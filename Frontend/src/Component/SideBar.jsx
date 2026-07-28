
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SideBar.css';
import { Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';

function SlideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    toast.success('Logout Successful');
    sessionStorage.removeItem("token");
    // navigate('/user/login');
    navigate('/login');
  };

  // Auto-close sidebar on navigation
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button - always visible, fixed left */}
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h4>IndiSky</h4>
        </div>
        <ul className="sidebar-nav">
          <li><Link to="/" className="sidebar-link" onClick={handleLinkClick}>Home</Link></li>
          <li><Link to="/my-bookings" className="sidebar-link" onClick={handleLinkClick}>My Bookings</Link></li>
          {/* <li><Link to="/flight-status" className="sidebar-link" onClick={handleLinkClick}>Flight Status</Link></li> */}
          <li><Link to="/contact" className="sidebar-link" onClick={handleLinkClick}>Support</Link></li>
          <li><Link to="/payment-history" className="sidebar-link" onClick={handleLinkClick}>Payment History</Link></li>
          {/* <li><Link to="/booking-cancellation" className="sidebar-link" onClick={handleLinkClick}>Booking Cancellation</Link></li> */}

          <li>
            {token ? (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              // <Link to="/user/login" className="btn btn-outline-light" onClick={handleLinkClick}>
              <Link to="/login" className="btn btn-outline-light" onClick={handleLinkClick}>
                Login
              </Link>
            )}
          </li>
          
          
        
        </ul>
      </nav>
    </>
  );
}

export default SlideBar;
