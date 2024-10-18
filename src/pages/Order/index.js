import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './index.scss';

const OrderPage = () => {
  const [order, setOrder] = useState({
    buyer_id: '',
    seller_id: '',
    ticket_id: '',
    payment_id: '',
    order_method: '',
    total_amount: ''
  });

  // Dữ liệu mẫu (giả lập lấy từ cơ sở dữ liệu)
  useEffect(() => {
    const sampleData = {
      buyer_id: 101,
      seller_id: 202,
      ticket_id: 303,
      payment_id: 404,
      order_method: 'paypal',
      total_amount: '99.99'
    };
    setOrder(sampleData);
  }, []);

  const handleRadioChange = (e) => {
    setOrder({ ...order, order_method: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', order);
    // Gửi dữ liệu đến API hoặc backend xử lý
  };

  return (
    <Container className="order-page">
      <Row>
        {/* Left Side */}
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Delivery Information</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="buyer_id">
                  <Form.Label>Buyer ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="buyer_id"
                    value={order.buyer_id}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="seller_id">
                  <Form.Label>Seller ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="seller_id"
                    value={order.seller_id}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="ticket_id">
                  <Form.Label>Ticket ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="ticket_id"
                    value={order.ticket_id}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="total_amount">
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="total_amount"
                    value={order.total_amount}
                    readOnly
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side */}
        <Col md={5}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Select Payment Method</h3>
              <Form.Group controlId="order_method" className="radio-group">
                <div>
                  <Form.Check
                    type="radio"
                    name="order_method"
                    value="COD"
                    label="Cash On Delivery"
                    checked={order.order_method === 'COD'}
                    onChange={handleRadioChange}
                  />
                  <Form.Check
                    type="radio"
                    name="order_method"
                    value="paypal"
                    label="Paypal"
                    checked={order.order_method === 'paypal'}
                    onChange={handleRadioChange}
                  />
                  <Form.Check
                    type="radio"
                    name="order_method"
                    value="vnpay"
                    label="VNPAY"
                    checked={order.order_method === 'vnpay'}
                    onChange={handleRadioChange}
                  />
                </div>
              </Form.Group>
              <Button variant="success" className="mt-3" block>
                Proceed to Payment
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h4>Order Summary</h4>
              <p>Subtotal: ₫30,000</p>
              <p>Shipping Fee: ₫17,000</p>
              <h4>Total: ₫47,000</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
