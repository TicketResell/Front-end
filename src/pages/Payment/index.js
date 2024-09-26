import { Col, Container, Row, Card, Button } from "react-bootstrap";
import noimg from "../../assets/images/no-image.png";
import styles from "./Payment.module.scss"
import classNames from "classnames/bind";
import { useState } from "react";

const cx = classNames.bind(styles)
function Payment() {
  const [paySuccess,setPaySuccess] = useState(false)
  //tải về reciept của người dùng
  const handleReceipt = () =>{

  }
  return (
    <>
    <Container>
      <Row> <h1>{paySuccess ? ("PAYMENT HAS BEEN SUCCESSFULL"):("PAYMENT INFORMATION")}</h1></Row>
      {paySuccess ? (
         <Row>
          <Col xs={6}><Button href="/" className={cx("button")}>Homepage</Button></Col>
          <Col xs={6}><Button onClick={handleReceipt} className={cx("button")}>Download receipt</Button></Col>
         </Row>
         ) : (
        <Row>
        <Col xs={6}>
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={noimg} />
            <Card.Body>
              <Card.Text>paymentID</Card.Text>
              <Card.Text>eventTitle</Card.Text>
              <Card.Text>quantity</Card.Text>
              <Card.Text>salePrice</Card.Text>
              <Card.Text>Buyer: username</Card.Text>
              <Card.Text>Buyer: phone</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}></Col>
      </Row>) }
      
      </Container>

      <div className={cx("footer")}>
      <Row>
        <Col xs={12}>
          <h3
            className={cx("footer-title")}
            style={{ color: "black", fontWeight: "bold" }}
          >
            CÁC BƯỚC THANH TOÁN ONLINE!
          </h3>
        </Col>
      </Row>
      <Row className={cx("footer-steps")}>
        <Col xs={12} md={4} className="text-center">
          <div className={cx("step-circle")} >
            <span>1</span>
          </div>
          <p>MỞ APP THANH TOÁN ONLINE</p>
        </Col>
        <Col xs={12} md={4} className="text-center">
          <div className={cx("step-circle")}>
            <span>2</span>
          </div>
          <p>QUÉT MÃ QR CODE TRÊN MÀN HÌNH</p>
        </Col>
        <Col xs={12} md={4} className="text-center">
          <div className={cx("step-circle")}>
            <span>3</span>
          </div>
          <p>NHẬP MÃ VÀ XÁC NHẬN</p>
        </Col>
      </Row>
      </div>
      </>
  );
}

export default Payment;
