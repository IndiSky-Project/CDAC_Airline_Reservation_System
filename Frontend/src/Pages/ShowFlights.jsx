import React, { useContext, useEffect, useState } from 'react';
import SlideBar from '../Component/SlideBar';
import Search from '../Component/Search';
// import Sidebar from '../Component/SideBar';
import { useNavigate } from 'react-router-dom';
import { GetFlightSearch } from '../Service/flight';
import {
  infoContext,
  flightDetailsContext,
  totalPriceContext,
  searchedFlightsContext,
} from '../App';
import '../css/ShowFlights.css';

function FlightCard({ flight, isSelected, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}  
      className={`flight-card ${isSelected ? 'selected' : ''}`  }
      onClick={() => onSelect(flight)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(flight)}
    >
      <p className="flight-airline">{flight.airline}</p>
      <div className="flight-details">
        <div className="flight-time">
          <h4>{flight.dep}</h4>
          <h5>{flight.from}</h5>
        </div>
        <div className="flight-duration">
          <p>{flight.duration}</p>
          <hr />
        </div>
        <div className="flight-time">
          <h4>{flight.arr}</h4>
          <h5>{flight.to}</h5>
        </div>
        <div className="flight-price">₹{flight.price}</div>
      </div>
    </div>
  );
}

function ShowFlights() {
  const { info, setInfo } = useContext(infoContext);
  const { selectedOneway, setSelectedOneway, selectedRoundtrip, setSelectedRoundtrip } =
    useContext(flightDetailsContext);
  const { total, setTotal } = useContext(totalPriceContext);
  const { searched } = useContext(searchedFlightsContext);

  const navigate = useNavigate();
  const [oneWayFlights, setOneWayFlights] = useState([]);
  const [roundTripFlights, setRoundTripFlights] = useState([]);

  useEffect(() => {
    if (info.trip === 'OneWay') {
      setSelectedRoundtrip(null);
    }
    const totalPrice =
      (selectedOneway ? selectedOneway.price : 0) +
      (selectedRoundtrip ? selectedRoundtrip.price : 0);
    setTotal(totalPrice);
  }, [selectedOneway, selectedRoundtrip, info.trip]);

  function formatDuration(dep, arr) {
    const depTime = new Date(dep);
    const arrTime = new Date(arr);
    const diffMs = arrTime - depTime;
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  async function onGetFlightSearch() {
    const { trip, from, to, departure, arrival, passenger } = info;
    const result = await GetFlightSearch(trip, from, to, departure, arrival,  passenger);
    //console.log(result);

    if (result) {
      const onewayformat = (result.onewayFlights || []).map(f => ({
        id: f.flightId,
        airline: f.airline.airlineName,
        from: f.sourceAirport.iataCode,
        to: f.destinationAirport.iataCode,
        sourceName: f.sourceAirport.city,
        destName: f.destinationAirport.city,
        dep: f.departureTime.split("T")[1].substring(0, 5),
        arr: f.arrivalTime.split("T")[1].substring(0, 5),
        depDate: f.departureTime.split("T")[0],
        arrDate: f.arrivalTime.split("T")[0],
        flightNo: f.flightNumber,
        duration: formatDuration(f.departureTime, f.arrivalTime),
        price: f.basePrice
      }));

      const roudtripformat = (result.roundTripFlights || []).map(f => ({
        id: f.flightId,
        airline: f.airline.airlineName,
        from: f.sourceAirport.iataCode,
        to: f.destinationAirport.iataCode,
        sourceName: f.sourceAirport.city,
        destName: f.destinationAirport.city,
        dep: f.departureTime.split("T")[1].substring(0, 5),
        arr: f.arrivalTime.split("T")[1].substring(0, 5),
        depDate: f.departureTime.split("T")[0],
        arrDate: f.arrivalTime.split("T")[0],
        flightNo: f.flightNumber,
        duration: formatDuration(f.departureTime, f.arrivalTime),
        price: f.basePrice
      }));


      setOneWayFlights(onewayformat);
      setRoundTripFlights(roudtripformat);
    }
  }

  useEffect(() => {
    onGetFlightSearch();
  }, []);

  useEffect(() => {
    if (searched) {
      onGetFlightSearch();
    }
  }, [searched, info]);


  const bookFlights = () => navigate('/review');

  return (
    <>
      <SlideBar />
      {/* <SideBa /> */}
      <Search />

      <div className="container my-3" style={{ paddingBottom: "120px" }}>

        
        {/* Trip Summary    */}

        {info.from && info.to && info.passenger && info.Tclass && (
          <div className="trip-summary d-flex justify-content-around bg-info p-3 rounded text-white mb-4">
            <span>{info.from}</span>
            <span>{info.to}</span>
            <span>{info.departure}</span>
            <span>{info.arrival || ''}</span>
            <span>
             Passenger {info.passenger}  {info.Tclass === 'Premium_Economy' ? 'Premium' : info.Tclass } Class
            </span>
          </div>
        )}


        {/*   Tabs  */}
        <div className="row text-center mb-3 trip-tabs" role="tablist">
          <div
            role="tab"
            tabIndex={0}
            aria-selected={info.trip === 'OneWay'}
            className={`col tab ${info.trip === 'OneWay' ? 'tab-active' : ''}`}
            onClick={() => setInfo({ ...info, trip: 'OneWay' })}
            onKeyDown={(e) => e.key === 'Enter' && setInfo({ ...info, trip: 'OneWay' })}
          >
            One Way
          </div>

          <div
            role="tab"
            tabIndex={0}
            aria-selected={info.trip === 'RoundTrip'}
            className={`col tab ${info.trip === 'RoundTrip' ? 'tab-active' : ''}`}
            onClick={() => setInfo({ ...info, trip: 'RoundTrip' })}
            onKeyDown={(e) => e.key === 'Enter' && setInfo({ ...info, trip: 'RoundTrip' })}
          >
            Round Trip
          </div>
        </div>

        {/* Flight Cards */}
        <div className="row">
          {info.trip === 'RoundTrip' ? (
            <>
              <div className="col-6 d-flex flex-column align-items-center">
                {oneWayFlights.length > 0 ? (
                  oneWayFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      isSelected={selectedOneway?.id === flight.id}
                      onSelect={setSelectedOneway}
                    />
                  ))
                ) : (
                  <p className="text-muted">No one-way flights found for this route.</p>
                )}
              </div>
              <div className="col-6 d-flex flex-column align-items-center">
                {roundTripFlights.length > 0 ? (
                  roundTripFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      isSelected={selectedRoundtrip?.id === flight.id}
                      onSelect={setSelectedRoundtrip}
                    />
                  ))
                ) : (
                  <p className="text-muted">No round trip flights found for this route.</p>
                )}
              </div>
            </>
          ) : (
            <div className="col d-flex flex-column align-items-center">
              {oneWayFlights.length > 0 ? (
                oneWayFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isSelected={selectedOneway?.id === flight.id}
                    onSelect={setSelectedOneway}
                  />
                ))
              ) : (
                <p className="text-muted">No one-way flights found for this route.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Summary  Bar */}
      {(info.trip === 'OneWay' && selectedOneway) ||
        (info.trip === 'RoundTrip' && selectedOneway && selectedRoundtrip) ? (
        <div className="fixed-bottom booking-summary-container p-3 bg-light shadow-lg" style={{position:'fixed', bottom:0,zIndex: 1050}} >
          <div className="container d-flex justify-content-between align-items-center">
            <div className="booking-flight-details d-flex">
              <div className="booking-flight-card">
                <p>{selectedOneway.airline}</p>
                <div className="d-flex justify-content-around">
                  <span>{selectedOneway.from}</span>
                  <span>{selectedOneway.to}</span>
                  <span>₹{selectedOneway.price}</span>
                </div>
              </div>

              {info.trip === 'RoundTrip' && selectedRoundtrip && (
                <div className="booking-flight-card ms-4">
                  <p>{selectedRoundtrip.airline}</p>
                  <div className="d-flex justify-content-around">
                    <span>{selectedRoundtrip.from}</span>
                    <span>{selectedRoundtrip.to}</span>
                    <span>₹{selectedRoundtrip.price}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="booking-total d-flex align-items-center">
              <h3 className="me-3">₹{total}</h3>
              <button className="btn btn-success btn-lg" onClick={bookFlights}>
                Book
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ShowFlights;
