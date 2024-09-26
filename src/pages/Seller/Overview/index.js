import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./SellerOverview.module.scss";
import SmallerCard from "./SmallCard"
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
  return (
    <>
      <Row className={cx("rowHalfAbove")}>
        <Col xs={6}>
          <Row ><SmallerCard types={types1}/></Row>
          <Row ><SmallerCard types={types2}/></Row>
        </Col>
        <Col xs={6} >
          Sales table by month
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
