import { Row, Col, Table } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffOverview.module.scss";
import SmallerCard from "./SmallCard";
import RevenueChart from "./RevenueChart";
import SalesStatistics from "./SalesStatistics";
import { useEffect, useState } from "react";
import axios from "axios";

const cx = classNames.bind(styles);

const Admin = () => {
  // State for revenue, sales data, user, and order totals
  const [revenue, setRevenue] = useState(null);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    timeframe: "Tháng 9",
  });
  const [totalUser, setTotalUser] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [accounts, setAccounts] = useState([]); // State for account data
  const [orders, setOrders] = useState([]); // State for order data
  const [error, setError] = useState("");
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbl91c2VyIiwicm9sZSI6ImFkbWluIiwidXNlcl9pbWFnZSI6Imh0dHBzOi8vdGguYmluZy5jb20vdGgvaWQvT0lQLm5NSXItbkI1djByYlB6V0VKemVaY1FIYUU3P3c9MjY0Jmg9MTgwJmM9NyZyPTAmbz01JmRwcj0xLjEmcGlkPTEuNyIsImlkIjozLCJmdWxsbmFtZSI6IkFETUlOIiwiZXhwIjoxNzMwMzQ0NDkwLCJpYXQiOjE3Mjk3Mzk2OTAsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20ifQ.Vh4bfaSoXjHbz0T6FeDQ4YNxKz7twxusM7bl60w_aec"; // Replace with your actual token

  // Fetch data from APIs
  const fetchRevenueAndSalesData = async () => {
    try {
      const revenueResponse = await axios.get("http://localhost:8084/api/staff/get-total-revenue-profit", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRevenue({
        money: revenueResponse.data.revenue.toFixed(2),
        percent: revenueResponse.data.profit * 100,
        status: revenueResponse.data.profit >= 0 ? "up" : "down",
      });

      setSalesData((prevState) => ({
        ...prevState,
        totalSales: 3200, // Update total sales with real data if needed
      }));

      const userResponse = await axios.get("http://localhost:8084/api/staff/get-number-of-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalUser(userResponse.data);

      const ordersResponse = await axios.get("http://localhost:8084/api/admin/count-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalOrders(ordersResponse.data);

      // Fetch accounts
      const accountsResponse = await axios.get("http://localhost:8084/api/admin/view-accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAccounts(accountsResponse.data); // Set account data

      // Fetch orders
      const ordersResponseData = await axios.get("http://localhost:8084/api/admin/all-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(ordersResponseData.data); // Set order data

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Could not fetch data.");
    }
  };

  useEffect(() => {
    fetchRevenueAndSalesData();
  }, []);

  if (!revenue) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row className={cx("rowHalfAbove")}>
        <Col xs={6}>
          <Row>
            <SmallerCard
              types={{
                name: "Revenue",
                number: `$${revenue.money}`,
                percent: revenue.percent.toFixed(2),
                status: revenue.status,
              }}
            />
          </Row>
          <Row>
            <SmallerCard
              types={{
                name: "Sales",
                number: salesData.totalSales,
                percent: 10,
                status: "up",
              }}
            />
          </Row>
        </Col>
        <Col xs={6}>
          <Row>
            <SmallerCard
              types={{
                name: "Total Users",
                number: totalUser,
                percent: 5,
                status: "up",
              }}
            />
          </Row>
          <Row>
            <SmallerCard
              types={{
                name: "Total Orders",
                number: totalOrders,
                percent: 8,
                status: "up",
              }}
            />
          </Row>
        </Col>
      </Row>

      {/* View Accounts Table */}
      <h2>View Accounts</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Full Name</th>
            <th>User Image</th>
            <th>Status</th>
            <th>Verified Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.username}</td>
              <td>{account.email}</td>
              <td>{account.phone}</td>
              <td>{account.address}</td>
              <td>{account.fullname}</td>
              <td>
                <img src={account.userImage} alt={account.fullname} style={{ width: "50px", height: "50px" }} />
              </td>
              <td>{account.status}</td>
              <td>{account.verifiedEmail ? "Yes" : "No"}</td>
              <td>{account.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* View All Orders Table */}
      <h2>View All Orders</h2>
      <Table striped bordered hover>
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
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
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
      </Table>
    </>
  );
}

export default Admin;
