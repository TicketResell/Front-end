import { useState, useEffect } from "react";
import api from "../../../config/axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.scss"; 

function ReportList() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  // Modal state for report status update
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      const response = await api.get("/staff/view-all-report");
      setReports(response.data); 
    } catch (err) {
      setError("Error fetching reports.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Open Status Modal
  const handleOpenStatusModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setShowStatusModal(true);
  };

  // Close Status Modal
  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedReport(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedReport) return;
  
    try {
      const response = await api.post(`/staff/change-report-status/${selectedReport.id}?status=${newStatus}`);
  
      // Log the response to ensure it matches the expected string format
      console.log(response.data);
  
      fetchReports();
      handleCloseStatusModal();
    } catch (err) {
      setError("Error updating report status.");
      console.error("Update Report Status Error:", err);
    }
  };
  

  return (
    <div className="report-list-container">
      <h1>Reported Users</h1>
      {error && <p>{error}</p>}
      <table className="report-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Reported User ID</th>
            <th>Reporter User ID</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Report Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.reportedUserId}</td>
              <td>{report.reporterUserId}</td>
              <td>{report.reason}</td>
              <td>{report.status}</td>
              <td>{new Date(report.reportDate).toLocaleString()}</td>
              <td>
                <Button onClick={() => handleOpenStatusModal(report)}>Update Status</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for updating report status */}
      <Modal show={showStatusModal} onHide={handleCloseStatusModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Report Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reportStatus">
              <Form.Label>Report Status</Form.Label>
              <Form.Control
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStatusModal}>Close</Button>
          <Button variant="primary" onClick={handleUpdateStatus}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReportList;
