import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffLayout.module.scss";
import Sidebar from "../StaffSidebar";
import Overview from "../StaffOverview";
import noImg from "../../../assets/images/crowd-background.jpg";
import Profile from "../../Profile";
import NotificationManagement from "../Notification";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import StaffList from "../GetUser";
import ReportList from "../GetReport";
import OrderList from "../GetOrder";
import RatingList from "../GetRatings";




const cx = classNames.bind(styles);

export default function StaffLayout() {
  const location = useLocation();
  const [currentLayout, setCurrentLayout] = useState("overview");
  const ticket = location.state?.ticket;
  console.log("Location Ticket",ticket);
  const [user,setUser] = useState(null);

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
      case "profile":
        return <Profile user={user}/>
      case "notification":
        return <NotificationManagement user={user}/>
        case "getuser":
          return <StaffList user={user}/>
      case "getreport":
          return <ReportList user={user}/>
      case "getorder":
          return <OrderList user={user}/>
          case "getrating":
            return <RatingList user={user}/>
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
          {user && <Sidebar staff={user} onLayoutClick={handleLayoutClick} />} {/* Sidebar for staff */}
        </Col>
        <Col xs={10} className={cx("rowFullHeight")}>
          {renderLayout()}
        </Col>
      </Row>
    </Container>
  );
}
