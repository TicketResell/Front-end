import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, InputGroup, Modal, Form } from "react-bootstrap";
import { TiTicket } from "react-icons/ti";
import { MdOutlineDateRange } from "react-icons/md";
import { IoLocationSharp, IoPricetagsSharp } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import classNames from "classnames/bind";
import soldout from '../../assets/images/soldout-logo.png';
import onsale from '../../assets/images/onsale-logo.jpg';
import api from "../../../src/config/axios";
import styles from "./TicketDetail.module.scss";
import { toast } from 'react-toastify';

function TicketDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;

  const cx = classNames.bind(styles);
  const initialImage = ticket.imageUrls[0];
  const series = ticket.imageUrls.slice(1);

  const [mainImage, setMainImage] = useState(initialImage);
  const [imagesSeries, setImageSeries] = useState(series);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});

  const fetchUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  };

  useEffect(() => {
    fetchUserFromLocalStorage();
  }, []);

  const checkUserInformation = async () => {
    if (user && user.id) {
      try {
        const response = await api.post(`/accounts/is-full-data/${user.id}`);
        if (!response.data) {
          setShowIncompleteProfileModal(true); // Show modal for incomplete profile
        } else {
          // Proceed to order page if profile is complete
          navigate("/order", { state: { ticket: ticket, quantity: quantity } });
        }
      } catch (error) {
        console.error("Error checking user information:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const fetchProfileUser = async () => {
    if (user) {
      const response = await api.get(`/accounts/profile/${user.sub}`);
      setProfile(response.data);
    }
  };

  useEffect(() => {
    if (user && user.sub) {
      fetchProfileUser();
    }
  }, [user]);

  const handleImageClick = (clickedImg) => {
    setMainImage(clickedImg);
  };

  const handleMinus = () => {
    setQuantity((quantity) => (quantity > 1 ? quantity - 1 : 1));
  };

  const handlePlus = () => {
    setQuantity((quantity) => quantity + 1);
  };

  const handleBuy = () => {
    if (ticket.status === "expired") {
      setShowExpiredModal(true);
    } else if (quantity > ticket.quantity) {
      setShowModal(true);
    } else {
      checkUserInformation(); // Check if the user's profile is complete
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCloseExpiredModal = () => setShowExpiredModal(false);
  const handleCloseIncompleteProfileModal = () => {
    setShowIncompleteProfileModal(false);
    navigate("/profile"); // Navigate to profile when OK is clicked
  };

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
                <span className={cx("ms-2")}>
                  <img src={ticket.status === "Soldout" ? soldout : onsale} className={cx("w-25 h-auto")} />
                </span>
              </div>

              <div className={cx("mb-3")}>
                <span className={cx("h5")}>{ticket.ticketType}</span>
              </div>

              <p>{ticket.ticketDetails}</p>

              <dl className={cx("row")}>
                <dt className={cx("col-3")}>Date <MdOutlineDateRange /> :</dt>
                <dd className={cx("col-9")}>{ticket.eventDate}</dd>
                <dt className={cx("col-3")}>Location <IoLocationSharp />:</dt>
                <dd className={cx("col-9")}>{ticket.location}</dd>
                <dt className={cx("col-3")}>Price <IoPricetagsSharp /> :</dt>
                <dd className={cx("col-9")}>{ticket.price}$</dd>
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
                    <Form.Control className={cx("text-center", "border", "border-secondary")} placeholder={quantity} aria-label="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                    <Button variant="white" className={cx("border", "border-secondary", "px-3")} onClick={handlePlus}>
                      <i className="fas fa-plus"></i>
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={8} xs={6} className={cx("d-flex", "align-items-end")}>
                  <Button onClick={handleBuy} className={cx("btn-danger", "w-100")}>
                    Buy Now <TiTicket />
                  </Button>
                </Col>
              </Row>
              <Button onClick={() => navigate("/customer", { state: { ticket: ticket, currentLayout: "chat" } })} className={cx("btn-outline-danger")}>
                Chat with seller <LuMessagesSquare />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Existing Modals */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Out of Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sorry, we don't have enough tickets available for your request.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showExpiredModal} onHide={handleCloseExpiredModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This ticket is expired. Please select another ticket.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseExpiredModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showIncompleteProfileModal} onHide={handleCloseIncompleteProfileModal}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Incomplete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your profile is incomplete. Please update your profile information.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseIncompleteProfileModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default TicketDetail;
