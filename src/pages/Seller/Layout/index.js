import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./SellerLayout.module.scss";
import SellerSidebar from "../Sidebar";
import SellerOverview from "../Overview";
import SellerTransaction from "../Transaction";
import SellerChat from "../Chat";
import noImg from "../../../assets/images/crowd-background.jpg";
import SellerNewTick from "../NewTicket";
import TicketManage from "../TicketManage";
import Profile from "../../Profile";

import { useState } from "react";
const cx = classNames.bind(styles);

export default function SellerLayout() {
  const [currentLayout, setCurrentLayout] = useState("overview");

  const seller = {
    name: "Karthi Madesh",
    role: "Seller",
    image: noImg,
  };

  const handleLayoutClick = (view) => {
    setCurrentLayout(view);
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case "overview":
        return <SellerOverview />;
      case "transaction":
        return <SellerTransaction />;
      case "chat":
        return <SellerChat />;
      case "newTicket":
        return <SellerNewTick/>
      case "setTicket":
        return <TicketManage/>
      case "profile":
        return <Profile/>
      default:
        return <SellerOverview />;
    }
  };
  return (
    <Container fluid className={cx("container")}>
      <Row className={cx("rowFullHeight")}>
        <Col xs={2} className={cx("wrapper", "p-3")}>
          <SellerSidebar seller={seller} onLayoutClick={handleLayoutClick} />
        </Col>
        <Col xs={10} className={cx("rowFullHeight")}>
          {renderLayout()}
        </Col>
      </Row>
    </Container>
  );
}
