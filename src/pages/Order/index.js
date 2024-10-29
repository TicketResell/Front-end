import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import styles from "./Order.module.scss";
import { useLocation } from "react-router-dom";
import { confirmPhone } from "../../services/api/RegisterAPI";
import { FaLockOpen,FaLock } from "react-icons/fa";
import api from "../../config/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
const OrderPage = () => {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;
  const quantity = location.state?.quantity;

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
  const [disabled,setDisabled] = useState(true);
  const [isPaymentCODSuccess,setIsPaymentCODSuccess] = useState(false);

  const UserLocalStorage = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchProfileUser = async () => {
    if (user) {
      const response = await api.get(`/accounts/profile/${user.sub}`);
      console.log("Profile Information",response.data);
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
        address: profile.address || "", // Giữ lại giá trị address
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu nút hiện tại là "Save", thì chuyển sang trạng thái readonly và thay đổi nhãn nút
    if (buttonLabel === "Save") {
      setIsReadonly(true);
      setButtonLabel("Update");
      const response = await api.put(`accounts/profile/${user.sub}`, profile);
      if(response.status === 200){
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
      }
      setDisabled(false);
    } else {
      // Nếu nút hiện tại là "Update", chuyển các field về trạng thái không readonly
      setIsReadonly(false);
      setDisabled(true);
      setButtonLabel("Save");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!confirmPhone(value)) {
        setErrors((prev) => ({ ...prev, [name]: "Phone number is incorrect" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
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
      // Kiểm tra thông tin trong phần Delivery Information
      console.log("Order cua3 bo61",order);
if (!order.fullname || !order.phone || !order.address || errors.fullname || errors.phone || errors.address) {
  toast.error("You have not filled in enough delivery information", {
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
    const orderCraete = {
      buyerId : user.id,
      sellerId : ticket.seller.id,
      ticketId : ticket.id,
      quantity : quantity,
      totalAmount : order.totalAmount,
      paymentStatus : "pending",
      orderStatus: "pending",
      orderMethod: order.orderMethod,
    }
    console.log("Vé của bố ở đây",ticket);
    console.log("Create order",orderCraete);
    try {
      const response = await api.post("orders/create", orderCraete);
      console.log("Response thanh toan binh thuong",response.status);
      const OrderCreated = response.data;
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
      if(orderCraete.orderMethod === "vnpay"){
        try {
          const response = await api.post("/vnpay/create-payment", {orderId : OrderCreated.id, amount: OrderCreated.totalAmount});
          console.log("Response VNPAY",response.data);
          const urlBank = response.data
          if(response.status === 200){
            window.location.href = urlBank;
          } 
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
        }
      }else{
        setIsPaymentCODSuccess(true);
      }
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

  const handleHomeClick = () =>{
    setIsPaymentCODSuccess(false);
    navigate("/customer");
  }

  return (
    isPaymentCODSuccess ? (
      <div className={cx("body")}>
      <div className={cx("card")}>
    <div style={{borderRadius: "200px",height: "200px",width: "200px",background:"#F8FAF5",margin: "0 auto"}}>
      <i className={cx("checkmark")}>✓</i>
    </div>
      <h1 className={cx("success-text")}>Success</h1> 
      <p className={cx("success-payment-text")}>We received your purchase request;<br/> we'll be in touch shortly!</p>
      <Button variant="success" onClick={handleHomeClick}> Back </Button>
    </div>
    </div>
  ) : (
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
                    type="phone"
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
              {disabled && <h6 style={{color : "red"}}>You must save delivery information before making payment</h6>}
              <Button variant="success" className="mt-3" block onClick={handleCreateOrder} disabled ={disabled}>
                Proceed to Payment
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h4>Order Summary</h4>
              <p>Ticket Title : {order.eventTitle}</p>
              <p>Price: {order.price.toLocaleString("vi-VN")} VND</p>
              <p>Quantity: {order.quantity}</p>
              <h4>Total Amount: {order.totalAmount.toLocaleString("vi-VN")} VND</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>)
  );
};

export default OrderPage;
