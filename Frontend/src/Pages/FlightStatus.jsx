import React, { useState } from 'react';
import SlideBar from '../Component/SlideBar';
import Footer from '../Component/Footer';
import Sidebar from '../Component/Sidebar';
import '../css/FlightStatus.css';
import { getFlightStatusByNumber } from '../Service/flightStatusLog';



function FlightStatus() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');


  const handleCheckStatus = async () => {
    setError('');
    setResult(null);
    if (!query) {
      alert('Please enter Flight Number');
      return;
    }


    try {
      const data = await getFlightStatusByNumber(query);

      const flightData = {
        flightNo: query.toUpperCase(),
        status: data.status,
        updatedAt: data.updatedAt
      };


      setResult(flightData);
    } 
    
    
    catch (err) {
      console.error(err);
      setError('Flight not found or backend error occurred.');
    }

    
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CANCELLED': return 'badge badge-danger';
      case 'DELAYED': return 'badge badge-warning';
      case 'SCHEDULED': return 'badge badge-info';
      case 'ON TIME': return 'badge badge-success';
      default: return 'badge badge-secondary';
    }
  };

  return (
    <div>
      <SlideBar />
      <Sidebar />

      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4 title-purple" style={{marginTop:"76px"}}>Flight Status Tracking</h2>

        <div className="status-box shadow-sm">
          <div className="form-group mb-3">
            <label className="form-label">Enter Flight Number</label>
            <input
              type="text"
              className="form-control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. IN101"
            />
          </div>
          <button className="btn btn-primary" onClick={handleCheckStatus}>Check Status</button>
        </div>

        {error && (
          <div className="result-box mt-4 shadow-sm">
            <p className="text-danger"><b>{error}</b></p>
          </div>
        )}

        {result && (
          <div className="result-box mt-4 shadow-sm">
            <p><b>Flight Number:</b> {result.flightNo}</p>
            <p><b>Status:</b> <span className={getStatusBadge(result.status)}>{result.status}</span></p>
            <p><b>Last Updated:</b> {new Date(result.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default FlightStatus;
