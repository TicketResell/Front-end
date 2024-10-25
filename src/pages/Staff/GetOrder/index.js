import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.scss"; 

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  
  // Modal states for Payment Status and Order Status
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // For Payment Modal
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  
  // For Order Modal
  const [newOrderStatus, setNewOrderStatus] = useState("");

  // Fetch orders from API
  const fetchOrders = async () => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lX3NlbGxlciIsInJvbGUiOiJzdGFmZiIsInVzZXJfaW1hZ2UiOiJodHRwczovL2kuaWJiLmNvL3NnYlMyR0IvdC1pLXh1LW5nLmpwZyIsImlkIjoyLCJmdWxsbmFtZSI6IkphbmVDYXB0aWFuIiwiZXhwIjoxNzMwMjEwODI4LCJpYXQiOjE3Mjk2MDYwMjgsImVtYWlsIjoiamFuZUBleGFtcGxlLmNvbSJ9.hmT-f2hkQQdoJsAmqGvNg1lhA8IIZlUT8U680o7eU3Q"; // Replace with actual token

    try {
      const response = await axios.get("http://localhost:8084/api/staff/get-all-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error("Fetch Orders Error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open Payment Modal
  const handleOpenPaymentModal = (order) => {
    setSelectedOrder(order);
    setNewPaymentStatus(order.paymentStatus); // Set initial payment status
    setShowPaymentModal(true);
  };

  // Open Order Modal
  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus); // Set initial order status
    setShowOrderModal(true);
  };

  // Close Payment Modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  // Close Order Modal
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // Update Payment Status
  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder) return;

    try {
      await axios.put(`http://localhost:8084/api/orders/update-payment-status/${selectedOrder.id}`, {
        paymentStatus: newPaymentStatus,
        vnpResponseCode: "", // Optional, based on API requirements
        vnpTransactionInfo: "" // Optional, based on API requirements
      });

      fetchOrders();
      handleClosePaymentModal();
    } catch (err) {
      setError("Error updating payment status.");
      console.error("Update Payment Status Error:", err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      await axios.put(`http://localhost:8084/api/orders/update-order-status/${selectedOrder.id}`, {
        orderStatus: newOrderStatus
      });

      fetchOrders();
      handleCloseOrderModal();
    } catch (err) {
      setError("Error updating order status.");
      console.error("Update Order Status Error:", err);
    }
  };

  return (
    <div className="order-list-container">
      <h1>Order List</h1>
      {error && <p>{error}</p>}
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer ID</th>
            <th>Seller ID</th>
            <th>Ticket ID</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Service Fee</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Order Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.buyerId}</td>
              <td>{order.sellerId}</td>
              <td>{order.ticketId}</td>
              <td>{order.quantity}</td>
              <td>{order.totalAmount}</td>
              <td>{order.serviceFee}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.orderStatus}</td>
              <td>{order.orderMethod}</td>
              <td>
                <Button onClick={() => handleOpenPaymentModal(order)}>Update Payment</Button>
                <Button onClick={() => handleOpenOrderModal(order)}>Update Order</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for updating payment status */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="paymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentModal}>Close</Button>
          <Button variant="primary" onClick={handleUpdatePaymentStatus}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for updating order status */}
      <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="orderStatus">
              <Form.Label>Order Status</Form.Label>
              <Form.Control
                as="select"
                value={newOrderStatus}
                onChange={(e) => setNewOrderStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOrderModal}>Close</Button>
          <Button variant="primary" onClick={handleUpdateOrderStatus}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrderList;
