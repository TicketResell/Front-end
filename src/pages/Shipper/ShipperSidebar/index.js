import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { FaRegChartBar, FaDollarSign, FaComments, FaSignOutAlt, FaTicketAlt } from "react-icons/fa"; // Add FaLifeRing for support
import { CgProfile } from "react-icons/cg";
import classNames from "classnames/bind";
import styles from "./ShipperSidebar.module.scss";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const cx = classNames.bind(styles);

export default function Sidebar({ shipper, onLayoutClick }) {
  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = () => {
    // Clear session or localStorage (Assuming you store the token in localStorage)
    localStorage.removeItem('authToken'); // Or remove any session or cookie information

    // Redirect to login page
    navigate('/login'); 
  };

  return (
    <Container className={cx("sidebar")}>
      <Row className={cx("dashboardTitle")}>
        <Col>DASHBOARD</Col>
      </Row>
      <Row className={cx("staffInfo")}>
        <Image src={shipper.user_image} roundedCircle className={cx("staffImage")} />
        <div className={cx("staffName")}>{shipper.fullname}</div>
        <div className={cx("staffRole")}>Shipper</div>
      </Row>
      <Row className={cx("menu")}>
        <Col>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('overview')}>
            <FaRegChartBar /> Overview
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('profile')}>
            <CgProfile /> Profile
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('getorder')}>
            <CgProfile /> Manage Order
          </div>

        </Col>
      </Row>
      <Row className={cx("menuItem")}>
        <Col>
          <div className={cx("logoutItem")} onClick={handleLogout}>
            Logout <FaSignOutAlt />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
