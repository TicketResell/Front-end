import { Container, Row, Col, Button, Image } from "react-bootstrap";
import {FaRegChartBar,FaDollarSign,FaComments,FaSignOutAlt,} from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

export default function SellerSidebar({ seller, onLayoutClick }) {
  return (
    <Container className={cx("sidebar")}>
      <Row className={cx("dashboardTitle")}>
        <Col>DASHBOARD</Col>
      </Row>
      <Row className={cx("sellerInfo")}>
        <Image src={seller.image} roundedCircle  className={cx("sellerImage")} />
        <div className={cx("sellerName")}>{seller.name}</div>
        <div className={cx("sellerRole")}>Seller</div>
        <Button className={cx("addProductButton")}>Add New Product</Button>
      </Row>
      <Row className={cx("menu")}>
        <Col>
          <div className={cx("menuItem")} onClick={()=>onLayoutClick('overview')}>
            <FaRegChartBar /> Overview
          </div>
          <div className={cx("menuItem")} onClick={()=>onLayoutClick('transaction')}>
            <FaDollarSign /> Transaction
          </div>
          <div className={cx("menuItem")} onClick={()=>onLayoutClick('chat')}>
            <FaComments /> Chat
          </div>
        </Col>
      </Row>
      <Row className={cx("logoutSection")}>
        <Col>
          <div className={cx("logoutItem")} style={{marginTop:"150%"}}>
            Logout <FaSignOutAlt />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
