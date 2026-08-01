import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminViewBookings.css';
import AdminSidebar from '../../Component/Admin/AdminSidebar';
import AdminHeader from '../../Component/Admin/AdminHeader';
import "../../css/AdminHeader.css";
import { myAxios } from '../../Service/config';
import { Modal, Button } from 'react-bootstrap';

function AdminViewBookings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ date: '', flight: '', status: '' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await myAxios.get("/admin/booking/showAll");
        const sortedBookings = response.data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const bookingStatus = booking.status?.toLowerCase() || '';

    return (
      (!filters.date || booking.bookingDate.slice(0, 10) === filters.date) &&
      (!filters.flight || booking.flight.flightNumber.toLowerCase().includes(filters.flight.toLowerCase())) &&
      (!filters.status || bookingStatus === filters.status.toLowerCase())
    );
  });

  return (
    <div className={`admin-page-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminHeader />

      <div className="admin-body d-flex">
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <main className="admin-main flex-grow-1 px-4 pt-4">
          <div className="main-content">
            <h1 className="mb-4">All Bookings</h1>

            <div className="card p-3 mb-4 shadow-sm bg-light">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Filter by Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Flight</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. AI-203"
                    value={filters.flight}
                    onChange={(e) => setFilters({ ...filters, flight: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-responsive shadow-sm">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Sr. No.</th>
                    <th>Date</th>
                    <th>Flight</th>
                    <th>Status</th>
                    <th className="text-end">Price (₹)</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking, index) => (
                      <tr key={booking.bookingId || index}>
                        <td>{index + 1}</td>
                        <td>{booking.bookingDate.slice(0, 10)}</td>
                        <td>{booking.flight.flightNumber}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="text-end">{booking.totalPrice.toLocaleString()}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowModal(true);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedBooking && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Booking ID: {selectedBooking.bookingId}</h5>
            <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleString()}</p>

            <hr />
            <h6>User Info</h6>
            <p><strong>Name:</strong> {selectedBooking.user?.fullName}</p>
            <p><strong>Email:</strong> {selectedBooking.user?.email}</p>
            <p><strong>Phone:</strong> {selectedBooking.user?.phoneNo}</p>
            <p><strong>Passport No:</strong> {selectedBooking.user?.passportNo}</p>

            <hr />
            <h6>Flight Info</h6>
            <p><strong>Flight No:</strong> {selectedBooking.flight?.flightNumber}</p>
            <p><strong>Departure:</strong> {new Date(selectedBooking.flight?.departureTime).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {new Date(selectedBooking.flight?.arrivalTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedBooking.flight?.status}</p>

            <hr />
            <h6>Payment Info</h6>
            <p><strong>Amount Paid:</strong> ₹{selectedBooking.payment?.amountPaid}</p>
            <p><strong>Status:</strong> {selectedBooking.payment?.paymentStatus}</p>
            <p><strong>Method:</strong> {selectedBooking.payment?.paymentMethod}</p>
            <p><strong>Payment Date:</strong> {new Date(selectedBooking.payment?.paymentDate).toLocaleString()}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Confirmed':
      return 'bg-success';
    case 'Pending':
      return 'bg-warning';
    case 'Cancelled':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}

export default AdminViewBookings;
