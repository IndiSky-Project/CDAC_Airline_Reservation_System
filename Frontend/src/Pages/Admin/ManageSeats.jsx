import React, { useEffect, useState } from "react";
import AdminSidebar from "../../Component/Admin/AdminSidebar";

import AdminHeader from "../../Component/Admin/AdminHeader";
import {
  getAllSeats,
  addSeat,
  updateSeat,
  deleteSeat,
} from "../../Service/flightSeat";
import "../../css/ManageSeats.css";
import "../../css/AdminHeader.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageSeats() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [seats, setSeats] = useState([]);
  const [form, setForm] = useState({
    seatId: "",
    seatNumber: "",
    seatClass: "ECONOMY",
    flightNumber: "",
    flightId: "",
    booked: false,
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const seatsPerPage = 10;

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const response = await getAllSeats();
      setSeats(response.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
      toast.error("Failed to fetch seats.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateSeat(form.seatId, {
          seatNumber: form.seatNumber,
          seatClass: form.seatClass,
          flightId: form.flightId,
          booked: form.booked,
        });
        toast.success("Seat updated successfully!");
      } else {
        await addSeat({
          seatNumber: form.seatNumber,
          seatClass: form.seatClass,
          flightNumber: form.flightNumber,
          booked: form.booked,
        });
        toast.success("Seat added successfully!");
      }
      fetchSeats();
      resetForm();
    } catch (error) {
      console.error("Error saving seat:", error);
      toast.error("Failed to save seat. Please try again.");
    }
  };

  const resetForm = () => {
    setForm({
      seatId: "",
      seatNumber: "",
      seatClass: "ECONOMY",
      flightNumber: "",
      flightId: "",
      booked: false,
    });
    setEditing(false);
  };

  const handleEdit = (seat) => {
    setForm({
      seatId: seat.seatId,
      seatNumber: seat.seatNumber,
      seatClass: seat.seatClass,
      flightNumber: seat.flightNumber || "",
      flightId: seat.flightId || "",
      booked: seat.booked,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this seat?")) {
      try {
        await deleteSeat(id);
        toast.success("Seat deleted successfully!");
        fetchSeats();
      } catch (error) {
        console.error("Error deleting seat:", error);
        toast.error("Failed to delete seat.");
      }
    }
  };

  const filteredSeats = seats.filter((seat) =>
    seat.flightNumber.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastSeat = currentPage * seatsPerPage;
  const indexOfFirstSeat = indexOfLastSeat - seatsPerPage;
  const currentSeats = filteredSeats.slice(indexOfFirstSeat, indexOfLastSeat);
  const totalPages = Math.ceil(filteredSeats.length / seatsPerPage);

  return (
    <div className={`admin-page-container ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Fixed header */}
      <AdminHeader />

      <div className="admin-body d-flex">
        {/* Sidebar */}
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main content */}
        <main className="admin-main flex-grow-1 px-4 pt-4">
          <h1>Manage Flight Seats</h1>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Flight Number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-3">
              <input
                className="form-control"
                name="seatNumber"
                placeholder="Seat Number"
                value={form.seatNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="seatClass"
                value={form.seatClass}
                onChange={handleChange}
                required
              >
                <option value="ECONOMY">Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>
            </div>
            {!editing && (
              <div className="col-md-2">
                <input
                  className="form-control"
                  name="flightNumber"
                  placeholder="Flight Number"
                  value={form.flightNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="col-md-2 d-flex align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="booked"
                  checked={form.booked}
                  onChange={handleChange}
                />
                <label className="form-check-label">Booked</label>
              </div>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                {editing ? "Update" : "Add"}
              </button>
            </div>
            {editing && (
              <div className="col-md-2">
                <button type="button" className="btn btn-secondary w-100" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            )}
          </form>

          {loading ? (
            <p>Loading seats...</p>
          ) : (
            <>
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Sr. No.</th>
                    <th>Seat Number</th>
                    <th>Class</th>
                    <th>Booked</th>
                    <th>Flight Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSeats.length > 0 ? (
                    currentSeats.map((seat, index) => (
                      <tr key={seat.seatId}>
                        <td>{indexOfFirstSeat + index + 1}</td>
                        <td>{seat.seatNumber}</td>
                        <td>{seat.seatClass}</td>
                        <td>{seat.booked ? "Yes" : "No"}</td>
                        <td>{seat.flightNumber}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(seat)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(seat.seatId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No seats found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
