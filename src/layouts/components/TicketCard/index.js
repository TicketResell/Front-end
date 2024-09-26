import { Card, ListGroup, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function TicketCard({ticket}) {
  const navigate = useNavigate()
  const handleBuy = () =>{
    navigate("/payment")
  }
  return (
    <Card style={{ width: "18rem" }}>
      {/*Hình ảnh của seller*/}
      <Card.Img variant="top" src={ticket.sellerID} />
      <Card.Body>
        <Card.Title>{ticket.eventTitle}</Card.Title>
        <Card.Text>{ticket.ticketDetails}</Card.Text>
      </Card.Body>

      <Container>
        <Row>
          <Col xs={3}>
            <Card.Img src={ticket.image}/>
          </Col>
          <Col xs={9}>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>{ticket.location}</ListGroup.Item>
              <ListGroup.Item>{ticket.eventDate}</ListGroup.Item>
              <ListGroup.Item>{ticket.salePrice}</ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <Card.Body className="d-flex justify-content-center w-100">
        <Button variant="success" onClick={handleBuy}>Buy</Button>
      </Card.Body>
    </Card>
  );
}

export default TicketCard;
