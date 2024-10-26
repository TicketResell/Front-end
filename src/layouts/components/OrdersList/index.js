import React, { useState, useEffect } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import classNames from "classnames/bind";
import styles from "./OrdersToday.module.scss";
import Pagination from "../Pagination";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../../../config/axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useLocation } from "react-router-dom";


function OrdersList({ listOrders = [], isOrderBuyer, user}) {
  const cx = classNames.bind(styles);
  const location = useLocation(); // Use useLocation to get location state
  const ticketFromLocation = location.state?.ticket;

  console.log("List in Orders", listOrders);
  const [orderPage, setOrderPage] = useState(0);
  const itemsPerPage = 10;
  const offset = orderPage * itemsPerPage;
  const currentOrders = listOrders.slice(offset, offset + itemsPerPage);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [ticket, setTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Renamed state variable


  useEffect(() => {
    const initialStatuses = {};
    listOrders.forEach(order => {
      initialStatuses[order.id] = order.orderStatus;
    });
    setOrderStatuses(initialStatuses);
  }, [listOrders]);

  const fetchUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    if (userData) {
      setCurrentUser(JSON.parse(userData)); // Updated to use currentUser
    }
    return userToken;
  };

  const handleShipped = async (id) => {
    const response = await api.put(`/orders/update-order-status/${id}`, { order_status: "shipping" });
    console.log("Response Shipping", response.data);
    if (response.status === 200) {
      toast.success('Response is sent', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleReceived = async (id) => {
    try {
      const response = await api.put(`/orders/update-order-status/${id}`, { order_status: "completed" });
      console.log("Response Received", response.data);
      if (response.status === 200) {
        toast.success('Order status updated to received', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setOrderStatuses(prevStatuses => ({
          ...prevStatuses,
          [id]: "completed"
        }));
      }
    } catch (error) {
      toast.error('Failed to update order status', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Error updating order status", error);
    }
  };

  const handleReportClick = (order) => {
    setTicket(order);
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const userToken = fetchUserFromLocalStorage();
    try {
      const response = await api.post(`/ratings/create-report`, {
        reportedUserId: ticket.sellerID,
        reporterUserId: currentUser.id, // Updated to use currentUser
        productId: ticket.id,
        reason: reportText,
        status: 'pending',
        reportDate: new Date().toISOString()
      });
      if (response.status === 200) {
        toast.success("Report submitted successfully!");
        setReportText("");
        setTimeout(() => setShowReportModal(false), 2000);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error submitting report. Please try again.");
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row">
        <h1>{isOrderBuyer ? "Your purchase order" : "Your sales order"}</h1>
      </div>
      <MDBTable>
        <MDBTableHead>
          <tr>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>ID</th>
            {isOrderBuyer ? (
              <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Seller Name</th>
            ) : (
              <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Buyer Name</th>
            )}
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Ticket Name</th>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Quantity</th>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Total Amount</th>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Service Fee</th>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Payment Status</th>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Order Status</th>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Order Method</th>
            <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }} className={cx(".custom-title")}>Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {listOrders && listOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{offset + index + 1}</td>
                {isOrderBuyer ? <td>{order.sellerName}</td> : <td>{order.buyerName}</td>}
                <td>{order.ticketName}</td>
                <td>{order.quantity}</td>
                <td>{order.totalAmount}</td>
                <td>{order.serviceFee}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.orderStatus}</td>
                <td>{order.orderMethod}</td>
                {isOrderBuyer ? (
                  <td>
                    <Button className={cx("btn-complaints")} variant="outline-danger" onClick={() => handleReportClick(order)}>
                      Report
                    </Button>
                    <Button className={cx("btn-response")}
                      variant={order.orderMethod === "COD" ? "outline-dark" : "outline-success"}
                      onClick={() => handleReceived(order.id)}>
                      {orderStatuses[order.id] === "completed" ? "Completed" : "Confirmed received"}
                    </Button>
                  </td>
                ) : (
                  <td>
                    <Button className={cx("btn-response")} onClick={() => handleShipped(order.id)}>
                      Confirm Shipped
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No orders found</td>
            </tr>
          )}
          <Pagination
            currentPage={orderPage}
            pageCount={Math.ceil(listOrders.length / itemsPerPage)}
            onPageChange={(selectedPage) => setOrderPage(selectedPage)}
          />
        </MDBTableBody>
      </MDBTable>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReportSubmit}>
            <Form.Group controlId="reportReason">
              <Form.Label>Reason</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your reason for reporting" 
                value={reportText} 
                onChange={(e) => setReportText(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default OrdersList;
