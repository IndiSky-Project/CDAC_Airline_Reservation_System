import React, { useContext, useEffect, useState,useRef  } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../css/StaticPage.css';
import SlideBar from '../Component/SlideBar';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import { useNavigate } from 'react-router-dom';
import '../css/StaticPage.css';

import {
  bookingContext,
  flightDetailsContext,
} from '../App';

import { getBooking } from '../Service/booking'; 

function BookingConfirmation() {
  const { mainBooking } = useContext(bookingContext);
  const { selectedRoundtrip, selectedOneway } = useContext(flightDetailsContext);

  const [onewayBookingData, setOnewayBookingData] = useState(null);
  const [returnBookingData, setReturnBookingData] = useState(null);
const pdfRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (mainBooking?.bookingId) {
        const oneWayData = await getBooking(mainBooking.bookingId);
        setOnewayBookingData(oneWayData);
      }

      if (mainBooking?.returnBookingId) {
        const returnData = await getBooking(mainBooking.returnBookingId);
        setReturnBookingData(returnData);
      }
    };

    fetchBookings();
  }, [mainBooking]);

  const handleDownload = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('E-Ticket.pdf');
    });
  };

  const handleGoToBookings = () => {
    navigate('/my-bookings');
  };

  return (
    <div>
      <SlideBar />
      <Sidebar />
      <div className="container mt-5 mb-5 static-page" ref={pdfRef}>
        <div className="text-center mb-4">
          <h2 className="text-success fw-bold">Booking Confirmed!</h2>
          <p className="text-muted">Your tickets have been booked successfully.</p>
        </div>

        {/* Oneway Booking Section */}
        {onewayBookingData && (
          <div className="card shadow-sm p-4 mb-4">
            <h5 className="text-primary"><i className="fa-solid fa-plane-departure me-2"></i>One Way Flight Info</h5>
            <p className="ms-4"><b>From:</b> {selectedOneway.sourceName} → <b>To:</b> {selectedOneway.destName}</p>
            <p className="ms-4"><b>Flight No:</b> {onewayBookingData.flightNumber}</p>
            <p className="ms-4"><b>Date:</b> {selectedOneway.depDate}</p>

            <hr />

            <h5 className="text-primary"><i className="fa-solid fa-users me-2"></i>Passengers & Seats</h5>
            <ul className="ms-4">
              {onewayBookingData.passengerNames.map((name, index) => (
                <li key={index}>{name} - Seat: {onewayBookingData.seatNumbers[index]}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Return Booking Section */}
        {selectedRoundtrip && returnBookingData && (
          <div className="card shadow-sm p-4 mb-4">
            <h5 className="text-primary"><i className="fa-solid fa-plane-arrival me-2"></i>Return Flight Info</h5>
            <p className="ms-4"><b>From:</b> {selectedRoundtrip.sourceName} → <b>To:</b> {selectedRoundtrip.destName}</p>
            <p className="ms-4"><b>Flight No:</b> {returnBookingData.flightNumber}</p>
            <p className="ms-4"><b>Date:</b> {selectedRoundtrip.depDate}</p>

            <hr />

            <h5 className="text-primary"><i className="fa-solid fa-users me-2"></i>Passengers & Seats</h5>
            <ul className="ms-4">
              {returnBookingData.passengerNames.map((name, index) => (
                <li key={index}>{name} - Seat: {returnBookingData.seatNumbers[index]}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 d-flex gap-3 flex-wrap justify-content-center">
          <button className="btn btn-outline-primary px-4" onClick={handleDownload}>
            <i className="fa-solid fa-download me-2"></i>Download E-Ticket
          </button>
          <button className="btn btn-success px-4" onClick={handleGoToBookings}>
            <i className="fa-solid fa-list-check me-2"></i>Go to My Bookings
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingConfirmation;
