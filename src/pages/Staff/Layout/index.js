import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./StaffLayout.module.scss";
import Sidebar from "../Sidebar"; 
import StaffOverview from "../StaffOverview";  
import StaffChat from "../Chat"; 
import TicketManage from "../TicketManage"; 
import StaffSupport from "../StaffSupport"; 
import Profile from "../../Profile";

import noImg from "../../../assets/images/crowd-background.jpg"; // Default image for staff

const cx = classNames.bind(styles);

export default function StaffLayout() {
  const [currentLayout, setCurrentLayout] = useState("overview");

  const staff = {
    name: "John Doe",
    role: "Staff Member",
    image: noImg, // Staff member image
  };

  const handleLayoutClick = (view) => {
    setCurrentLayout(view);
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case "overview":
        return <StaffOverview />; // Staff overview component
      case "chat":
        return <StaffChat />; // Chat component for staff
      case "setTicket":
        return <TicketManage />; // Ticket management component
      case "profile":
        return <Profile />; // Profile management for staff
      case "support":
        return <StaffSupport />; // Support section
      default:
        return <StaffOverview />; // Default view is the overview
    }
  };

  return (
    <Container fluid className={cx("container")}>
      <Row className={cx("rowFullHeight")}>
        <Col xs={2} className={cx("wrapper", "p-3")}>
          <Sidebar staff={staff} onLayoutClick={handleLayoutClick} /> {/* Sidebar for staff */}
        </Col>
        <Col xs={10} className={cx("rowFullHeight")}>
          {renderLayout()}
        </Col>
      </Row>
    </Container>
  );
}
