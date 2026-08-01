import React, { useEffect, useState } from 'react';
import { myAxios } from '../../Service/config';
import '../../css/PassengersList.css';
import AdminSidebar from '../../Component/Admin/AdminSidebar';
import AdminHeader from '../../Component/Admin/AdminHeader';
import "../../css/AdminHeader.css";

function PassengersList() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await myAxios.get('/admin/passenger/getAll');
        setPassengers(response.data);
      } catch (error) {
        console.error("Error fetching passengers:", error);
      }
    };

    fetchPassengers();
  }, []);

  const filteredPassengers = passengers.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.passportNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`admin-page-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Fixed header */}
      <AdminHeader />

      <div className="admin-body d-flex">
        {/* Sidebar */}
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main content */}
        <main className="admin-main flex-grow-1 px-4 pt-4">

          <div className="main-content container-fluid mt-5 pt-3">
            <h1 className="fw-bold mb-4">Passengers List</h1>

            {/* Search box */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or passport number"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-responsive shadow-sm rounded">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Sr. No.</th>
                    <th>Full Name</th>
                    <th>Date of Birth</th>
                    <th>Passport No</th>
                    <th>Nationality</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPassengers.length > 0 ? (
                    filteredPassengers.map((p, index) => (
                      <tr key={p.passengerId || index}>
                        <td>{index + 1}</td>
                        <td>{p.fullName}</td>
                        <td>{p.dob}</td>
                        <td>{p.passportNo}</td>
                        <td>{p.nationality}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No passengers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PassengersList;
