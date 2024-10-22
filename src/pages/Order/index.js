import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "./index.scss";
import { useLocation } from "react-router-dom";
import { confirmPhone } from "../../services/api/RegisterAPI";
import { FaLockOpen,FaLock } from "react-icons/fa";
import api from "../../config/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;
  const quantity = location.state?.quantityOrder;

  const [order, setOrder] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    eventTitle: "",
    quantity: 0,
    price: 0,
    totalAmount: 0,
    orderMethod: "COD"
  });
  
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [errors, setErrors] = useState({
    fullname: "",
    phone: "",
    address: "",
  });

  // Thêm trạng thái để theo dõi xem các field có ở trạng thái readonly hay không
  const [isReadonly, setIsReadonly] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Save");

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

  // Update order every time profile changes
  useEffect(() => {
    if (profile && user) {
      const orderCreate = {
        fullname: user.fullname || "", // Kiểm tra trường hợp fullname không có
        phone: profile.phone || "", // Kiểm tra trường hợp phone không có
        email: user.email || "",
        address: "", // Giữ lại giá trị address
        eventTitle: ticket.eventTitle,
        quantity: quantity,
        price: ticket.price,
        totalAmount: quantity * ticket.price,
        orderMethod: "COD",
      };
      setOrder(orderCreate);
    }
  }, [profile, user, ticket, quantity]); // Chạy khi profile, user, ticket hoặc address thay đổi

  const handleRadioChange = (e) => {
    setOrder({ ...order, orderMethod: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Nếu nút hiện tại là "Save", thì chuyển sang trạng thái readonly và thay đổi nhãn nút
    if (buttonLabel === "Save") {
      setIsReadonly(true);
      setButtonLabel("Update");
      toast.success("Saved successfully", {
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
    } else {
      // Nếu nút hiện tại là "Update", chuyển các field về trạng thái không readonly
      setIsReadonly(false);
      setButtonLabel("Save");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!confirmPhone(value)) {
        setErrors((prev) => ({ ...prev, phone: "Phone number is incorrect" }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }

    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "Do not leave blank cells" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setOrder({ ...order, [name]: value });
  };

  const handleCreateOrder = async () =>{
    const orderCraete = {
      buyerId : user.id,
      sellerId : ticket.useID,
      ticketId : ticket.id,
      quantity : quantity,
      totalAmount : order.totalAmount,
      paymentStatus : "pending",
      orderStatus: "completed",
      orderMethod: order.orderMethod,
    }
    try {
      const response = await api.post("orders/create", orderCraete);
      if (response && response.status === 200) {
        toast.success("Order information received, Redirecting to payment page", {
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
      navigate("/payment");
    } catch (error) {
      toast.error(error.response.data, {
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
      return;
    }
  }

  return (
    <Container className="order-page">
      <ToastContainer/>
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Delivery Information</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="fullname">
                  <Form.Label style={{ color: "red" }}>Fullname (Required) <span>{isReadonly ? <FaLock/> : <FaLockOpen/> }</span></Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Please type fullname"
                    name="fullname"
                    value={order.fullname}
                    isInvalid={errors.fullname}
                    isValid={!errors.fullname && order.fullname.length > 0}
                    onChange={handleInputChange}
                    readOnly={isReadonly} // Thêm thuộc tính readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullname}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="phone">
                  <Form.Label style={{ color: "red" }}>Phone (Required) <span>{isReadonly ? <FaLock/> : <FaLockOpen/> }</span></Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Please type phone"
                    name="phone"
                    value={order.phone}
                    isInvalid={errors.phone}
                    isValid={!errors.phone && order.phone.length > 0}
                    onChange={handleInputChange}
                    readOnly={isReadonly} // Thêm thuộc tính readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="address">
                  <Form.Label style={{ color: "red" }}>
                    Address (Required) <span>{isReadonly ? <FaLock/> : <FaLockOpen/> }</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Please type address"
                    name="address"
                    value={order.address}
                    isInvalid={errors.address}
                    isValid={!errors.address && order.address.length > 0}
                    onChange={handleInputChange}
                    readOnly={isReadonly} // Thêm thuộc tính readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email <span><FaLock/></span></Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={order.email}
                    readOnly
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  {buttonLabel} {/* Hiển thị nhãn của nút */}
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
                    checked={order.orderMethod === "COD"}
                    onChange={handleRadioChange}
                  />

                  <Form.Check
                    type="radio"
                    name="order_method"
                    value="vnpay"
                    label="VNPAY"
                    checked={order.orderMethod === "vnpay"}
                    onChange={handleRadioChange}
                  />
                </div>
              </Form.Group>
              <Button variant="success" className="mt-3" block onClick={handleCreateOrder}>
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
