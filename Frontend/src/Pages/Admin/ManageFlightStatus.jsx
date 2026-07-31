import React, { useEffect, useState } from "react";
import AdminSidebar from "../../Component/Admin/AdminSidebar";
import AdminHeader from "../../Component/Admin/AdminHeader";
import { getAllFlightStatusLogs, addFlightStatusLog } from "../../Service/flightStatusLog";
import { toast } from "react-toastify";
import "../../css/FlightStatusManagement.css";
import "../../css/AdminHeader.css";

function FlightStatusManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [newStatus, setNewStatus] = useState("SCHEDULED");
  const [newFlightNumber, setNewFlightNumber] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await getAllFlightStatusLogs();
      const sortedLogs = res.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setLogs(sortedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to fetch flight status logs");
    }
  };

  const handleAddStatus = async (e) => {
    e.preventDefault();
    if (!newFlightNumber.trim()) {
      toast.warning("Please enter a flight number");
      return;
    }

    try {
      await addFlightStatusLog({
        flightNumber: newFlightNumber.trim(),
        status: newStatus,
      });
      toast.success("Flight status updated successfully");
      setNewFlightNumber("");
      setNewStatus("SCHEDULED");
      fetchLogs();
    } catch (error) {
      console.error("Error adding flight status log:", error);
      toast.error("Failed to add flight status");
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.flightNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className={`admin-page-container ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Fixed header */}
      <AdminHeader />

      <div className="admin-body d-flex">
        {/* Sidebar */}
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main content */}
        <main className="admin-main flex-grow-1 px-4 pt-4">
          <h1>Flight Status Management</h1>

          <form onSubmit={handleAddStatus} className="row g-3 align-items-end mb-4">
            <div className="col-md-4">
              <label className="form-label">Flight Number</label>
              <input
                type="text"
                className="form-control"
                value={newFlightNumber}
                onChange={(e) => setNewFlightNumber(e.target.value)}
                placeholder="e.g., IN101"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="DELAYED">Delayed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100">
                Add / Update Status
              </button>
            </div>
          </form>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Flight Number"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="table-responsive shadow-sm rounded">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Flight Number</th>
                  <th>Status</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <tr key={log.logId}>
                      <td>{log.flightNumber}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(log.status)} py-2 px-3`}>
                          {log.status}
                        </span>
                      </td>
                      <td>{new Date(log.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-3">
                      No flight logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-outline-secondary"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case "SCHEDULED":
      return "bg-success";
    case "DELAYED":
      return "bg-warning text-dark";
    case "CANCELLED":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

export default FlightStatusManagement;
