import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaSearch, FaUndo } from "react-icons/fa";

function Search (){
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [resultSearch, setresultSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setIsLoading(true);
    setError("");

    
    setTimeout(() => {
      const results = [
        { id: 1, name: "Concert A", price: 150, date: "2023-07-15", location: "New York" },
        { id: 2, name: "Theater Show B", price: 80, date: "2023-07-20", location: "Los Angeles" },
        { id: 3, name: "Sports Event C", price: 200, date: "2023-07-25", location: "Chicago" },
      ];

      const filterResult = results.filter(
        (ticket) =>
          (!eventType || ticket.name.toLowerCase().includes(eventType.toLowerCase())) &&
          (!location || ticket.location.toLowerCase().includes(location.toLowerCase())) &&
          (!date || ticket.date === date) &&
          ticket.price >= priceRange[0] &&
          ticket.price <= priceRange[1]
      );

      if (filterResult.length === 0) {
        setError("No results found. Please try different search criteria.");
      }

      setresultSearch(filterResult);
      setIsLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setEventType("");
    setLocation("");
    setDate("");
    setPriceRange([0, 200]);
    setresultSearch([]);
    setError("");
  };

  return (
     <Container style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h4>Search Tickets</h4>
      <Row className="mb-3">
        <Col xs={12} sm={6} md={3}>
          <Form.Group controlId="eventType">
            <Form.Label>Event Type</Form.Label>
            <Form.Select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="concert">Concert</option>
              <option value="theater">Theater</option>
              <option value="sports">Sports</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Form.Group controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={3}>
        <Form.Group controlId="eventType">
            <Form.Label>Price Range</Form.Label>
            <Form.Select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="50.000-100.000">50.000-100.000</option>
              <option value="300.000-400.000">300.000-400.000</option>
              <option value="500.000-600.000">500.000-600.000</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-between mt-3">
        <Button
          variant="primary"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <FaSearch className="me-2" />
          Search
        </Button>
        <Button
          variant="outline-secondary"
          onClick={handleReset}
          disabled={isLoading}
        >
          <FaUndo className="me-2" />
          Reset
        </Button>
      </div>
      {isLoading && <div className="text-center mt-3">Loading...</div>}
      {error && <p className="text-danger mt-3">{error}</p>}
      {resultSearch.length > 0 && (
        <div className="mt-3">
          <h5>Search Results</h5>
          {resultSearch.map((ticket) => (
            <Card key={ticket.id} className="mb-3">
              <Card.Body>
                <Card.Title>{ticket.name}</Card.Title>
                <Card.Text>Price: ${ticket.price}</Card.Text>
                <Card.Text>Date: {ticket.date}</Card.Text>
                <Card.Text>Location: {ticket.location}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Search;