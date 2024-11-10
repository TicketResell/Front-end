import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffLayout.module.scss";
import Sidebar from "../ShipperSidebar";
import Overview from "../ShipperOverview";
import Profile from "../../Profile";
import { useState } from "react";
import { useEffect } from 'react';
import OrderList from "../GetOrder";



const cx = classNames.bind(styles);

export default function ShipperLayout() {
  const [currentLayout, setCurrentLayout] = useState("overview");
  const [user,setUser] = useState(null);

  const fetchUser = async () =>{
    try {
      const userShipper=  JSON.parse(localStorage.getItem("user"));
        setUser(userShipper);
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
      case "getorder":
          return <OrderList user={user}/>
      default:
        return <Overview />;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container fluid className={cx("container")}>
      <Row className={cx("rowFullHeight")}>
        <Col xs={2} className={cx("wrapper", "p-3")}>
          {user && <Sidebar shipper={user} onLayoutClick={handleLayoutClick} /> }{/* Sidebar for staff */}
        </Col>
        <Col xs={10} className={cx("rowFullHeight")}>
          {renderLayout()}
        </Col>
      </Row>
    </Container>
  );
}
