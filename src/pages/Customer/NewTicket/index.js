import React, { useState } from "react";
import {Container,
  Form,
  Button,
  Col,
  Row,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import Autocomplete from "react-google-autocomplete";
import classNames from "classnames/bind";
import styles from "./NewTick.module.scss"

const cx = classNames.bind(styles)
export default function NewTick() {
  const [ticketType, setTicketType] = useState("Select Ticket Type");

  const handleSelect = (e) => {
    setTicketType(e);
  };
  return (
    <Container className={cx("wrapper","d-flex")}>
      <Row>
        <Col></Col>
        <Col>
          <Form className={cx("formStyle")}>
            {/* Event Title */}
            <Form.Group as={Row} className="mb-3" controlId="formEventTitle">
              <Form.Label column sm="2">
                Event Title
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Enter event title" />
              </Col>
            </Form.Group>

            {/* Event Date */}
            <Form.Group as={Row} className="mb-3" controlId="formEventDate">
              <Form.Label column sm="2">
                Event Date (Hạn vé)
              </Form.Label>
              <Col sm="10">
                <Form.Control type="date" />
              </Col>
            </Form.Group>

            {/* Ticket Type */}
            <Form.Group as={Row} className="mb-3" controlId="formTicketType">
              <Form.Label column sm="2">
                Ticket Type
              </Form.Label>
              <Col sm="10">
                <DropdownButton
                  title={ticketType}
                  onSelect={handleSelect}
                  variant="outline-secondary"
                >
                  <Dropdown.Item eventKey="Event tickets">
                    Event tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Sports tickets">
                    Sports tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Travel tickets">
                    Travel tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Tourist attraction tickets">
                    Tourist attraction tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Movie tickets">
                    Movie tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Fair tickets">
                    Fair tickets
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            </Form.Group>

            {/* Location */}
            <Form.Group as={Row} className="mb-3" controlId="formLocation">
              <Form.Label column sm="2">
                Location
              </Form.Label>
              <Col sm="10">
                <Autocomplete
                  apiKey="YOUR_GOOGLE_PLACES_API_KEY"
                  onPlaceSelected={(place) => console.log(place)}
                  types={["(cities)"]}
                  placeholder="Enter event location"
                  className="form-control"
                />
              </Col>
            </Form.Group>

            {/* Original Price */}
            <Form.Group as={Row} className="mb-3" controlId="formOriginalPrice">
              <Form.Label column sm="2">
                Original Price
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Enter original price"
                />
              </Col>
            </Form.Group>

            {/* Discounted Price */}
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formDiscountedPrice"
            >
              <Form.Label column sm="2">
                Discounted Price
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Enter discounted price"
                />
              </Col>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}


