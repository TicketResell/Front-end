import { useState, useEffect } from "react";
import api from "../../../config/axios";
import { Modal, Button, Form } from "react-bootstrap";
import Pagination from "../../../layouts/components/Pagination";
import { FaBan } from "react-icons/fa";
import "./index.scss";
import { MDBBadge } from "mdb-react-ui-kit";
function OrderList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [orderPage, setOrderPage] = useState(0);
  const itemsPerPage = 12;
  const offset = orderPage * itemsPerPage;
  const currentOrders = orders.slice(offset, offset + itemsPerPage);

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
      console.log("Response",response.data);
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
            <th>Buyer Name </th>
            <th>Seller Name</th>
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
          {currentOrders.map((order,index) => (
            <tr key={order.id}>
              <td>{offset + index + 1}</td>
              <td>{order.buyerName}</td>
              <td>{order.sellerName}</td>
              <td>{order.ticketName}</td>
              <td>{order.quantity}</td>
              <td>{order.totalAmount}</td>
              <td>{order.serviceFee}</td>
              <td><MDBBadge
                      color={
                        order.paymentStatus === "paid"
                          ? "warning"
                          : "success"}
                      pill
                    >
                      {order.paymentStatus}
                    </MDBBadge></td>
              <td>
              <MDBBadge
                      color={
                        order.orderStatus === "pending"
                          ? "warning"
                          : order.orderStatus === "shipping"
                          ? "dark"
                          : order.orderStatus === "received"
                          ? "primary"
                          : order.orderStatus === "canceled"
                          ? "danger"
                          : "success"
                      }
                      pill
                    >
                      {order.orderStatus}
                    </MDBBadge>
              </td>
              <td>{order.orderMethod}</td>
              <td>
                {order.orderStatus === "received" ?<Button onClick={() => updateOrderStatus(order.id, selectedStatus[order.id] || order.orderStatus)}>
                  Update Status
                </Button> : <FaBan size={30}/>}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
          currentPage={orderPage}
          pageCount={Math.ceil(orders.length / itemsPerPage)}
          onPageChange={(selectedPage) => setOrderPage(selectedPage)}
        />
    </div>
  );
}

export default OrderList;
