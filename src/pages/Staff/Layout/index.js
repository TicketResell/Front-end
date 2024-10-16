import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffLayout.module.scss";
import Sidebar from "../StaffSidebar";
import Overview from "../StaffOverview";
import Transaction from "../Transaction";
import noImg from "../../../assets/images/crowd-background.jpg";
import Profile from "../../Profile";
import TicketManage from "../TicketManage";
import Feedback from "../Feedback";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

export default function StaffLayout() {
  const location = useLocation();
  const [currentLayout, setCurrentLayout] = useState("overview");
  const ticket = location.state?.ticket;
  console.log("Location Ticket",ticket);
  const [user,setUser] = useState(null);

  const staff = {
    name: "Karthi Madesh",
    role: "Staff",
    image: noImg,
  };

  const listTransactions = [{
    transactionID : "1",
    userID : "2",
    orderID : "3",
    amount : "5",
    transactionType : "deposit",
    transactionDate : "12/39/2023"
  },{
    transactionID : "2",
    userID : "5",
    orderID : "6",
    amount : "4",
    transactionType : "refund",
    transactionDate : "16/09/2024"
  }]

  const fetchUser = () =>{
    try {
      const userStaff =  JSON.parse(localStorage.getItem("user"));
        console.log("User Staff",userStaff)
        setUser(userStaff);
      } catch (error) {
        console.error("Không có người dùng", error);
      }
  }

  const handleLayoutClick = (view) => {
    setCurrentLayout(view);
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case "overview":
        return <Overview />;
      case "transaction":
        return <Transaction listTransactions={listTransactions}/>;
      case "profile":
        return <Profile user={user}/>
      case "ticketManage":
        return <TicketManage user={user}/>
      case "feedback":
        return <Feedback user={user}/>
      default:
        return <Overview />;
    }
  };

  useEffect(() => {
    fetchUser();
    setCurrentLayout(location.state?.currentLayout);
  }, []);

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
