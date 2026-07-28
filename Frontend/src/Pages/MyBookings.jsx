import React, { useState, useEffect } from 'react';
import SlideBar from '../Component/SlideBar';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import TicketModal from '../Component/TicketModal';
import { getUserBookings, cancelBooking } from '../Service/booking';
import '../css/MyBookings.css';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const token = sessionStorage.getItem('token');
  const decoded = token ? parseJwt(token) : null;
  const userId = decoded?.Id ?? null;

  useEffect(() => {
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    getUserBookings(userId)
      .then((data) => {
        const sortedBookings = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sortedBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Axios error:', err);
        setError('Failed to load bookings. Please try again.');
        setLoading(false);
      });
  }, [userId]);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      const updated = bookings.map((b) =>
        b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b
      );
      setBookings(updated);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Try again.');
    }
  };

  const handleViewTickets = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  return (
    <div>
      <SlideBar />
      <Sidebar />

      <div className="my-bookings-container" style={{ marginLeft: '250px', padding: '1rem' }}>
        <h2 className="heading">My Bookings</h2>

        {loading && <p>Loading bookings...</p>}
        {error && <p className="text-danger">{error}</p>}

        {bookings.length === 0 && !loading && !error && (
          <p>No bookings found.</p>
        )}

        {bookings.map((b, index) => (
          <div key={index} className="booking-card">
            <div className="booking-header">
              <h5>
                <i className="bi bi-airplane-engines-fill icon" /> {b.sourceAirport} → {b.destinationAirport}
              </h5>
              <span className={`status-badge ${b.status === 'CANCELLED' ? 'cancelled' : 'confirmed'}`}>
                {b.status}
              </span>
            </div>
            <hr />
            <div className="booking-info">
              <p><strong>Date:</strong> {new Date(b.bookingDate).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> ₹{b.totalPrice}</p>
            </div>
            <div className="booking-actions">
              <button className="view-btn" onClick={() => handleViewTickets(b.bookingId)}>View Ticket(s)</button>
              {b.status !== 'CANCELLED' && (
                <button className="cancel-btn" onClick={() => handleCancel(b.bookingId)}>Cancel Booking</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Footer />

      {showModal && (
        <TicketModal bookingId={selectedBookingId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default MyBookings;
