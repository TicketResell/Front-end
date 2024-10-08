import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { FaRegChartBar, FaDollarSign, FaComments, FaSignOutAlt, FaTicketAlt} from "react-icons/fa"; // Add FaLifeRing for support
import { CgProfile } from "react-icons/cg";
import { MdContactSupport } from "react-icons/md";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

export default function Sidebar({ seller, onLayoutClick }) {
  return (
    <Container className={cx("sidebar")}>
      <Row className={cx("dashboardTitle")}>
        <Col>DASHBOARD</Col>
      </Row>
      <Row className={cx("sellerInfo")}>
        <Image src={seller.image} roundedCircle className={cx("sellerImage")} />
        <div className={cx("sellerName")}>{seller.name}</div>
        <div className={cx("sellerRole")}>User</div>
        <Button className={cx("addProductButton")} onClick={() => onLayoutClick('newTicket')}>Add New Ticket</Button>
      </Row>
      <Row className={cx("menu")}>
        <Col>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('overview')}>
            <FaRegChartBar /> Overview
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('transaction')}>
            <FaDollarSign /> Transaction
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('chat')}>
            <FaComments /> Chat
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('setTicket')}>
            <FaTicketAlt /> My Ticket
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('profile')}>
            <CgProfile /> Profile
          </div>
          <div className={cx("menuItem")} onClick={() => onLayoutClick('support')}>
            <MdContactSupport /> Help & Support 
          </div>
        </Col>
      </Row>
      <Row className={cx("menuItem")}>
        <Col>
          <div className={cx("logoutItem")}>
            Logout <FaSignOutAlt />
          </div>
        </Col>
      </Row>
    </Container>
  );
}