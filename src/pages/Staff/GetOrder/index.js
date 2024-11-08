import { useState, useEffect } from "react";
import api from "../../../config/axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.scss";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});

  // Modal states for Payment Status and Order Status
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // For Payment Modal
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  
  // For Order Modal
  const [newOrderStatus, setNewOrderStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/staff/get-all-orders");
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error("Fetch Orders Error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/update-order-status/${orderId}`, {
        order_status: status,
      });
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error.response ? error.response.data : error.message);
    }
  };

  const handleStatusChange = (orderId, status) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [orderId]: status,
    }));
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
              <td>
                <Form.Control
                  as="select"
                  value={selectedStatus[order.id] || order.orderStatus}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Control>
              </td>
              <td>{order.orderMethod}</td>
              <td>
                <Button
                  onClick={() => updateOrderStatus(order.id, selectedStatus[order.id] || order.orderStatus)}
                >
                  Update Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
