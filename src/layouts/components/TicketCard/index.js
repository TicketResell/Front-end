import { Card, ListGroup, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate,useHistory } from "react-router-dom";
import styles from "./TicketCard.module.scss"
import classNames from "classnames/bind";

function TicketCard({ticket}) {
  const cx = classNames.bind(styles);

  const navigate = useNavigate();

  const handleBuy = () =>{
    navigate("/payment")
  }
  const handleClickCard = () =>{
    navigate("/ticketDetail",{ state: { data: ticket } })
  }
  return (
    <Card className={cx("card")} onClick={handleClickCard}>
      {/*Hình ảnh của seller*/}
      <Card.Img variant="top" src={ticket.sellerID} alt="2"
       />
      <Card.Body className={cx("card-body")}>
        <Card.Title className={cx("card-title")}>{ticket.eventTitle}</Card.Title>
        <Card.Text>{ticket.ticketDetails}</Card.Text>
      </Card.Body>

      <Container className={cx("card-container")}>
        <Row>
          <Col xs={3}>
            <Card.Img src={ticket.image} alt="1"/>
          </Col>
          <Col xs={9}>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Location : {ticket.location}</ListGroup.Item>
              <ListGroup.Item>Date : {ticket.eventDate}</ListGroup.Item>
              <ListGroup.Item><span className={cx("price-original")}>{ticket.price}</span> 
              <span className={cx("price-sale")}>{ticket.salePrice}</span></ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <Card.Body className={cx("card-footer")}>
        <Button variant="success" onClick={handleBuy} className={cx("buy-button")}>Buy</Button>
      </Card.Body>
    </Card>
  );
}

export default TicketCard;
