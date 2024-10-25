import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Range } from "react-range";

function Filter({ onFilterChange }) {
  const STEP = 0.1;
  const MIN = 0;
  const MAX = 300;
  const [priceRange, setPriceRange] = useState([MIN, MAX]);

  const handlePriceRange = (newPriceRange) => {
    setPriceRange(newPriceRange);
    onFilterChange(newPriceRange);
  };
console.log(demogit);
  return (
    <Container className="p-4">
      <h2 className="text-center mb-4">Product Filter</h2>

      {/* Input range cho giá tiền */}
      <Row className="mb-3">
        <h4>PRICE</h4>
        <Col>
          <Range
            step={STEP}
            min={MIN}
            max={MAX}
            values={priceRange}
            onChange={handlePriceRange}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: "6px",
                  display: "flex",
                  width: "100%",
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: "6px",
                    width: "100%",
                    background: `linear-gradient(to right, #ccc ${100 * (priceRange[0] - MIN) / (MAX - MIN)}%, #0d6efd ${100 * (priceRange[0] - MIN) / (MAX - MIN)}%, #0d6efd ${100 * (priceRange[1] - MIN) / (MAX - MIN)}%, #ccc ${100 * (priceRange[1] - MIN) / (MAX - MIN)}%)`,
                    borderRadius: "4px",
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "24px",
                  width: "24px",
                  backgroundColor: "#0d6efd",
                  borderRadius: "50%",
                }}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <h5>
            Selected Price Range: ${priceRange[0]} - ${priceRange[1]}
          </h5>
        </Col>
      </Row>
    </Container>
  );
}

export default Filter;
