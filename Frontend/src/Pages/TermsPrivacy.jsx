import React from 'react';
import SlideBar from '../Component/SlideBar';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import '../css/StaticPage.css'; 

function TermsPrivacy() {
  return (
    <div>
    <Sidebar />
      <SlideBar />

      <div className="container mt-5 mb-5 static-page">
        <h2 className="page-title text-center mb-4">Terms & Conditions / Privacy Policy</h2>

        <div className="accordion" id="termsAccordion">
          {/* Terms Section */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="termsHeading">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#termsCollapse"
                aria-expanded="true"
              >
                Terms & Conditions
              </button>
            </h2>
            <div
              id="termsCollapse"
              className="accordion-collapse collapse show"
              aria-labelledby="termsHeading"
            >
              <div className="accordion-body">
                <p>
                  By using <b>IndiSky</b>, you agree to comply with and be bound by the following terms:
                </p>
                <ul>
                  <li>All bookings are subject to availability and confirmation.</li>
                  <li>IndiSky reserves the right to update pricing and policies without notice.</li>
                  <li>Users are responsible for providing accurate personal and travel details.</li>
                  <li>Refund and cancellation policies depend on the airline's rules and IndiSky’s internal policies.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="privacyHeading">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#privacyCollapse"
              >
                Privacy Policy
              </button>
            </h2>
            <div
              id="privacyCollapse"
              className="accordion-collapse collapse"
              aria-labelledby="privacyHeading"
            >
              <div className="accordion-body">
                <p>
                  <b>IndiSky</b> is committed to protecting your personal data:
                </p>
                <ul>
                  <li>Your data is used to manage bookings and enhance your experience.</li>
                  <li>We never sell your data and only share with third parties when necessary.</li>
                  <li>We follow industry-standard security protocols to protect your information.</li>
                  <li>By using our services, you consent to this privacy policy.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-4">
          For any concerns, please reach out via our <a href="/home#contact">Contact Page</a>.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default TermsPrivacy;
