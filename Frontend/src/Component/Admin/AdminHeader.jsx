import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default function AdminHeader() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  let adminName = "";
  if (token) {
    const decoded = parseJwt(token);
    if (decoded?.Name) {
      adminName = decoded.Name; // Use exact key "Name"
    } else if (decoded?.sub) {
      adminName = decoded.sub.split("@")[0]; // fallback
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully!");
    // navigate("/admin/login");
    navigate("/admin/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <div className="container-fluid">
        {/* Left Side - Brand & Quick Links */}
        <Link to="/admin/dashboard" className="navbar-brand fw-bold">
          ✈️ IndiSky Admin
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">
                <i className="fa-solid fa-chart-line"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/flights">
                <i className="fa-solid fa-plane"></i> Flights
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/view-bookings">
                <i className="fa-solid fa-receipt"></i> Bookings
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side - Hello & Logout */}
        <div className="d-flex align-items-center">
          <span className="text-white me-3 fw-semibold">
            Hello, {adminName || "Admin"}
          </span>
          <button
            className="btn btn-danger btn-sm d-flex align-items-center"
            onClick={handleLogout}
            title="Logout"
            style={{ fontWeight: "600" }}
          >
            <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
