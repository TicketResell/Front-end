import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Range } from "react-range";

function Filter() {
  const STEP = 0.1;
  const MIN = 0;
  const MAX = 200;
  const MAX_QUANTITY = 30;
  const [priceRange, setPriceRange] = useState([0, 100]); 
  const [quantity, setQuantity] = useState(1); 

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setQuantity(0);
    } else if (value > MAX_QUANTITY) {
      setQuantity(MAX_QUANTITY);  
    }else if (value < 1) {
      setQuantity(1); 
    } else {
      setQuantity(value); 
    }
  };

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
            onChange={(e) => setPriceRange(e)}
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
                {/* Track */}
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
                  border: "2px solid #0d6efd",
                }}
              />
              
            )}
          />
        </Col>
      </Row>

      {/* Input cho số lượng sản phẩm */}
      <Row className="mb-3">
        <h4>QUANTITY</h4>
        <Col>
          <Form.Control
            type="number"
            value={quantity}
            min="1"
            max={MAX_QUANTITY}
            onChange={handleQuantityChange}
          />
        </Col>
      </Row>

      {/* Hiển thị giá trị đã chọn */}
      <Row>
        <Col>
          <div style={{ fontSize: "24px", fontWeight: "bold", padding: "10px 0" }}>
            <strong>Price:</strong> £{priceRange[0].toFixed(2)} — £{priceRange[1].toFixed(2)}
          </div>
          <div style={{ fontSize: "24px", fontWeight: "bold", padding: "10px 0" }}>
            <strong>Selected Quantity:</strong> {quantity} 
          </div>
          <div style={{ fontWeight: "bold" }}><strong>Max:30</strong></div>
        </Col>
      </Row>
    </Container>
  );
}

export default Filter;
