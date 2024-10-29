import { Container, Row, Col, Button, Image } from "react-bootstrap";
import {
  FaRegChartBar,
  FaDollarSign,
  FaComments,
  FaSignOutAlt,
  FaTicketAlt,FaHome, 
} from "react-icons/fa"; // Add FaLifeRing for support
import { CgProfile } from "react-icons/cg";
import { MdContactSupport } from "react-icons/md";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const cx = classNames.bind(styles);

export default function Sidebar({ customer, onLayoutClick }) {
  const [activeItem, setActiveItem] = useState("overview"); 

  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = () => {
    // Clear session or localStorage (Assuming you store the token in localStorage)
    localStorage.removeItem('token'); // Or remove any session or cookie information

    // Redirect to login page
    navigate('/login'); 
  };
  const handleHome = () =>{
    navigate('/'); 
  }
  return (
    <Container className={cx("sidebar")}>
      <Row className={cx("dashboardTitle")}>
        <Col>DASHBOARD</Col>
      </Row>
      <Row className={cx("customerInfo")}>
        {/*<Image src={customer.image} roundedCircle className={cx("customerImage")} />*/}
        {customer ? (
          <>
            <Image src={customer.user_image} alt="Image User" roundedCircle/>
            <div className={cx("customerName")}>{customer.fullname}</div>
            <div className={cx("customerRole")}>{customer.role}</div>
          </>
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        <Button
          className={cx("addProductButton")}
          onClick={() => onLayoutClick("newTicket")}
        >
          Add New Ticket
        </Button>
      </Row>
      <Row>
          <div
            className={cx("menuItem", { active: activeItem === "overview" })}
            onClick={() => {onLayoutClick("overview");
              setActiveItem("overview");
            }}
          >
          <b></b>
          <b></b>
            <FaRegChartBar /> Overview
          </div>

          <div
            className={cx("menuItem",{ active: activeItem === "orderSeller" })}
            onClick={() => {onLayoutClick("orderSeller");
              setActiveItem("orderSeller");
            }}
          >
          <b></b>
          <b></b>
            <FaDollarSign /> Order
          </div>

          <div className={cx("menuItem",{ active: activeItem === "chat" })} onClick={() => {onLayoutClick("chat");setActiveItem("chat");}}>
          <b></b>
          <b></b>
            <FaComments /> Chat
          </div>

          <div
            className={cx("menuItem",{ active: activeItem === "setTicket" })}
            onClick={() => {onLayoutClick("setTicket");setActiveItem("setTicket");}}
          >
            <b></b>
            <b></b>
            <FaTicketAlt /> My Ticket
          </div>
          <div
            className={cx("menuItem",{ active: activeItem === "profile" })}
            onClick={() => {onLayoutClick("profile");setActiveItem("profile");}}
          >
            <b></b>
            <b></b>
            <CgProfile /> Profile
          </div>
          <div className={cx("menuItem",{ active: activeItem === "feedback" })} onClick={() => {onLayoutClick('feedback');setActiveItem("feedback");}}>
            <b></b>
            <b></b>
            <MdContactSupport /> Feedback 
          </div>
      </Row>
      <Row className={cx("menuItem")}>
      <Col>
          <div className={cx("logoutItem")} onClick={handleHome}>
            Home <FaHome/>
          </div>
        </Col>
        <Col>
          <div className={cx("logoutItem")} onClick={handleLogout}>
            Logout <FaSignOutAlt />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
