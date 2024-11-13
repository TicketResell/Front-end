import { Row,Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./Overview.module.scss";
import SmallerCard from "./SmallCard"
import OrdersList from "../../../layouts/components/OrdersList"; 
const cx = classNames.bind(styles);

export default function Overview({listOrdersBuyer,revenue,sales,onRefresh}) {
  const revenueTotal ={
    name : "Revenue",
    number : revenue.toLocaleString("vi-VN"),
    status : "up"
  }
  const salesTotal ={
    name : "Sales",
    number : sales,
    status : "down"
  }
  return (
    <>
      <Row className={cx("rowHalfAbove")}>
        <Col xs = {6}>
          <Row className={cx("item-container")} ><SmallerCard types={revenueTotal}/></Row>
        </Col>
        <Col xs = {6}>
          <Row className={cx("item-container")}><SmallerCard types={salesTotal}/></Row>
        </Col>
      </Row>
      <Row className={cx("rowHalfDown")}>
          <OrdersList listOrders={listOrdersBuyer} isOrderBuyer={true} onRefresh={onRefresh}/>
      </Row>
    </>
  );
}
