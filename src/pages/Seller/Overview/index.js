import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./SellerOverview.module.scss";
import SmallerCard from "./SmallCard"
import RevenueChart from "./RevenueChart";
const cx = classNames.bind(styles);

export default function SellerOverview() {
  const types1 ={
    name : "Revenue",
    number : 400,
    percent : 10,
    status : "up"
  }
  const types2 ={
    name : "Sales",
    number : 100,
    percent : 10,
    status : "down"
  }
  const revenue = {
    money : "500,273.00",
    thisYear : [55, 65, 75, 60, 85, 100, 75, 68, 90, 75, 65, 55] ,
    lastYear : [45, 55, 60, 50, 70, 85, 65, 58, 75, 60, 50, 40],
  }
  return (
    <>
      <Row className={cx("rowHalfAbove")}>
        <Col xs={6}>
          <Row ><SmallerCard types={types1}/></Row>
          <Row ><SmallerCard types={types2}/></Row>
        </Col>
        <Col xs={6} >
          <RevenueChart revenue={revenue}/>
        </Col>
      </Row>
      <Row className={cx("rowHalfDown")}>
        <Col xs={8} >
          Total orders for the day
        </Col>
        <Col xs={4}>
          Validity period of tickets on sale
        </Col>
      </Row>
    </>
  );
}
