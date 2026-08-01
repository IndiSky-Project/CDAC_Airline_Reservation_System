
import React, { useContext, useEffect, useState } from 'react';
import '../css/SeatSelection.css';
import SlideBar from '../Component/SlideBar';
import Footer from '../Component/Footer';
import { useNavigate } from 'react-router-dom';
import { getSeatsByFlightId } from '../Service/flightSeat';
import {
  bookingContext,
  flightDetailsContext,
  passengerListContext,
  selectedSeatsContext,
  totalPriceContext,
} from '../App';
import { createBooking } from '../Service/booking';
import { toast } from 'react-toastify';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const seatIcon = (className) => {
  switch (className) {
    case 'FIRST':
      return '⭐';
    case 'BUSINESS':
      return '💺';
    case 'PREMIUM':
      return '🛋️';
    case 'ECONOMY':
    default:
      return '🪑';
  }
};

function SeatSelection() {
  const { selectedOneway, selectedRoundtrip } = useContext(flightDetailsContext);
  const { passengerList } = useContext(passengerListContext);
  const {
    selectedSeats,
    setSelectedSeats,
    selectedReturnSeats,
    setSelectedReturnSeats,
  } = useContext(selectedSeatsContext);
  const [onewaySeats, setOnewaySeats] = useState([]);
  const [roundtripSeats, setRoundtripSeats] = useState([]);
  const { total } = useContext(totalPriceContext);
  const { setMainBooking } = useContext(bookingContext);

  const navigate = useNavigate();

  // Reset selected seats on mount to clear old context values
  useEffect(() => {
    setSelectedSeats([]);
    setSelectedReturnSeats([]);
  }, []);

  // Get userId from token
  const token = sessionStorage.getItem('token');
  let userId = null;
  if (token) {
    const decoded = parseJwt(token);
    if (decoded?.Id) {
      userId = decoded.Id;
    }
  }

  useEffect(() => {
    if (!selectedOneway?.id) return;

    const fetchSeats = async () => {
      const seatData = await getSeatsByFlightId(selectedOneway.id);
      setOnewaySeats(Array.isArray(seatData) ? seatData : []);
    };
    fetchSeats();
  }, [selectedOneway?.id]);

  useEffect(() => {
    if (!selectedRoundtrip?.id) return;

    const fetchSeats = async () => {
      const seatData = await getSeatsByFlightId(selectedRoundtrip.id);
      setRoundtripSeats(Array.isArray(seatData) ? seatData : []);
    };
    fetchSeats();
  }, [selectedRoundtrip?.id]);

  const isSeatBooked = (seat) => {
    if (!seat) return false;
    return seat.booked === true || seat.booked === 1 || seat.booked?.[0] === 1;
  };

  const getSeatDetails = (seatNumber, fromRoundtrip = false) => {
    const seats = fromRoundtrip ? roundtripSeats : onewaySeats;
    return seats.find((seat) => seat.seatNumber === seatNumber);
  };

  const toggleSeat = (seatNumber, fromRoundtrip = false) => {
    const seats = fromRoundtrip ? roundtripSeats : onewaySeats;
    const selected = fromRoundtrip ? selectedReturnSeats : selectedSeats;
    const setSelected = fromRoundtrip ? setSelectedReturnSeats : setSelectedSeats;

    const seat = seats.find((s) => s.seatNumber === seatNumber);
    if (!seat || isSeatBooked(seat)) return;

    const isSelected = selected.some((s) => s.seatNumber === seatNumber);

    if (isSelected) {
      setSelected(selected.filter((s) => s.seatNumber !== seatNumber));
    } else {
      if (selected.length >= passengerList.length) return;
      setSelected([...selected, seat]);
    }
  };

  const getSeatClass = (seatNumber, fromRoundtrip = false) => {
    const seat = getSeatDetails(seatNumber, fromRoundtrip);
    if (!seat) return 'seat';

    let className = 'seat';

    if (isSeatBooked(seat)) {
      className += ' booked';
      return className;
    }

    const isSelected = fromRoundtrip
      ? selectedReturnSeats.some((s) => s.seatNumber === seatNumber)
      : selectedSeats.some((s) => s.seatNumber === seatNumber);

    if (isSelected) {
      className += ' selected';
    }

    switch (seat.seatClass) {
      case 'BUSINESS':
        className += ' business';
        break;
      case 'PREMIUM':
        className += ' premium';
        break;
      case 'ECONOMY':
        className += ' economy';
        break;
      case 'FIRST':
        className += ' first';
        break;
      default:
        break;
    }

    return className;
  };

  const renderSeatMap = (seats, fromRoundtrip = false) => {
    // Remove duplicates by seatNumber + seatClass
    const uniqueSeats = seats.filter(
      (seat, index, self) =>
        index === self.findIndex((s) => s.seatNumber === seat.seatNumber && s.seatClass === seat.seatClass)
    );

    // Group seats by class
    const groupedSeats = uniqueSeats.reduce((acc, seat) => {
      const group = seat.seatClass || 'UNKNOWN';
      if (!acc[group]) acc[group] = [];
      acc[group].push(seat);
      return acc;
    }, {});

    return (
      <div className="plane-body">
        {Object.entries(groupedSeats).map(([className, groupSeats]) => (
          <div
            key={`${fromRoundtrip ? 'return' : 'oneway'}-${className}`}
            className="seat-class-group"
          >
            <h4 className="seat-class-header">{className} Class</h4>
            <div className="seat-row">
              {groupSeats
                .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                .map((seat, i) => (
                  <React.Fragment
                    key={`${fromRoundtrip ? 'return' : 'oneway'}-${seat.seatClass}-${seat.seatNumber}`}
                  >
                    {i === 3 && <div className="aisle-gap" />}
                    <div
                      className={getSeatClass(seat.seatNumber, fromRoundtrip)}
                      onClick={() => toggleSeat(seat.seatNumber, fromRoundtrip)}
                      title={`${seat.seatNumber} — ${seat.seatClass} Class ${isSeatBooked(seat) ? '(Booked)' : ''}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={
                        (fromRoundtrip
                          ? selectedReturnSeats.some((s) => s.seatNumber === seat.seatNumber)
                          : selectedSeats.some((s) => s.seatNumber === seat.seatNumber))
                          ? 'true'
                          : 'false'
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSeat(seat.seatNumber, fromRoundtrip);
                        }
                      }}
                    >
                      <span className="seat-icon">{seatIcon(seat.seatClass)}</span>
                      <span className="seat-number">{seat.seatNumber}</span>
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleProceed = async () => {
    const selectedSeatObjects = selectedSeats.map((s) => getSeatDetails(s.seatNumber));
    const seatIds = selectedSeatObjects.map((seat) => seat?.seatId).filter(Boolean);

    const returnSeatObjects = selectedReturnSeats.map((s) => getSeatDetails(s.seatNumber, true));
    const returnSeatIds = returnSeatObjects.map((seat) => seat?.seatId).filter(Boolean);

    const basePayload = {
      userId: userId, // logged in userId
      flightId: selectedOneway?.id,
      seatIds,
      ticketType: selectedRoundtrip ? 'ROUND_TRIP' : 'ONE_WAY',
      ticketClass: selectedSeatObjects[0]?.seatClass || 'ECONOMY',
      totalPrice:
        selectedOneway?.price * passengerList.length +
        (selectedRoundtrip?.price || 0) * passengerList.length,
    };

    if (selectedRoundtrip?.id) {
      basePayload.returnFlightId = selectedRoundtrip.id;
      basePayload.returnSeatIds = returnSeatIds;
    }

    try {
      const result = await createBooking(basePayload);
      if (result) {
        setMainBooking(result);
        navigate('/review-payment', { state: basePayload });
      }
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    }
  };

  return (
    <>
      <SlideBar />
      <div className="main-seat-container">
        <div className="seat-selection-container">
          <h2 className="page-title">Select Your Seat(s)</h2>

          <div className="legend">
            <div className="legend-item">
              <span className="seat-icon">🪑</span> Economy
            </div>
            <div className="legend-item">
              <span className="seat-icon">🛋️</span> Premium Economy
            </div>
            <div className="legend-item">
              <span className="seat-icon">💺</span> Business
            </div>
            <div className="legend-item">
              <span className="seat-icon">⭐</span> First Class
            </div>
            <div className="legend-item">
              <span className="seat selected" /> Selected
            </div>
            <div className="legend-item">
              <span className="seat booked" /> Booked
            </div>
          </div>

          <section className="flight-seat-section">
            <h3 className="section-title">Oneway Flight Seat Map</h3>
            {onewaySeats.length === 0 ? (
              <p className="no-seats-msg">No seats available for oneway flight.</p>
            ) : (
              renderSeatMap(onewaySeats)
            )}
          </section>

          {selectedRoundtrip?.id && (
            <section className="flight-seat-section return-flight-section">
              <h3 className="section-title">Return Flight Seat Map</h3>
              {roundtripSeats.length === 0 ? (
                <p className="no-seats-msg">No seats available for return flight.</p>
              ) : (
                renderSeatMap(roundtripSeats, true)
              )}
            </section>
          )}

          <div className="selection-summary">
            <h3>Selected Seats:</h3>
            <p>
              Oneway:{' '}
              {selectedSeats.length > 0 ? selectedSeats.map((s) => s.seatNumber).join(', ') : 'None'}
            </p>
            {selectedRoundtrip?.id && (
              <p>
                Return:{' '}
                {selectedReturnSeats.length > 0
                  ? selectedReturnSeats.map((s) => s.seatNumber).join(', ')
                  : 'None'}
              </p>
            )}
            <p>Total Passengers: {passengerList.length}</p>
            <p>
              Seats selected:{' '}
              {selectedSeats.length +
                (selectedRoundtrip?.id ? selectedReturnSeats.length : 0)}{' '}
              / {passengerList.length * (selectedRoundtrip?.id ? 2 : 1)}
            </p>
          </div>

          <button
            className="proceed-btn"
            onClick={handleProceed}
            disabled={
              selectedSeats.length !== passengerList.length ||
              (selectedRoundtrip?.id && selectedReturnSeats.length !== passengerList.length)
            }
            aria-disabled={
              selectedSeats.length !== passengerList.length ||
              (selectedRoundtrip?.id && selectedReturnSeats.length !== passengerList.length)
            }
          >
            Confirm Booking
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SeatSelection;
