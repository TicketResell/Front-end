import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, InputGroup, Modal, Form } from "react-bootstrap";
import { TiTicket } from "react-icons/ti";
import { MdOutlineDateRange } from "react-icons/md";
import { IoLocationSharp, IoPricetagsSharp } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import classNames from "classnames/bind";
import soldout from '../../assets/images/soldout-logo.png';
import onsale from '../../assets/images/onsale-logo.jpg';
import api, { apiWithoutPrefix } from "../../../src/config/axios";
import styles from "./TicketDetail.module.scss";
import { ToastContainer,Bounce, toast } from 'react-toastify';
import SellerInformation from "../../layouts/components/Seller Information";

const TicketDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, ticketId, eventTitle } = useParams();
  const decodedEventTitle = decodeURIComponent(eventTitle);

  const ticket = location.state?.ticket;
  const sellerInfor = location.state?.seller

  const cx = classNames.bind(styles);
  const initialImage = ticket?.imageUrls[0] || '';
  const series = ticket?.imageUrls.slice(0) || [];

  const [mainImage, setMainImage] = useState(initialImage);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState(false);
  const [imagesSeries, setImageSeries] = useState(series);
  const [user, setUser] = useState(null);
  const [reportSuccessMessage, setReportSuccessMessage] = useState("");

  // Check user login state from localStorage
  const fetchUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    if (userData) {
      console.log("User Login",JSON.parse(userData));
      setUser(JSON.parse(userData));
    }
    return userToken;
  };

  useEffect(() => {
    const userToken = fetchUserFromLocalStorage();
    // Redirect to login if user is not logged in
    if (!userToken) {
      navigate("/login", { state: { from: location } });
    } else {
      fetchProfileUser();
    }
  }, []);

  const fetchProfileUser = async () => {
    if (user) {
      try {
        const response = await api.post(`/accounts/is-full-data/${user.id}`);
        if (!response.data) {
          setShowIncompleteProfileModal(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  const checkUserInformation = async () => {
    if (!user || !user.id) {
      return navigate("/login");
    }
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
  };

  const handleImageClick= (clickedImg) => {
    const newImageSeries = imagesSeries.map((image) =>
      image === clickedImg ? mainImage : image
    );
    setMainImage(clickedImg);
    setImageSeries(newImageSeries);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
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
    if (!user) {
      toast.info("Please log in to report a product.");
    } else {
      setShowReportModal(true);
    }
  };

  const handleReportSubmit = async () => {
    const userToken = fetchUserFromLocalStorage();
    try {
      const response = await api.post(`/ratings/create-report`, {
        reportedUserId: ticket.seller.id,
        reporterUserId: user.id,
        productId: ticket.id,
        reason: reportText,
        status: 'pending',
        reportDate: new Date().toISOString()
      });
      if (response.status === 200) {
        toast.success("Report submitted successfully!");
        setReportSuccessMessage("Your report has been submitted successfully!");
        setReportText("");
        setTimeout(() => setShowReportModal(false), 2000);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error submitting report. Please try again.");
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCloseExpiredModal = () => setShowExpiredModal(false);
  const handleCloseIncompleteProfileModal = () => {
    setShowIncompleteProfileModal(false);
    navigate("/profile");
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportSuccessMessage("");
    setReportText("");
  };

  const handleClickSeller = () =>{
    navigate("/sellerPage", { state: { sellerInfor } });
  }

  const handleChat = async () =>{
    try {
      setTimeout(()=>{
        navigate("/customer", { state: { ticket, currentLayout: "chat"} })
      },2000)
      
    } catch (error) {
      console.error("Lỗi chat rồi");
    }
   
  }
  return (
    <section className={cx("py-5")}>
      <Container>
        <ToastContainer/>
        <Row className={cx("gx-5")}>
          <Col lg={6}>
          <Row>
            <div className={cx("rounded-4", "mb-3", "d-flex", "justify-content-center")}>
              <img
                style={{ maxWidth: "100%", maxHeight: "100vh", margin: "auto" }}
                className={cx("rounded-4", "fit")}
                src={mainImage}
                alt="Product"
              />
            </div>
            <div className={cx("d-flex", "justify-content-center", "mb-3")}>
              {series.map((img, index) => (
                <a key={index} onClick={() => handleImageClick(img)} className={cx("border", "mx-1", "rounded-2")} style={{ cursor: "pointer" }}>
                  <img width="60" height="60" className={cx("rounded-2")} src={img} alt={`Image ${index + 1}`} />
                </a>
              ))}
            </div>
            </Row>
            <Row style={{marginTop : "40px"}}>
                <div onClick={handleClickSeller} style={{cursor : "pointer"}}>
                <SellerInformation seller={sellerInfor}/>
                </div>
            </Row>
          </Col>

          <Col lg={6}>
          <div className={cx("ps-lg-3")}>
              <div className={cx("d-flex", "justify-content-between", "align-items-center")}>
                <h4 className={cx("title", "text-dark")}>{decodedEventTitle}</h4>
                {user ? (
                  <Button variant="danger" onClick={handleReportProduct} className={cx("btn-report")}>
                    Report Product
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    Report Product (Login Required)
                  </Button>
                )}
              </div>

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
                <dt className={cx("col-3")}>Date <MdOutlineDateRange />:</dt>
                <dd className={cx("col-9")}>{ticket.eventDate}</dd>
                <dt className={cx("col-3")}>Location <IoLocationSharp />:</dt>
                <dd className={cx("col-9")}>{ticket.location}</dd>
                <dt className={cx("col-3")}>Price <IoPricetagsSharp />:</dt>
                <dd className={cx("col-9")}>{ticket.price.toLocaleString("vi-VN")} VND</dd>
                <dt className={cx("col-3")}>Quantity:</dt>
                <dd className={cx("col-9")}>{ticket.quantity}</dd>
              </dl>

              <hr />

              {/* Enlarged Quantity Input Above Buttons */}
              <Row className={cx("mb-4", "d-flex", "justify-content-center")}>
                <Col xs={6}>
                  <InputGroup size="lg" className={cx("mb-3")}>
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange(-1)}>-</Button>
                    <Form.Control className={cx("text-center")} value={quantity} readOnly />
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange(1)}>+</Button>
                  </InputGroup>
                </Col>
              </Row>

              {/* Buy and Chat Buttons Side by Side */}
              <Row className={cx("mb-4", "d-flex", "justify-content-center")}>
                <Col xs={5} className={cx("d-flex", "justify-content-end")}>
                  <Button
                    onClick={handleBuy}
                    className={cx("btn", "btn-lg", "px-4", "w-auto")}
                    style={{ backgroundColor: "#dc3545", color: "white" }}>
                    Buy
                  </Button>
                </Col>

                <Col xs={5} className={cx("d-flex", "justify-content-start")}>
                  <Button
                    onClick={handleChat}
                    className={cx("btn", "btn-lg", "px-4", "w-auto")}
                    style={{ backgroundColor: "#17a2b8", color: "white" }}>
                    <LuMessagesSquare className="me-1" /> Chat
                  </Button>
                </Col>
              </Row>


              {/* Modals for different scenarios */}
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Quantity Exceeded</Modal.Title>
                </Modal.Header>
                <Modal.Body>Quantity selected exceeds available tickets!</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showExpiredModal} onHide={handleCloseExpiredModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Expired Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>This ticket is expired.</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseExpiredModal}>Close</Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showIncompleteProfileModal} onHide={handleCloseIncompleteProfileModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Profile Incomplete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your profile is incomplete. Please complete your profile to purchase tickets.</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseIncompleteProfileModal}>Go to Profile</Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showReportModal} onHide={handleCloseReportModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Report Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formReportReason">
                      <Form.Label>Reason for reporting:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        placeholder="Describe the reason for your report here..."
                      />
                    </Form.Group>
                  </Form>
                  {reportSuccessMessage && <div className={cx("text-success")}>{reportSuccessMessage}</div>}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseReportModal}>Close</Button>
                  <Button variant="primary" onClick={handleReportSubmit}>Submit Report</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TicketDetail;
