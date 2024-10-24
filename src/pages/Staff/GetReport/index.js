import { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss"; 

function ReportList() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lX3NlbGxlciIsInJvbGUiOiJzdGFmZiIsInVzZXJfaW1hZ2UiOiJodHRwczovL2kuaWJiLmNvL3NnYlMyR0IvdC1pLXh1LW5nLmpwZyIsImlkIjoyLCJmdWxsbmFtZSI6IkphbmVDYXB0aWFuIiwiZXhwIjoxNzMwMjEwODI4LCJpYXQiOjE3Mjk2MDYwMjgsImVtYWlsIjoiamFuZUBleGFtcGxlLmNvbSJ9.hmT-f2hkQQdoJsAmqGvNg1lhA8IIZlUT8U680o7eU3Q"; // Token của staff bạn cần thêm vào request

    try {
      const response = await axios.get("http://localhost:8084/api/staff/view-all-report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(response.data); 
    } catch (err) {
      setError("Error fetching reports.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportList;
