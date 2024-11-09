import { useState, useEffect } from "react";
import api from "../../../config/axios";
import { Table, Alert, Button } from "react-bootstrap";
import Pagination from "../../../layouts/components/Pagination";
import "./index.scss";

function RatingList() {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ratingPage, setRatingPage] = useState(0);
  const itemsPerPage = 5;
  const offset = ratingPage * itemsPerPage;
  const currentRatings = ratings.slice(offset, offset + itemsPerPage);

  // Fetch Ratings
  const fetchRatings = async () => {
    try {
      const response = await api.get("/ratings"); // Ensure your base URL is configured properly in your axios instance
      console.log("Rating list",response.data);
      setRatings(response.data);
    } catch (err) {
      setError("Error fetching ratings.");
      console.error("Fetch Ratings Error:", err);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  // Delete Rating
  const deleteRating = async (ratingId) => {
    try {
      await api.delete(`/ratings/${ratingId}`);
      setSuccessMessage("Rating deleted successfully.");
      fetchRatings(); // Refresh the ratings list after deletion
    } catch (err) {
      setError("Error deleting rating.");
      console.error("Delete Rating Error:", err);
    }
  };

  return (
    <div className="rating-list-container">
      <h1>Ratings List</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Rating ID</th>
            <th>Created Date</th>
            <th>Buyer Name</th>
            <th>Rating Score</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRatings.map((rating) => (
            <tr key={rating.id}>
              <td>{rating.id}</td>
              <td>{rating.createdDate}</td>
              <td>{rating.buyer.fullname}</td>
              <td>{rating.ratingScore}</td>
              <td>{rating.feedback}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => deleteRating(rating.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
          currentPage={ratingPage}
          pageCount={Math.ceil(ratings.length / itemsPerPage)}
          onPageChange={(selectedPage) => setRatingPage(selectedPage)}
        />
    </div>
  );
}

export default RatingList;
