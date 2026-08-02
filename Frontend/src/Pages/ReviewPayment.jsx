import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import SlideBar from '../Component/SlideBar';
import Footer from '../Component/Footer';
import '../css/StaticPage.css';

import {
  bookingContext,
  flightDetailsContext,
  passengerListResponseContext,
  selectedSeatsContext
} from '../App';

import { totalPriceContext } from './../App';
import { countries } from '../Component/country';
import { makePayment } from '../Service/payment';

function ReviewPayment() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const location = useLocation();
  const bookingBasePayload = location.state;

  //console.log("basepayload " + bookingBasePayload.ticketClass);


  const { selectedOneway, selectedRoundtrip } = useContext(flightDetailsContext);
  const { passengerRespList } = useContext(passengerListResponseContext);
  const { selectedSeats, selectedReturnSeats } = useContext(selectedSeatsContext);
  const { total } = useContext(totalPriceContext);
  const { mainBooking } = useContext(bookingContext);

  const navigate = useNavigate();

  const sum = passengerRespList.length * (total || 0);

  const handleConfirm = async () => {
    if (!paymentMethod) return toast.error('Please select a payment method');

    // Validate return trip seat selection
    if (selectedRoundtrip && selectedReturnSeats?.length !== passengerRespList.length) {
      return toast.error('Please select return seats for all passengers');
    }

    setConfirmed(true);

    const hasValidReturn =
      selectedRoundtrip &&
      selectedReturnSeats?.length === passengerRespList?.length;

    const requestData = {
      bookingId: mainBooking.bookingId,
      returnBookingId: mainBooking.returnBookingId,

      amountPaid: sum,
      paymentMethod: paymentMethod,

      passengerIds: passengerRespList.map(p => p.passengerId || p.id).filter(Boolean),
      seatIds: selectedSeats.map(seat => seat.seatId).filter(Boolean),

      returnPassengerIds: passengerRespList.map(p => p.passengerId || p.id).filter(Boolean),

      returnSeatIds: selectedReturnSeats.map(seat => seat.seatId).filter(Boolean),


      ticketClass: bookingBasePayload.ticketClass || 'ECONOMY',
      ticketType: selectedRoundtrip ? 'ROUND_TRIP' : 'ONE_WAY'
    };

    //console.log("Payment Request Data:", requestData);

    const result = await makePayment(requestData);
    //console.log("Payment data " + result);
    if (result) {
      setTimeout(() => {
        navigate('/booking-confirmation');
      }, 1500);
    } else {
      setConfirmed(false);
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div>
      <SlideBar />
      <div className="container mt-5 mb-5 static-page">
        <h2 className="text-center text-success mb-5 fw-bold">Review & Payment</h2>

        <div className="card p-4 shadow-sm border-0 rounded-4 review-payment-card">
          {/* One Way Flight Details */}
          <section className="mb-4">
            <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
              <i className="fa-solid fa-plane-departure"></i> OneWay Flight Details
            </h4>
            <div className="row mb-2">
              <div className="col-md-6"><strong>Airline:</strong> {selectedOneway.airline}</div>
              <div className="col-md-6"><strong>Flight Number:</strong> {selectedOneway.flightNo}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6"><strong>From:</strong> {selectedOneway.sourceName}</div>
              <div className="col-md-6"><strong>To:</strong> {selectedOneway.destName}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6"><strong>Departure:</strong> {selectedOneway.depDate}</div>
              <div className="col-md-6"><strong>Arrival:</strong> {selectedOneway.arrDate}</div>
            </div>
          </section>

          {/* Roundtrip Flight Details */}
          {selectedRoundtrip && (
            <section className="mb-4">
              <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
                <i className="fa-solid fa-plane-return"></i> Roundtrip Flight Details
              </h4>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Airline:</strong> {selectedRoundtrip.airline}</div>
                <div className="col-md-6"><strong>Flight Number:</strong> {selectedRoundtrip.flightNo}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>From:</strong> {selectedRoundtrip.sourceName}</div>
                <div className="col-md-6"><strong>To:</strong> {selectedRoundtrip.destName}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Departure:</strong> {selectedRoundtrip.depDate}</div>
                <div className="col-md-6"><strong>Arrival:</strong> {selectedRoundtrip.arrDate}</div>
              </div>
            </section>
          )}

          <hr />

          {/* Passenger Details */}
          <section className="mb-4">
            <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
              <i className="fa-solid fa-user"></i> Passenger Details
            </h4>
            {passengerRespList.map((passenger, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-md-4"><strong>Name:</strong> {passenger.fullName}</div>
                <div className="col">
                  <strong>Nationality:</strong> {
                    countries.find(c => c.code === passenger.nationality)?.name || passenger.nationality
                  }
                </div>
                <div className="col-md-2">
                  <strong>Oneway Seat:</strong> {selectedSeats[index]?.seatNumber || 'Not Selected'}
                </div>
                {selectedRoundtrip && (
                  <div className="col-md-2">
                    <strong>Return Seat:</strong> {selectedReturnSeats[index]?.seatNumber || 'Not Selected'}
                  </div>
                )}
              </div>
            ))}
          </section>


          <hr />

          {/* Payment Section */}
          <section>
            <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
              <i className="fa-solid fa-credit-card"></i> Payment
            </h4>
            <p className="fs-5 fw-semibold">Total Price: <span className="text-success">₹{sum}</span></p>

            <div className="mb-4">
              <label htmlFor="paymentMethod" className="form-label fw-semibold">Select Payment Method</label>
              <select
                id="paymentMethod"
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="" disabled>-- Choose Payment Method --</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="UPI">UPI</option>
                <option value="WALLET">Wallet</option>
                <option value="PAY_LATER">Pay Later</option>
                <option value="REWARD_POINTS">Reward Points</option>
                <option value="CASH">Cash</option>
              </select>
              <div id="paymentHelp" className="form-text">Please select one payment option to proceed.</div>
            </div>

            <button
              className="btn btn-success px-5 fw-bold"
              onClick={handleConfirm}
              disabled={confirmed}
              aria-live="polite"
            >
              <i className={`fa-solid me-2 ${confirmed ? 'fa-spinner fa-spin' : 'fa-check-circle'}`}></i>
              {confirmed ? 'Processing...' : 'Confirm Payment'}
            </button>

            {confirmed && (
              <div className="alert alert-success mt-4 d-flex align-items-center gap-2" role="alert">
                <i className="fa-solid fa-circle-check"></i>
                Payment successful! Booking status: <strong>CONFIRMED</strong>.
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReviewPayment;
