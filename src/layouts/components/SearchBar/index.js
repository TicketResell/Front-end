import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import api from "../../../config";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.scss";

function Search({ onSearch, categories }) {
  const [tickName, setTickName] = useState("");
  const [tickCategory, setTickCategory] = useState(1);

  const handleSearch = async () => {
    const infoSearch = {
      tickName,
      tickCategory,
    };

    try {
      const response = await api.post("search", infoSearch);
      onSearch(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container p-4">
      <Container
        className={`  ${styles.wrapper} p-4 `}
        style={{ maxWidth: "500px" }}
      >
        <h2 className={` ${styles.header} text-center`}>SEARCH TICKET</h2>
        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Enter the ticket you want to find"
              value={tickName}
              onChange={(e) => {
                setTickName(e.target.value);
              }}
            />
          </InputGroup>

          <Row className="mb-3">
            <Form.Group>
              <Form.Label>CATEGORY</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setTickCategory(e.target.value);
                  console.log("Selected Category ID:", e.target.value);
                }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "##4562EB" }}
          >
            SEARCH
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Search;
