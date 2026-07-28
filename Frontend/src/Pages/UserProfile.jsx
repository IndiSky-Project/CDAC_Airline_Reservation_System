import React, { useState, useEffect } from 'react';
import SlideBar from '../Component/SlideBar';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import { useNavigate } from 'react-router-dom';
import '../css/UserProfile.css';
import { getUserDetails, updateUserDetails } from '../Service/user'; // your API helpers

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function UserProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: '',
    birthDate: '',
    email: '',
    phoneNo: '',
    passportNo: ''
  });

  const token = sessionStorage.getItem("token");
  let userId = null;
  if (token) {
    const decoded = parseJwt(token);
    userId = decoded?.Id || null;
  }

  useEffect(() => {
    if (userId) {
      getUserDetails(userId).then(res => {
        if (res.success) {
          const formattedDate = res.data.birthDate ? res.data.birthDate.split('T')[0] : '';
          setProfile({
            fullName: res.data.fullName || '',
            birthDate: formattedDate,
            email: res.data.email || '',
            phoneNo: res.data.phoneNo || '',
            passportNo: res.data.passportNo || ''
          });
        } else {
          alert("Failed to load profile: " + res.error);
        }
      });
    }
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User not identified.");
      return;
    }

    const res = await updateUserDetails(userId, profile);
    if (res.success) {
      alert("Profile updated successfully!");
    } else {
      alert("Failed to update profile: " + res.error);
    }
  };

  return (
    <div>
      <SlideBar />
      <Sidebar />
      <div className="container profile-container mb-5">
        <h2 className="text-center mb-4 profile-title">User Profile</h2>
        <div className="row g-4">

          <div className="col-md-8 offset-md-2">
            <div className="card profile-card shadow-sm p-4">
              <h5 className="mb-4 text-primary">Edit Personal Information</h5>
              <form onSubmit={handleProfileSave}>
                <div className="mb-3">
                  <label>Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Date of Birth</label>
                  <input
                    className="form-control"
                    type="date"
                    name="birthDate"
                    value={profile.birthDate}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Email (read-only)</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={profile.email}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Phone Number</label>
                  <input
                    className="form-control"
                    type="tel"
                    name="phoneNo"
                    value={profile.phoneNo}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Passport Number</label>
                  <input
                    className="form-control"
                    type="text"
                    name="passportNo"
                    value={profile.passportNo}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/my-bookings')}
                  >
                    My Bookings
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;
