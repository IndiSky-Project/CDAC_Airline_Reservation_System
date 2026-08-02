import React, { useState } from 'react';
import SlideBar from '../Component/SlideBar';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';


function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  

  const [submitted, setSubmitted] = useState(false);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <SlideBar />
      <Sidebar />
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4" style={{ color: '#512888', marginTop: "76px" }}>Contact Support</h2>

        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input type="text" className="form-control" name="subject" value={form.subject} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" name="message" rows="4" value={form.message} onChange={handleChange} required></textarea>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>

          {submitted && <div className="alert alert-success mt-3">Your message has been sent successfully!</div>}
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
