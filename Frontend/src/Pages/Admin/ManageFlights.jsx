
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../Component/Admin/AdminSidebar';
import AdminHeader from '../../Component/Admin/AdminHeader';
import "../../css/AdminHeader.css";
import { getFlights, addFlight, editFlight, deleteFlight } from '../../Service/flight'; 
import { toast } from 'react-toastify';

export default function ManageFlights() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    flightId: null,
    flightNumber: '',
    airlineName: '',
    sourceAirportIataCode: '',
    destinationAirportIataCode: '',
    departureTime: '',
    arrivalTime: '',
    status: 'SCHEDULED',
    basePrice: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 10;

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const data = await getFlights();
      setFlights(data);
    } catch (error) {
      toast.error("Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.flightId === null) {
        await addFlight(form);
        toast.success("Flight added successfully!");
      } else {
        await editFlight(form.flightId, form);
        toast.success("Flight updated successfully!");
      }
      fetchFlights();
      resetForm();
    } catch (error) {
      toast.error("Error saving flight.");
    }
  };

  const handleEdit = (flight) => {
    setForm({
      flightId: flight.flightId,
      flightNumber: flight.flightNumber,
      airlineName: flight.airlineName,
      sourceAirportIataCode: flight.sourceAirportIataCode,
      destinationAirportIataCode: flight.destinationAirportIataCode,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      status: flight.status,
      basePrice: flight.basePrice
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    try {
      await deleteFlight(id);
      toast.success("Flight deleted successfully!");
      fetchFlights();
    } catch (error) {
      toast.error("Error deleting flight.");
    }
  };

  const resetForm = () => {
    setForm({
      flightId: null,
      flightNumber: '',
      airlineName: '',
      sourceAirportIataCode: '',
      destinationAirportIataCode: '',
      departureTime: '',
      arrivalTime: '',
      status: 'SCHEDULED',
      basePrice: ''
    });
  };

  // Filter flights by search term (case-insensitive)
  const filteredFlights = flights.filter(f =>
    f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.airlineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.sourceAirportIataCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.destinationAirportIataCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`admin-page-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Fixed header */}
      <AdminHeader />

      <div className="admin-body d-flex">
        {/* Sidebar */}
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main content */}
        <main className="admin-main flex-grow-1 px-4 pt-4">
          <h1 className="fw-bold mb-4">Manage Flights</h1>

          {/* Flight Form */}
          <form className="row g-3 mb-4" onSubmit={handleSubmit}>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="flightNumber"
                placeholder="Flight No"
                value={form.flightNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="airlineName"
                placeholder="Airline"
                value={form.airlineName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                name="sourceAirportIataCode"
                placeholder="Source"
                value={form.sourceAirportIataCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                name="destinationAirportIataCode"
                placeholder="Destination"
                value={form.destinationAirportIataCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                name="basePrice"
                placeholder="Price"
                value={form.basePrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="datetime-local"
                className="form-control"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="datetime-local"
                className="form-control"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="DELAYED">Delayed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-success w-100" type="submit">
                {form.flightId === null ? 'Add Flight' : 'Update Flight'}
              </button>
            </div>
          </form>

          {/* Search filter */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Flight No, Airline, Source, Destination"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Flights Table */}
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Flight No</th>
                  <th>Airline</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Status</th>
                  <th>Price (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">Loading...</td>
                  </tr>
                ) : currentFlights.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">No flights found</td>
                  </tr>
                ) : (
                  currentFlights.map(f => (
                    <tr key={f.flightId}>
                      <td>{f.flightNumber}</td>
                      <td>{f.airlineName}</td>
                      <td>{f.sourceAirportIataCode}</td>
                      <td>{f.destinationAirportIataCode}</td>
                      <td>{formatDateTime(f.departureTime)}</td>
                      <td>{formatDateTime(f.arrivalTime)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(f.status)} py-1 px-2`}>
                          {f.status}
                        </span>
                      </td>
                      <td>{f.basePrice}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(f)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(f.flightId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'SCHEDULED': return 'bg-success';
    case 'DELAYED': return 'bg-warning text-dark';
    case 'CANCELLED': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

function formatDateTime(dateTime) {
  return new Date(dateTime).toLocaleString();
}
