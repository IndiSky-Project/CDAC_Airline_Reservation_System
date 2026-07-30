import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../Component/Admin/AdminSidebar';
import AdminHeader from '../../Component/Admin/AdminHeader';
import "../../css/AdminHeader.css";
import { myAxios } from '../../Service/config';

export default function ManageUsers() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await myAxios.get('/admin/user/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await myAxios.put(`/admin/user/role/${userId}?role=${newRole}`);
      setUsers(users.map(user => user.id === userId ? { ...user, personRole: newRole } : user));
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  // Filter users by fullName or email based on search input (case-insensitive)
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
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
          <h1 className="fw-bold mb-4">User Management</h1>

          {/* Search Input */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>

          {/* Users Table */}
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Sr. No.</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone No</th>
                  <th>Passport No</th>
                  <th>Birth Date</th>
                  <th>Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, index) => (
                    <tr key={u.id}>
                      <td>{index + 1}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNo}</td>
                      <td>{u.passportNo}</td>
                      <td>{u.birthDate}</td>
                      <td>
                        <span className="badge bg-info text-dark">{u.personRole}</span>
                      </td>
                      <td>
                        <select
                          value={u.personRole}
                          className="form-select form-select-sm"
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
