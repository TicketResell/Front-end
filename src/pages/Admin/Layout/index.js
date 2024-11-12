import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffLayout.module.scss";
import Sidebar from "../AdminSidebar";
import Admin from "../AdminOverview";
import UserList from "../GetUsers";
import OrderList from "../GetOrder";
import TransactionList from "../GetTransaction";
import { useState, useEffect } from "react";

const cx = classNames.bind(styles);

export default function AdminLayout() {
  const [currentLayout, setCurrentLayout] = useState("overview");
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const userShipper = JSON.parse(localStorage.getItem("user"));
      setUser(userShipper);
    } catch (error) {
      console.error("Không có người dùng", error);
    }
  };

  const handleLayoutClick = (view) => {
    setCurrentLayout(view);
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case "overview":
        return <Admin />;
      case "getuser":
        return <UserList />;
      case "getorder":
        return <OrderList />;
      case "gettransaction":
        return <TransactionList />;
      default:
        return <Admin />; // Fallback to "overview" if currentLayout is undefined
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container fluid className={cx("container")}>
      <Row className={cx("rowFullHeight")}>
        <Col xs={2} className={cx("wrapper", "p-3")}>
          {user && <Sidebar shipper={user} onLayoutClick={handleLayoutClick} />} {/* Sidebar for staff */}
        </Col>
        <Col xs={10} className={cx("rowFullHeight")}>
          {renderLayout()}
        </Col>
      </Row>
    </Container>
  );
}
