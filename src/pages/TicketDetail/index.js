import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { TiTicket } from "react-icons/ti";
import { LuMessagesSquare } from "react-icons/lu";
import soldout from '../../assets/images/soldout-logo.png'
import onsale from "../../assets/images/onsale-logo.jpg"
import styles from "./TicketDetail.module.scss"
import classNames from "classnames/bind";


function TicketDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.data;
  const cx = classNames.bind(styles)
  const initialImage = ticket.imageUrls[0];
  const series = ticket.imageUrls.slice(1)

  const [mainImage, setMainImage] = useState(initialImage);
  const [imagesSeries, setImageSeries] = useState(series);
  const [quantity,setQuantity] = useState(1);

  const handleImageClick= (clickedImg) => {
    const newImageSeries = imagesSeries.map((image)=>
      image === clickedImg ? mainImage : image
    )
    setMainImage(clickedImg)
    setImageSeries(newImageSeries)
  }
  const handleMinus = () =>{
    setQuantity((quantity)=> quantity > 1 ? quantity-1 : 1)
  }
  const handlePlus = () =>{
    setQuantity((quantity)=>quantity+1)
  }
  const handleBuy = () =>{
    navigate("/order",{ state: { data: ticket } })
  }
  const handleBargain = () =>{
    navigate("/customer",{ state: { data: ticket,currentLayout : "chat" } })
  }
  return (
    <section className={cx("py-5")}>
    <Container>
      <Row className={cx("gx-5")}>
        <Col lg={6}>
          <div className={cx("rounded-4", "mb-3", "d-flex", "justify-content-center")}>
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100vh",
                margin: "auto",
              }}
              className={cx("rounded-4", "fit")}
              src={mainImage}
              alt="Product"
            />
          </div>

          <div className={cx("d-flex", "justify-content-center", "mb-3")}>
            {imagesSeries.map((img, index) => (
              <a
                key={index}
                onClick={() => handleImageClick(img)}
                className={cx("border", "mx-1", "rounded-2")}
                style={{ cursor: "pointer" }}
              >
                <img
                  width="60"
                  height="60"
                  className={cx("rounded-2")}
                  src={img}
                  alt={`Image ${index + 1}`}
                />
              </a>
            ))}
          </div>
        </Col>

        <Col lg={6}>
          <div className={cx("ps-lg-3")}>
            <h4 className={cx("title", "text-dark")}>
              {ticket.eventTitle}
            </h4>
            <div className={cx("d-flex", "flex-row", "my-3")}>
              <div className={cx("text-warning", "mb-1", "me-2")}></div>
              <span className={cx("ms-2")}><img src={ticket.status === "Soldout" ?soldout : onsale} className={cx("w-25 h-auto")}/></span>
            </div>

            <div className={cx("mb-3")}>
              <span className={cx("h5")}>{ticket.ticketType}</span>
            </div>

            <p>
              {ticket.ticketDetails}
            </p>

            <dl className={cx("row")}>
              <dt className={cx("col-3")}>Date:</dt>
              <dd className={cx("col-9")}>{ticket.eventDate}</dd>
              <dt className={cx("col-3")}>Location:</dt>
              <dd className={cx("col-9")}>{ticket.location}</dd>
              <dt className={cx("col-3")}>Price:</dt>
              <dd className={cx("col-9")}>{ticket.price}</dd>
              <dt className={cx("col-3")}>Sale Price:</dt>
              <dd className={cx("col-9")}>{ticket.salePrice}</dd>
              <dt className={cx("col-3")}>Quantity:</dt>
              <dd className={cx("col-9")}>{ticket.quantity}</dd>
            </dl>

            <hr />

            <Row className={cx("mb-4")}>
              <Col md={4} xs={6} className={cx("mb-3")}>
                <Form.Label className={cx("mb-2", "d-block")}>Quantity</Form.Label>
                <InputGroup style={{ width: "170px" }}>
                  <Button variant="white" className={cx("border", "border-secondary", "px-3")} onClick={handleMinus}>
                    <i className="fas fa-minus"></i>
                  </Button>
                  <Form.Control className={cx("text-center", "border", "border-secondary")} placeholder={quantity} aria-label="Quantity" onChange={(e)=>setQuantity(Number(e.target.value))}/>
                  <Button variant="white" className={cx("border", "border-secondary", "px-3")} onClick={handlePlus}>
                    <i className="fas fa-plus"></i>
                  </Button>
                </InputGroup>
              </Col>
            </Row>

            <Button variant="warning" className={cx("shadow-0")} onClick={handleBuy}>
              <TiTicket/>  Buy now
            </Button>
            <Button variant="primary" className={cx("shadow-0", "mx-2")} onClick={handleBargain}>
            <LuMessagesSquare/>  Bargain
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
  );
}

export default TicketDetail;
