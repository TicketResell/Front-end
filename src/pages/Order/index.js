import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './index.scss';
import { useLocation } from 'react-router-dom';
import api from '../../config/axios';

const OrderPage = () => {
  const location = useLocation();
  const ticket = location.state?.ticket;
  const quantity = location.state?.quantityOrder;

  const [order, setOrder] = useState({});
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState("");
  const [error,setError] = useState("");
  const UserLocalStorage = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchProfileUser = async () => {
    if (user) {
      const response = await api.get(`/accounts/profile/${user.sub}`);
      setProfile(response.data);
    }
  };

  useEffect(() => {
    UserLocalStorage();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfileUser();
    }
  }, [user]);

  const checkAddress = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.trim() === "") {
      setError( "Do not leave the address blank" );
    } else {
      setError("");
    }
  };

  // Update order every time profile changes
  useEffect(() => {
    if (profile && user) {
      const orderCreate = {
        fullname: user.fullname || "", // Kiểm tra trường hợp fullname không có
        phone: profile.phone || "", // Kiểm tra trường hợp phone không có
        email: user.email || "",
        address: address, // Giữ lại giá trị address
        eventTitle: ticket.eventTitle,
        quantity: quantity,
        price: ticket.price,
        totalAmount: quantity * ticket.price,
        orderMethod : 'COD'
      };
      setOrder(orderCreate);
    }
  }, [profile, user, ticket, quantity, address]); // Chạy khi profile, user, ticket hoặc address thay đổi

  const handleRadioChange = (e) => {
    setOrder({ ...order, orderMethod: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra địa chỉ trước khi gửi
    if (address.trim() === "") {
      setError("Do not leave the address blank");
      return; // Ngăn không cho gửi nếu địa chỉ trống
    }
    console.log('Order submitted:', order);
  };

  return (
    <Container className="order-page">
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Delivery Information</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="buyer_id">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={order.fullname}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={order.phone}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label style={{color : "red"}} >Address (Required) </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Please type address"
                    name="address"
                    value={address}
                    isInvalid={error}
                    isValid={!error && address.length > 0}
                    onChange={checkAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {error} 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={order.email}
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

        <Col md={5}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Select Payment Method</h3>
              <Form.Group controlId="orderMethod" className="radio-group">
                <div>
                  <Form.Check
                    type="radio"
                    name="orderMethod"
                    value="COD"
                    label="Cash On Delivery"
                    checked={order.orderMethod === 'COD'}
                    onChange={handleRadioChange}
                  />
                  <Form.Check
                    type="radio"
                    name="order_method"
                    value="vnpay"
                    label="VNPAY"
                    checked={order.orderMethod === 'vnpay'}
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
              <p>Ticket Title : {order.eventTitle}</p>
              <p>Price: {order.price}$</p>
              <p>Quantity: {order.quantity}</p>
              <h4>Total Amount: {order.totalAmount}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
