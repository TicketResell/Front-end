import { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss"; 

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lX3NlbGxlciIsInJvbGUiOiJzdGFmZiIsInVzZXJfaW1hZ2UiOiJodHRwczovL2kuaWJiLmNvL3NnYlMyR0IvdC1pLXh1LW5nLmpwZyIsImlkIjoyLCJmdWxsbmFtZSI6IkphbmVDYXB0aWFuIiwiZXhwIjoxNzMwMjEwODI4LCJpYXQiOjE3Mjk2MDYwMjgsImVtYWlsIjoiamFuZUBleGFtcGxlLmNvbSJ9.hmT-f2hkQQdoJsAmqGvNg1lhA8IIZlUT8U680o7eU3Q"; // Token của staff bạn cần thêm vào request

    try {
      const response = await axios.get("http://localhost:8084/api/staff/get-all-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data); 
    } catch (err) {
      setError("Error fetching orders.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
