
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../Component/Admin/AdminSidebar";
import AdminHeader from "../../Component/Admin/AdminHeader";
import { getDashboardData } from "../../Service/dashboard";
import { toast } from "react-toastify";
import "../../css/AdminHeader.css";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardData();
      setDashboardData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard data");
    }
  };

  if (!dashboardData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const {
    totalFlights,
    totalBookings,
    totalUsers,
    totalRevenue,
    recentBookings,
    recentPayments,
  } = dashboardData;

  return (
    <>
      <div className={`admin-page-container ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Header fixed on top */}
        <AdminHeader />

        <div className="admin-body d-flex">
          {/* Sidebar on left */}
          <AdminSidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          {/* Main content area */}
          <main className="admin-main flex-grow-1 px-4 pt-4">
            <h1 className="indisky-admin-heading mb-4">IndiSky Admin Dashboard</h1>

            {/* Summary Cards */}
            <div className="row">
              <SummaryCard title="Flights" value={totalFlights} />
              <SummaryCard title="Bookings" value={totalBookings} />
              <SummaryCard title="Users" value={totalUsers} />
              <SummaryCard
                title="Revenue"
                value={`₹${totalRevenue.toLocaleString()}`}
              />
            </div>

            {/* Recent Bookings */}
            <section className="mt-5">
              <h4 className="fw-bold">Recent Bookings</h4>
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No.</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking, index) => (
                      <tr key={booking.bookingId}>
                        <td>{index + 1}</td>
                        <td>{booking.user}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>
                          <span className="badge text-bg-success">
                            {booking.status}
                          </span>
                        </td>
                        <td>₹{booking.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Payments */}
            <section className="mt-5">
              <h4 className="fw-bold">Recent Payments</h4>
              <div className="table-responsive">
                <table className="table table-hover table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No.</th>
                      <th>User</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment, index) => (
                      <tr key={payment.paymentId}>
                        <td>{index + 1}</td>
                        <td>{payment.user}</td>
                        <td>{payment.method.replace("_", " ")}</td>
                        <td>
                          <span className="badge text-bg-success">
                            {payment.status}
                          </span>
                        </td>
                        <td>₹{payment.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>

      <style jsx>{`
        /* Container for whole admin page */
        .admin-page-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header fixed height */
        nav.navbar {
          flex-shrink: 0;
          height: 56px;
        }

        /* Flex body with sidebar and main */
        .admin-body {
          flex-grow: 1;
          display: flex;
          overflow: hidden;
        }

        /* Main content area */
        .admin-main {
          overflow-y: auto;
          padding-top: 1rem;
          margin-left: 250px;
          transition: margin-left 0.3s ease;
        }

        /* Main margin when sidebar collapsed */
        .sidebar-collapsed .admin-main {
          margin-left: 80px;
        }

        /* Heading style */
        .indisky-admin-heading {
          font-size: 2.2rem;
          font-weight: 700;
          background: linear-gradient(90deg, #17283a, #1f4044);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
          text-align: center;
          letter-spacing: 1px;
          text-transform: uppercase;
          animation: fadeInDown 0.6s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="col-md-3 mb-3">
    <div className="card text-bg-warning shadow">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text fs-3">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
