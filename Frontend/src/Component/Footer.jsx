import React from 'react';
import '../css/Footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="container text-center">
        <h5 className="footer-brand mb-3">
          <img src="Logo.png" alt="logo" className="footer-logo" />
          IndiSky
        </h5>
        <p className="footer-tagline">Your trusted partner for seamless flight bookings.</p>

        <div className="footer-links mb-3">
          
          <a href="#about" className="footer-link">About Us</a>
          <a href="#contact" className="footer-link">Contact</a>
          <a href="/terms" className="footer-link">Terms & Privacy</a>
        </div>

        <p className="footer-copy">
          <b>&copy; {new Date().getFullYear()} IndiSky. All rights reserved.</b>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
