import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/Popup.css';
import '../css/SlideBar.css'; 

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function SlideBar() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  let userName = "";
  if (token) {
    const decoded = parseJwt(token);
    if (decoded?.Name) {
      userName = decoded.Name;
    }
  }

  function onLogout() {
    toast.success('Logout Successful');
    sessionStorage.removeItem("token");
    // navigate('/user/login');
    navigate('/login');
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar px-2">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="Logo.png" alt="logo" className="brand-logo" />
          <span className="brand-name ms-2">IndiSky</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {[
              { name: 'Home', path: '/' },
              { name: 'Flight Status', path: '/flight-status' },
              //{ name: 'Payment History', path: '/payment-history' },
              { name: 'Profile', path: '/profile' },
              { name: 'My Bookings', path: '/my-bookings' },
              { name: 'Search Flights', path: '/show-flights' },
            ].map((link, idx) => (
              <li className="nav-item" key={idx}>
                <Link className="nav-link nav-hover" to={link.path}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {userName ? (
              <>
                <span className="welcome-text">Hello, {userName}</span>
                <button type="button" className="btn btn-outline-light logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* No greeting shown */}
                {/* <Link to="/user/login" className="btn btn-outline-light"> */}
                <Link to="/login" className="btn btn-outline-light">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default SlideBar;
