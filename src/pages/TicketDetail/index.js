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
  const initialImage = ticket?.imageUrls[0];
  const series = ticket?.imageUrls.slice(1) || [];

  const [mainImage, setMainImage] = useState(initialImage);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [reportSuccessMessage, setReportSuccessMessage] = useState("");

  const fetchUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    return userToken;
  };

  useEffect(() => {
    fetchUserFromLocalStorage();
  }, []);

  const checkUserInformation = async () => {
    if (user && user.id) {
      try {
        const response = await api.post(`/accounts/is-full-data/${user.id}`);
        if (!response.data) {
          setShowIncompleteProfileModal(true);
        } else {

          navigate("/order", { state: { ticket, quantity } });

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
    if (ticket) {
      console.log("Product ID:", ticket.id);
    }
  }, [ticket]);

  useEffect(() => {
    if (user && user.sub) {
      fetchProfileUser();
    }
  }, [user]);

  const handleImageClick= (clickedImg) => {
    const newImageSeries = imagesSeries.map((image)=>
      image === clickedImg ? mainImage : image
    )
    setMainImage(clickedImg)
    setImageSeries(newImageSeries)
  }

  const handleMinus = () => {
    setQuantity(quantity > 1 ? quantity - 1 : 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleBuy = () => {
    if (ticket.status === "expired") {
      setShowExpiredModal(true);
    } else if (quantity > ticket.quantity) {
      setShowModal(true);
    } else {
      checkUserInformation();
    }
  };

  const handleReportProduct = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    const reportReason = reportText;
    const userToken = fetchUserFromLocalStorage();
    console.log("User Token:", userToken);
    try {
      const response = await api.post(`/ratings/create-report`, {
        reportedUserId: ticket.userID,
        reporterUserId: user.id,
        productId: ticket.id,
        reason: reportReason,
        status: 'pending',
        reportDate: new Date().toISOString()
      });
      if (response.status === 200) {
        console.log("Report submitted successfully:", response.data);
        toast.success("Report submitted successfully!");
        setReportSuccessMessage("Your report has been submitted successfully!");
        setReportText(""); // Clear report text after submission
        setTimeout(() => {
          setShowReportModal(false);
        }, 2000); // Close the modal after 2 seconds
      }
    } catch (error) {
      console.error("Error submitting report:", error.response?.data || error.message);
      toast.error("Error submitting report. Please try again.");
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportSuccessMessage(""); // Clear message when closing the modal
    setReportText(""); // Clear report text when closing the modal
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCloseExpiredModal = () => setShowExpiredModal(false);
  const handleCloseIncompleteProfileModal = () => {
    setShowIncompleteProfileModal(false);
    navigate("/profile");
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
              {series.map((img, index) => (
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
                  <img src={ticket.status === "Soldout" ? soldout : onsale} className={cx("w-25 h-auto")} alt="Status" />
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
                  <Button onClick={handleBuy} className={cx("w-100")} style={{ borderRadius: "30px" }} variant="primary">
                    Buy Now
                  </Button>
                </Col>
              </Row>

              <Row>
              <Button onClick={() => navigate("/customer", { state: { ticket, currentLayout: "chat" } })} className={cx("btn-outline-danger")}>
                Chat with seller <LuMessagesSquare />
              </Button>
              </Row>

              <Row>
                <Col className={cx("d-flex", "justify-content-center", "my-3")}>
                  <Button onClick={handleReportProduct} variant="danger" style={{ borderRadius: "30px" }}>
                    Report Product
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Report Modal */}
        <Modal show={showReportModal} onHide={handleCloseReportModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Report Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="reportReason">
                <Form.Label>Please provide a reason for reporting this product:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Type your report reason here..."
                />
              </Form.Group>
              {reportSuccessMessage && <p className={cx("text-success")}>{reportSuccessMessage}</p>}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReportModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleReportSubmit}>
              Submit Report
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Other Modals for Sold Out, Expired, and Incomplete Profile */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Not Enough Quantity</Modal.Title>
          </Modal.Header>
          <Modal.Body>Sorry, there are not enough tickets available.</Modal.Body>
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
          <Modal.Body>This ticket is expired. You cannot purchase it.</Modal.Body>
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
          <Modal.Body>Please complete your profile before proceeding to purchase.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseIncompleteProfileModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCloseIncompleteProfileModal}>
              Go to Profile
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
}

export default TicketDetail;
