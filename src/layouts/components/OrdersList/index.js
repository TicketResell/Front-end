import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import classNames from "classnames/bind";
import styles from "./OrdersToday.module.scss";
import Pagination from "../Pagination";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../../../config/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";

function OrdersList({ listOrders = [], isOrderBuyer }) {
  const cx = classNames.bind(styles);
  const [orderPage, setOrderPage] = useState(0);
  const itemsPerPage = 10;
  const offset = orderPage * itemsPerPage;
  const currentOrders = listOrders.slice(offset, offset + itemsPerPage);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [orderChosen, setOrderChosen] = useState(null); 
  console.log("listOrders",listOrders);
  useEffect(() => {
    const initialStatuses = {};
    listOrders.forEach(order => {
      initialStatuses[order.id] = order.orderStatus;
    });
    setOrderStatuses(initialStatuses);
  }, [listOrders]);

  const fetchUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    console.log("userData",userData);
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
      const response = await api.put(`/orders/update-order-status/${id}`, { order_status: "shipping" });
      if (response.status === 200) {
        toast.success("Order marked as shipped.", { transition: Bounce });
      }
    } catch (error) {
      toast.error("Error updating order status to shipped.");
    }
  };

  const handleReceived = async (id) => {
    try {
      const response = await api.put(`/orders/update-order-status/${id}`, { order_status: "completed" });
      if (response.status === 200) {
        toast.success("Order marked as completed.", { transition: Bounce });
        setOrderStatuses(prev => ({ ...prev, [id]: "completed" }));
      }
    } catch (error) {
      toast.error("Error updating order status to completed.");
    }
  };

  const handleReportClick = (order) => {
    setOrderChosen(order); 
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/ratings/create-report",
        {
          reportedUserId: orderChosen?.sellerId, // Using ticket from state
          reporterUserId: currentUser.id,
          productId: orderChosen?.id,
          reason: reportText,
          status: "pending",
          reportDate: new Date().toISOString(),
        }
      );

      if (response.status === 200) {
        toast.success("Report submitted successfully.");
        setReportText("");
        setShowReportModal(false);
      }
    } catch (error) {
      toast.error("Error submitting report.");
    }
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
            <th scope="col" className={cx("custom-title")}>ID</th>
            <th scope="col" className={cx("custom-title")}>{isOrderBuyer ? "Seller Name" : "Buyer Name"}</th>
            <th scope="col" className={cx("custom-title")}>Ticket Name</th>
            <th scope="col" className={cx("custom-title")}>Quantity</th>
            <th scope="col" className={cx("custom-title")}>Total Amount</th>
            <th scope="col" className={cx("custom-title")}>Service Fee</th>
            <th scope="col" className={cx("custom-title")}>Payment Status</th>
            <th scope="col" className={cx("custom-title")}>Order Status</th>
            <th scope="col" className={cx("custom-title")}>Order Method</th>
            <th scope="col" className={cx("custom-title")}>Action</th>
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
                        {orderStatuses[order.id] === "completed" ? "Completed" : "Confirm Received"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      className={cx("btn-response")}

                      onClick={() => handleShipped(order.id)}
                     disabled = {order.orderMethod === "COD" ? true :false}
                    >
                      Confirm Shipped
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No orders found</td>
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
            <Form.Group controlId="reportText">
              <Form.Label>Reason for Reporting</Form.Label>
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
    </div>
  );
}

export default OrdersList;