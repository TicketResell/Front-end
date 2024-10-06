// src/components/Support.js
import React, { useState } from 'react';
import { FaTicketAlt, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import './Support.module.scss'; // Assuming you want to style the page with an external CSS file

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add logic to send form data to the backend here
    setSubmitted(true);
  };

  return (
    <div className="support-container">
      <h1>Customer Support</h1>
      <p>
        If you are experiencing issues with your ticket transactions or platform functionality, please fill out the form below to contact our support team.
      </p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="support-form">
          <label htmlFor="name">
            <FaInfoCircle /> Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">
            <FaEnvelope /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="issue">
            <FaTicketAlt /> Issue Type
          </label>
          <select
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            required
          >
            <option value="">Select an issue</option>
            <option value="transaction">Ticket Transaction Problem</option>
            <option value="platform">Platform Functionality Issue</option>
          </select>

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Submit</button>
        </form>
      ) : (
        <div className="thank-you-message">
          <h2>Thank you for contacting support!</h2>
          <p>We have received your issue and will get back to you shortly.</p>
        </div>
      )}
    </div>
  );
};

export default Support;
