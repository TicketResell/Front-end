import { useState } from "react";
import { Card, ListGroup, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

function TicketCard({ticket}) {
  const [loadImage,setLoadImage] = useState(true);

  const navigate = useNavigate();

  const handleBuy = () =>{
    navigate("/payment")
  }
  return (
    <Card style={{ width: "18rem" }}>
      {/*Hình ảnh của seller*/}
      {loadImage && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
          <ReactLoading type={"spin"} color={"#000"} />
        </div>
      )}
      <Card.Img variant="top" src={ticket.sellerID} onLoad={()=> setLoadImage(false)} 
      style={{ display: loadImage ? "none" : "block" }} //Ẩn cho đến khi ảnh tải xong
       />
      <Card.Body>
        <Card.Title>{ticket.eventTitle}</Card.Title>
        <Card.Text>{ticket.ticketDetails}</Card.Text>
      </Card.Body>

      <Container>
        <Row>
          <Col xs={3}>
          {loadImage && (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                <ReactLoading type={"spin"} color={"#000"} />
              </div>
            )}
            <Card.Img src={ticket.image} onLoad={() => setLoadImage(false)} 
              style={{ display: loadImage ? "none" : "block" }}/>
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
