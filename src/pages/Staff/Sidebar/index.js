import { Container, Row, Col, Button, Image } from "react-bootstrap";
import {
  FaRegChartBar,
  FaDollarSign,
  FaComments,
  FaSignOutAlt,
  FaTicketAlt,
  FaLifeRing,
} from "react-icons/fa"; // Add FaLifeRing for support
import { CgProfile } from "react-icons/cg";
import { MdContactSupport } from "react-icons/md";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'react-bootstrap';

const cx = classNames.bind(styles);

export default function Sidebar({ staff, onLayoutClick }) {

  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = () => {
    // Clear session or localStorage (Assuming you store the token in localStorage)
    localStorage.removeItem('token'); // Or remove any session or cookie information

    // Redirect to login page
    navigate('/login'); 
  };
  return (
    <Container className={cx("sidebar")}>
      <Row className={cx("dashboardTitle")}>
        <Col>DASHBOARD</Col>
      </Row>
      <Row className={cx("staffInfo")}>
        {staff ? (
          <>
            <Image src={staff.user_image} alt="Image User" roundedCircle/>
            <div className={cx("staffName")}>{staff.fullname}</div>
            <div className={cx("staffRole")}>{staff.role}</div>
          </>
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </Row>
      <Row className={cx("menu")}>
        <Col>
          <div
            className={cx("menuItem")}
            onClick={() => onLayoutClick("overview")}
          >
            <FaRegChartBar /> Overview
          </div>
          <div
            className={cx("menuItem")}
            onClick={() => onLayoutClick("transaction")}
          >
            <FaDollarSign /> Transaction
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick("chat")}>
            <FaComments /> Chat
          </div>
          <div
            className={cx("menuItem")}
            onClick={() => onLayoutClick("ticketManage")}
          >
            <FaTicketAlt /> TicketManage
          </div>
          <div
            className={cx("menuItem")}
            onClick={() => onLayoutClick("profile")}
          >
            <CgProfile /> Profile
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('feedback')}>
            <MdContactSupport /> Feedback 
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick("getuser")}>
            <FaLifeRing /> Manage User
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick("getreport")}>
            <FaLifeRing /> Manage Report
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick("getorder")}>
            <FaLifeRing /> Manage Orders
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
