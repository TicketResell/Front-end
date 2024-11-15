import React, { useState, useEffect } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import classNames from "classnames/bind";
import styles from "./OrdersList.module.scss";
import Pagination from "../Pagination";
import { Button, Modal, Form, Image } from "react-bootstrap";
import api from "../../../config/axios";
import { ImStarFull, ImStarEmpty, ImGift } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { ToastContainer, toast, Bounce } from "react-toastify";

function OrdersList({ listOrders = [], isOrderBuyer , onRefresh }) {
  console.log("Order List",listOrders);
  const cx = classNames.bind(styles);
  const [orderPage, setOrderPage] = useState(0);
  const itemsPerPage = 8;
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
        onRefresh();
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
        onRefresh(); 
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
    console.log("REQUEST CODE:" + orderChosen.buyerId + " " + currentUser.id + " " + starRate + " " + ratingText)
    try {
      const response = await api.post("/ratings", {
        buyerId: orderChosen.buyerId,
        orderId: orderChosen.id,
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
            {!isOrderBuyer && <th scope="col" className={cx("custom-title")}>
              Service Fee
            </th>}
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
              Order Date
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
                <td>{order.totalAmount.toLocaleString("vi-VN")}</td>
                {!isOrderBuyer &&  <td>{(order.serviceFee*order.totalAmount).toLocaleString("vi-VN")}</td>}
                <td>{order.paymentStatus}</td>
                <td>{order.orderStatus}</td>
                <td>{order.orderMethod}</td>
                <td>{order.createdDate}</td>
                <td>
                  {isOrderBuyer ? (
                    <div style={{display : "flex", alignItems : "center" , justifyContent : "space-between"}}>
                      <Button
                        className={cx("btn-complaints")}
                        variant="outline-danger"
                        onClick={() => handleReportClick(order)}
                      >
                        Report
                      </Button>
                      {orderStatuses[order.id] === "received" ? (                      
                        <Button
                        className={cx("btn-response")}
                        variant="outline-success"
                        onClick={() => handleReceived(order.id)}
                      >
                          Confirm Completed
                      </Button>) : orderStatuses[order.id] === "pending" ? ( 
                        <Image src="https://i.ibb.co/LQZTQ4B/Animation-1731417311297.gif" height={30}/>
                      ) : orderStatuses[order.id] === "shipping" ? ( 
                        <Image src="https://i.ibb.co/nr0rNrn/360-F-227739395-Bhszne-Mcufc-Ae9-DJEBTHFFx-VJM1-PR8-RT.jpg" height={30}/>
                      ) :(
                        <FaCheckCircle size={30} color="#198754"/>
                      )}

                      <Button
                        className={cx("btn-response")}
                        variant="outline-primary"
                        onClick={() => handleRatingClick(order)}
                      >
                        Rating
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className={cx("btn-response")}
                      onClick={() => handleShipped(order.id)}
                      disabled={order.orderStatus !== "pending" ? true : false}
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
              <div className={cx("notification-container")}>
            <span className={cx("notification-icon")}>
              <IoWarning />
            </span>
            <h2>You haven't bought any tickets yet</h2>
          </div>
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