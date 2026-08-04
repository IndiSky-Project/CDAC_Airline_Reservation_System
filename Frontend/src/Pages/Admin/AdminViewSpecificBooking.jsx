import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function AdminBookingDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.booking) {
    return <div>No booking data available.</div>;
  }

  const { booking } = state;
  const {
    bookingId,
    bookingDate,
    totalPrice,
    status,
    flight,
    payment,
    user
  } = booking;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Booking Info</h3>
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p><strong>Date:</strong> {new Date(bookingDate).toLocaleString()}</p>
          <p><strong>Total Price:</strong> ₹{totalPrice}</p>
          <p><strong>Status:</strong> {status}</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Flight Info</h3>
          <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
          <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
          <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
          <p><strong>Base Price:</strong> ₹{flight.basePrice}</p>
          <p><strong>Status:</strong> {flight.status}</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">User Info</h3>
          <p><strong>Full Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNo}</p>
          <p><strong>Passport No:</strong> {user.passportNo}</p>
          <p><strong>Role:</strong> {user.personRole}</p>
          <p><strong>DOB:</strong> {user.birthDate}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
          <p><strong>Amount Paid:</strong> ₹{payment.amountPaid}</p>
          <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
          <p><strong>Payment Status:</strong> {payment.paymentStatus}</p>
          <p><strong>Payment Date:</strong> {new Date(payment.paymentDate).toLocaleString()}</p>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
}

export default AdminBookingDetails;
