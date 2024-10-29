import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./Overview.module.scss";
import SmallerCard from "./SmallCard"
import RevenueChart from "./RevenueChart";
import OrdersList from "../../../layouts/components/OrdersList"; 
const cx = classNames.bind(styles);

export default function Overview({listOrdersBuyer,revenue,sales}) {
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
  const revenue1 = {
    money : "500,273.00",
    thisYear : [55, 65, 75, 60, 85, 100, 75, 68, 90, 75, 65, 55] ,
    lastYear : [45, 55, 60, 50, 70, 85, 65, 58, 75, 60, 50, 40],
  }
  return (
    <>
      <Row className={cx("rowHalfAbove")}>
        <Col xs={6}>
          <Row ><SmallerCard types={revenueTotal}/></Row>
          <Row ><SmallerCard types={salesTotal}/></Row>
        </Col>
        <Col xs={6} >
          <RevenueChart revenue={revenue1}/>
        </Col>
      </Row>
      <Row className={cx("rowHalfDown")}>
          <OrdersList listOrders={listOrdersBuyer} isOrderBuyer={true}/>
      </Row>
    </>
  );
}
