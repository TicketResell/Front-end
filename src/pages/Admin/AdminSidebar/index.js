import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { FaRegChartBar, FaDollarSign, FaComments, FaSignOutAlt, FaTicketAlt } from "react-icons/fa"; // Add FaLifeRing for support
import { CgProfile } from "react-icons/cg";
import classNames from "classnames/bind";
import styles from "./AdminSidebar.module.scss";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const cx = classNames.bind(styles);

export default function Sidebar({ admin = {}, onLayoutClick }) { // Set a default empty object for admin
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
        {admin.user_image ? (
          <Image src={admin.user_image} roundedCircle className={cx("staffImage")} />
        ) : (
          <Image src="placeholder-image-url.jpg" roundedCircle className={cx("staffImage")} /> // Placeholder image
        )}
        <div className={cx("staffName")}>{admin.fullname || "Admin Name"}</div>
        <div className={cx("staffRole")}>Admin</div>
      </Row>
      <Row className={cx("menu")}>
        <Col>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('admin')}>
            <FaRegChartBar /> Overview
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('getuser')}>
            <CgProfile /> Manage User
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('getorder')}>
            <CgProfile /> Manage Order
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('gettransaction')}>
            <CgProfile /> Manage Transaction
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
