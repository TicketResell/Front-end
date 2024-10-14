import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { FaRegChartBar, FaDollarSign, FaComments, FaSignOutAlt, FaTicketAlt } from "react-icons/fa"; // Add FaLifeRing for support
import { CgProfile } from "react-icons/cg";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const cx = classNames.bind(styles);

export default function Sidebar({ staff, onLayoutClick }) {
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
        <Image src={staff.image} roundedCircle className={cx("staffImage")} />
        <div className={cx("staffName")}>{staff.name}</div>
        <div className={cx("staffRole")}>Staff</div>
      </Row>
      <Row className={cx("menu")}>
        <Col>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('overview')}>
            <FaRegChartBar /> Overview
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('transaction')}>
            <FaDollarSign /> Transaction
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('feedback')}>
            <FaComments /> Feedback
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('ticketManage')}>
            <FaTicketAlt /> Ticket Manage
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('profile')}>
            <CgProfile /> Profile
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
