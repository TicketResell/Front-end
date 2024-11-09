import { useState, useEffect } from "react";
import api from "../../../config/axios";
import { Modal, Button, Form } from "react-bootstrap";
import {
  MDBBadge
} from "mdb-react-ui-kit";
import "./index.scss"; 
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Pagination from "../../../layouts/components/Pagination";

function ReportList() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [reportPage, setReportPage] = useState(0);
  const itemsPerPage = 5;
  const offset = reportPage * itemsPerPage;
  const currentReports = reports.slice(offset, offset + itemsPerPage);

  // Modal state for report status update
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      const response = await api.get("/staff/view-all-report");
      console.log("User Report ",response.data);
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
      if(response.status === 200){
        toast.success("Status updated successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      fetchReports();
      handleCloseStatusModal();

    } catch (err) {
      setError("Error updating report status.");
      console.error("Update Report Status Error:", err);
    }
  };
  

  return (
    <div className="report-list-container">
      <ToastContainer/>
      <h1>Reported Users</h1>
      {error && <p>{error}</p>}
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Reporter User Name</th>
            <th>Reported User Name</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Report Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map( (report,index) => (
            <tr key={report.id}>
              <td>{offset +index + 1}</td>
              <td>{report.reporterUser.username}</td>
              <td>{report.reportedUser ? report.reportedUser.username : "Null"}</td>
              <td>{report.reason}</td>
              <td><MDBBadge
                      color={
                        report.status === "reviewed"
                          ? "warning"
                          : report.status === "pending"
                          ? "success"
                          : "danger"
                      }
                      pill
                    >
                      {report.status}
                    </MDBBadge>
                    </td>
              <td>{new Date(report.reportDate).toLocaleString()}</td>
              <td>
                <Button onClick={() => handleOpenStatusModal(report)}>Update Status</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
          currentPage={reportPage}
          pageCount={Math.ceil(reports.length / itemsPerPage)}
          onPageChange={(selectedPage) => setReportPage(selectedPage)}
        />
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
