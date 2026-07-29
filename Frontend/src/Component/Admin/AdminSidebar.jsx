import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/AdminSidebar.css';

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

 const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
  { to: '/admin/airlines', label: 'Manage Airlines', icon: 'fa-solid fa-plane' },
  { to: '/admin/airports', label: 'Manage Airports', icon: 'fa-solid fa-building' },
  { to: '/admin/flights', label: 'Manage Flights', icon: 'fa-solid fa-paper-plane' },
  { to: '/admin/seats', label: 'Manage Flight Seats', icon: 'fa-solid fa-chair' },
  { to: '/admin/users', label: 'Manage Users', icon: 'fa-solid fa-users' },
  { to: '/admin/flight-status', label: 'Flight Status', icon: 'fa-solid fa-clock-rotate-left' },
  { to: '/admin/view-bookings', label: 'View Bookings', icon: 'fa-solid fa-receipt' }, 
  { to: '/admin/payments', label: 'Payments', icon: 'fa-solid fa-credit-card' },        
  { to: '/admin/passengers', label: 'Passengers', icon: 'fa-solid fa-user-tag' }       
];


  return (
    <div className={`admin-sidebar bg-dark text-white ${collapsed ? 'collapsed' : ''}`}>
    
      <div className="sidebar-toggle text-end p-2">
        <button
          className="btn btn-sm btn-light"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`fa-solid ${collapsed ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
        </button>
      </div>

      
      {!collapsed && (
        <div className="text-center mb-4">
          <h5 className="fw-bold text-white">✈️ Admin Panel</h5>
        </div>
      )}

      
      <ul className="nav flex-column">
        {menuItems.map(({ to, label, icon }) => (
          <li className="nav-item mb-2" key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${
                  isActive ? 'active-link bg-light text-dark fw-semibold' : 'text-white'
                }`
              }
            >
              <i className={`${icon}`}></i>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
