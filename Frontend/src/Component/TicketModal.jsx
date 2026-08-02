
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Badge } from 'react-bootstrap';

function TicketModal({ bookingId, onClose }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      axios
        .get(`http://localhost:8080/api/ticket/download/${bookingId}`)
        .then((res) => {
          setTicket(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching ticket:', err);
          setLoading(false);
        });
    }
  }, [bookingId]);

  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>🎫 Flight Ticket Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : ticket ? (
          <div className="ticket-details p-3 bg-light rounded shadow-sm">
            {/* Passenger & Status */}
            <div className="row mb-3">
              <div className="col-md-6">
                <h4 className="text-primary fw-bold mb-1">{ticket.userName}</h4>
                <p className="text-muted mb-0"><i className="bi bi-calendar2-check" /> Issued: {new Date(ticket.issuedDate).toLocaleString()}</p>
              </div>
              <div className="col-md-6 text-md-end mt-2">
                <Badge bg={ticket.bookingStatus === 'CANCELLED' ? 'danger' : 'success'} className="fs-6">
                  {ticket.bookingStatus}
                </Badge>
              </div>
            </div>

            <hr />

            {/* Flight Details */}
            <div className="row mb-4">
              <div className="col-md-4">
                <p><strong>✈ Flight:</strong> {ticket.flightNumber}</p>
                <p><strong>🎟 Class:</strong> {ticket.ticketClass}</p>
              </div>
              <div className="col-md-4">
                <p><strong>📍 From:</strong> {ticket.source}</p>
                <p><strong>🏁 To:</strong> {ticket.destination}</p>
              </div>
              <div className="col-md-4">
                <p><strong>🕓 Departure:</strong><br />{new Date(ticket.flightDateTime).toLocaleString()}</p>
              </div>
            </div>

            <hr />

            {/* Passenger & Seat */}
            <div className="row mb-4">
              <div className="col-md-6">
                <p><strong>👤 Passengers:</strong></p>
                <ul className="list-group list-group-flush">
                  {ticket.passengerNames.map((name, idx) => (
                    <li key={idx} className="list-group-item ps-3">{name}</li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <p><strong>💺 Seats:</strong></p>
                <ul className="list-group list-group-flush">
                  {ticket.seatNumbers.map((seat, idx) => (
                    <li key={idx} className="list-group-item ps-3">{seat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <hr />

            {/* Payment Summary */}
            <div className="text-end pe-2">
              <h5><strong>💰 Total Paid:</strong> ₹{ticket.amountPaid}</h5>
              <p className="text-muted mb-0"><strong>🚦 Flight Status:</strong> {ticket.flightStatus}</p>
              <p className="text-muted"><strong>Type:</strong> {ticket.ticketType}</p>
            </div>
          </div>
        ) : (
          <p className="text-danger text-center">⚠ Failed to load ticket details.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TicketModal;
