import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import classNames from "classnames/bind";
import styles from "./OrdersToday.module.scss";
import Pagination from "../Pagination";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../../../config/axios";
import { ImStarFull, ImStarEmpty } from "react-icons/im";
import { ToastContainer, toast, Bounce } from "react-toastify";

function OrdersList({ listOrders = [], isOrderBuyer }) {
  const cx = classNames.bind(styles);
  const [orderPage, setOrderPage] = useState(0);
  const itemsPerPage = 10;
  const offset = orderPage * itemsPerPage;
  const numberStar = 5;
  const currentOrders = listOrders.slice(offset, offset + itemsPerPage);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [starRate, setStarRate] = useState(1);
  const [reportText, setReportText] = useState("");
  const [ratingText, setRatingText] = useState("");
  const [hoverStarRate, setHoverStarRate] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [orderChosen, setOrderChosen] = useState(null);
  
  useEffect(() => {
    const initialStatuses = {};
    listOrders.forEach((order) => {
      initialStatuses[order.id] = order.orderStatus;
    });
    setOrderStatuses(initialStatuses);
  }, [listOrders]);

  const fetchUserFromLocalStorage = () => {
    const userData = localStorage.getItem("user");
    console.log("userData", userData);
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    fetchUserFromLocalStorage();
  }, []);

  const handleShipped = async (id) => {
    try {
      const response = await api.put(`/orders/update-order-status/${id}`, {
        order_status: "shipping",
      });
      if (response.status === 200) {
        toast.success("Order marked as shipped.", { transition: Bounce });
      }
    } catch (error) {
      toast.error("Error updating order status to shipped.");
    }
  };

  const handleReceived = async (id) => {
    try {
      const response = await api.put(`/orders/update-order-status/${id}`, {
        order_status: "completed",
      });
      if (response.status === 200) {
        toast.success("Order marked as completed.", { transition: Bounce });
        setOrderStatuses((prev) => ({ ...prev, [id]: "completed" }));
      }
    } catch (error) {
      toast.error("Error updating order status to completed.");
    }
  };

  const handleReportClick = (order) => {
    setOrderChosen(order);
    setShowReportModal(true);
  };

  const handleRatingClick = (order) => {
    setOrderChosen(order);
    setShowRatingModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/ratings/create-report", {
        reportedUserId: orderChosen?.sellerId, // Using ticket from state
        reporterUserId: currentUser.id,
        productId: orderChosen?.id,
        reason: reportText,
        status: "pending",
        reportDate: new Date().toISOString(),
      });

      if (response.status === 200) {
        toast.success("Report submitted successfully.");
        setReportText("");
        setShowReportModal(false);
      }
    } catch (error) {
      toast.error("Error submitting report.");
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/ratings", {
        buyerId: orderChosen.buyerId,
        orderId: currentUser.id,
        ratingScore: starRate,
        feedback: ratingText,
      });

      if (response.status === 200) {
        toast.success("Rating submitted successfully.");
        setRatingText("");
        setShowRatingModal(false);
      }
    } catch (error) {
      toast.error("Error submitting rating.");
    }
  };


  const renderStars = () => {
    return (
      <>
      <div>
      {Array.from({ length: numberStar }, (_, index) => (
      <span
        key={index}
        onClick={() => setStarRate(index + 1)}
        onMouseEnter={() => setHoverStarRate(index + 1)}
        onMouseLeave={() => setHoverStarRate(0)}
        style={{ cursor: "pointer", marginRight: "4px" }}
      >
        {index < (hoverStarRate || starRate) ? (
          <ImStarFull color="#feda1b" size={50} />
        ) : (
          <ImStarEmpty  color="#feda1b" size={50}/>
        )}
      </span>
    ))}
    </div> 
    </>
  );
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row">
        <h1>{isOrderBuyer ? "Your Purchase Orders" : "Your Sales Orders"}</h1>
      </div>
      <MDBTable>
        <MDBTableHead>
          <tr>
            <th scope="col" className={cx("custom-title")}>
              ID
            </th>
            <th scope="col" className={cx("custom-title")}>
              {isOrderBuyer ? "Seller Name" : "Buyer Name"}
            </th>
            <th scope="col" className={cx("custom-title")}>
              Ticket Name
            </th>
            <th scope="col" className={cx("custom-title")}>
              Quantity
            </th>
            <th scope="col" className={cx("custom-title")}>
              Total Amount
            </th>
            <th scope="col" className={cx("custom-title")}>
              Service Fee
            </th>
            <th scope="col" className={cx("custom-title")}>
              Payment Status
            </th>
            <th scope="col" className={cx("custom-title")}>
              Order Status
            </th>
            <th scope="col" className={cx("custom-title")}>
              Order Method
            </th>
            <th scope="col" className={cx("custom-title")}>
              Action
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {listOrders && listOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{offset + index + 1}</td>
                <td>{isOrderBuyer ? order.sellerName : order.buyerName}</td>
                <td>{order.ticketName}</td>
                <td>{order.quantity}</td>
                <td>{order.totalAmount}</td>
                <td>{order.serviceFee}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.orderStatus}</td>
                <td>{order.orderMethod}</td>
                <td>
                  {isOrderBuyer ? (
                    <>
                      <Button
                        className={cx("btn-complaints")}
                        variant="outline-danger"
                        onClick={() => handleReportClick(order)}
                      >
                        Report
                      </Button>
                      <Button
                        className={cx("btn-response")}
                        variant="outline-success"
                        onClick={() => handleReceived(order.id)}
                      >
                        {orderStatuses[order.id] === "completed"
                          ? "Completed"
                          : "Confirm Received"}
                      </Button>
                      <Button
                        className={cx("btn-response")}
                        variant="outline-primary"
                        onClick={() => handleRatingClick(order)}
                      >
                        Rating
                      </Button>
                    </>
                  ) : (
                    <Button
                      className={cx("btn-response")}
                      onClick={() => handleShipped(order)}
                      disabled={order.orderMethod === "COD" ? true : false}
                    >
                      Confirm Shipped
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" > 
                <h1 style={{color:"#dc3545"}}>No orders found</h1>
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
      <Pagination
        currentPage={orderPage}
        pageCount={Math.ceil(listOrders.length / itemsPerPage)}
        onPageChange={(selectedPage) => setOrderPage(selectedPage)}
      />

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReportSubmit}>
            <Form.Group controlId="ratingText">
              <Form.Label>Reason for Report</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Explain the issue with this order..."
              />
            </Form.Group>
            <Button type="submit" variant="danger" className="mt-3">
              Submit Report
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/*Modal Rating*/}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rating Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRatingSubmit}>
            <Form.Group controlId="reportText">
              <Form.Group controlId="ratingStars">
                <Form.Label>Rate this seller</Form.Label>
                <div style={{ display: "flex", justifyContent: "center" }}>{renderStars()}</div> {/* Hệ thống sao đánh giá */}
              </Form.Group>
              <Form.Label>Reason for Rating</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={ratingText}
                onChange={(e) => setRatingText(e.target.value)}
                placeholder="Rate this seller.."
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              Submit Rating
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default OrdersList;
