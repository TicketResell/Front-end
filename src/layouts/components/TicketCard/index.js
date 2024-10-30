import { Card, ListGroup, Button, Container, Row, Col,Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./TicketCard.module.scss";
import classNames from "classnames/bind";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { IoPricetagsSharp } from "react-icons/io5";

function TicketCard({ ticket,seller = {} }) {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();

  const handleClickCard = () => {
    const encodedEventTitle = encodeURIComponent(ticket.eventTitle);
    navigate(`/ticketDetail/${ticket.userID}/${ticket.id}/${encodedEventTitle}`, { state: { ticket,seller } });
  }
  

  return (
    <Card className={cx("card")} onClick={handleClickCard}>
      <Card.Img variant="top" src={ticket.imageUrls[0]} alt="2" thumbnail style={{ width: "286px", height: "170px", objectFit: "cover" }} />
      <Card.Body className={cx("card-body")}>
        <Card.Title className={cx("card-title")}>{ticket.eventTitle}</Card.Title>
        <Card.Text>{ticket.ticketDetails}</Card.Text>
      </Card.Body>

      <Container className={cx("card-container")}>
        <Row>
          <Col xs={3}>
            <Image src={seller.userImage ||"https://i.ibb.co/sg31cC8/download.png"} alt="1" fluid thumbnail/>
          </Col>
          <Col xs={9}>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Type: {ticket.ticketType}</ListGroup.Item>
              <ListGroup.Item className={cx("card-location")}>
                Location <IoLocationSharp />: {ticket.location}
              </ListGroup.Item>
              <ListGroup.Item>
                Date <MdOutlineDateRange />: {ticket.eventDate}
              </ListGroup.Item>
              <ListGroup.Item>
                <span className={cx("price-sale")}>
                  <IoPricetagsSharp /> {ticket.price.toLocaleString("vi-VN")} VND
                </span>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <Card.Body className={cx("card-footer")}>
        <Button variant="success" className={cx("buy-button")}>Buy</Button>
      </Card.Body>
    </Card>
  );
}

export default TicketCard;
