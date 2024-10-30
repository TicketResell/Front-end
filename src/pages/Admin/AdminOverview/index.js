import { Row, Col, Table, Button, Form } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./AdminOverview.module.scss";
import SmallerCard from "./SmallCard";
import RevenueChart from "./RevenueChart";
import SalesStatistics from "./SalesStatistics";
import { useEffect, useState } from "react";
import axios from "axios";

const cx = classNames.bind(styles);

const Admin = () => {
  const [revenue, setRevenue] = useState(null);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    timeframe: "Tháng 9",
  });
  const [totalUser, setTotalUser] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [transactions, setTransactions] = useState([]);

  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbl91c2VyIiwicm9sZSI6ImFkbWluIiwidXNlcl9pbWFnZSI6Imh0dHBzOi8vdGguYmluZy5jb20vdGgvaWQvT0lQLm5NSXItbkI1djByYlB6V0VKemVaY1FIYUU3P3c9MjY0Jmg9MTgwJmM9NyZyPTAmbz01JmRwcj0xLjEmcGlkPTEuNyIsImlkIjozLCJmdWxsbmFtZSI6IkFETUlOIiwiZXhwIjoxNzMwNzM1NTQ4LCJpYXQiOjE3MzAxMzA3NDgsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20ifQ.7WhmJq4MJvZ5MbhogwDMxkotftPHGTxYII9l65LVfuM";

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

      const transactionsResponse = await axios.get("http://localhost:8084/api/admin/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(transactionsResponse.data);

      const accountsResponse = await axios.get("http://localhost:8084/api/admin/view-accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(accountsResponse.data);



      const ordersResponseData = await axios.get("http://localhost:8084/api/admin/all-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(ordersResponseData.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Could not fetch data.");
    }
  };

  useEffect(() => {
    fetchRevenueAndSalesData();
  }, []);

  // Function to update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`http://localhost:8084/api/orders/update-order-status/${orderId}`, {
        order_status: status, // Sending the selected status
      });

      // Handle success response
      await fetchOrders();
      // Optionally refresh the orders or show a success message here
    } catch (error) {
      // Handle error response
      console.error('Error updating order status:', error.response ? error.response.data : error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8084/api/admin/all-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data); // Assuming response.data contains the orders array
    } catch (error) {
      console.error('Error fetching orders:', error.response ? error.response.data : error.message);
    }
  };


  const completedOrdersCount = orders.filter(order => order.orderStatus === 'completed').length;
  const cancelOrdersCount = orders.filter(order => order.orderStatus === 'cancelled').length;
  const shipOrdersCount = orders.filter(order => order.orderStatus === 'shipping').length;
  const activeUsersCount = accounts.filter(account => account.status === 'active').length;
  const banUsersCount = accounts.filter(account => account.status === 'banned').length;
  const paidOrdersCount = orders.filter(order => order.paymentStatus === 'paid').length;
  const pendingOrdersCount = orders.filter(order => order.paymentStatus === 'pending').length;

  const handleStatusChange = (orderId, status) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: status }));
  };


  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState({});

  const handlePaymentStatusChange = (orderId, status) => {
    setSelectedPaymentStatus(prev => ({ ...prev, [orderId]: status }));
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    if (!paymentStatus) return;

    try {
      const response = await fetch(`http://localhost:8084/api/orders/update-payment-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: paymentStatus,
          vnpResponseCode: "",
          vnpTransactionNo: "",
        }),
      });

      if (response.ok) {
        fetchOrders(); // Call fetchOrders to reload the order list
      } else {
        alert("Failed to update payment status.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };


  const handlePromote = async (id, currentRole) => {
    try {
      let newRole;

      // Xác định vai trò mới dựa trên vai trò hiện tại
      if (currentRole === "user") {
        newRole = "staff"; // Nâng cấp từ user lên staff
      } else if (currentRole === "staff") {
        newRole = "admin"; // Nâng cấp từ staff lên admin
      } else {
        alert(`Account with role '${currentRole}' cannot be promoted.`);
        return; // Nếu không phải user hoặc staff, không thực hiện nâng cấp
      }

      // Đối tượng JSON chứa role mới cần gửi
      const payload = {
        role: newRole, // Vai trò mới
      };

      // Gọi API với id trong đường dẫn và payload trong thân yêu cầu
      const response = await axios.put(`http://localhost:8084/api/admin/promote/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Đảm bảo Content-Type là application/json
        },
      });

      // Gọi lại hàm fetchAccounts để lấy dữ liệu mới
      await fetchAccounts(); // Cập nhật danh sách tài khoản

    } catch (error) {
      console.error("Failed to promote account:", error);
      setError("Failed to promote account."); // Thông báo lỗi
    }
  };


  // Hàm fetchAccounts vẫn giữ nguyên
  const fetchAccounts = async () => {
    try {
      const accountsResponse = await axios.get("http://localhost:8084/api/admin/view-accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(accountsResponse.data); // Cập nhật state với dữ liệu mới
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      setError("Failed to fetch accounts.");
    }
  };


  if (!revenue) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={cx("adminPage")}>


        {error && <div className="alert alert-danger">{error}</div>}
        <Row className={cx("rowHalfAbove", "justify-content-center")}>
          <Col md={5} className={cx("section1")}>
            <Row className={cx("sector1")}>
              <Col>
                <Row className={cx("revenue")}>
                  <SmallerCard
                    types={{
                      name: "Revenue",
                      number: `$${revenue.money}`,
                      percent: revenue.percent.toFixed(2),
                      status: revenue.status,
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
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
            </Row>
          </Col>
          <Col md={6} className={cx("section2")}>
            <Row className={cx("sector2")}>
              <Col>
                <Row className={cx("revenue")}>
                  <SmallerCard
                    types={{
                      name: "Total Users",
                      number: totalUser,
                      percent: 5,
                      status: "up",
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
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
          </Col>
        </Row>
        {/* ------------------------------------------------------------------------ */}
        <Row className={cx("rowHalfAbove", "justify-content-center")}>
          <Col md={3} className={cx("section3")}>
            <Row className={cx("sector3")}>
              <Col>
                <Row className={cx("revenue")}>
                  <SmallerCard
                    types={{
                      name: "Complete Orders",
                      number: `${completedOrdersCount}`, // Display the count of completed orders
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Cancel Orders",
                      number: `${cancelOrdersCount}`, // Display the count of completed orders
                    }}

                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Shipping Orders",
                      number: `${shipOrdersCount}`, // Display the count of completed orders
                    }}
                  />
                </Row>
                <button
                  style={{ backgroundColor: "white", color: "black", borderRadius: "20px solid", border: "white", marginTop: "10px" }}
                  className={cx("btn", "btn-primary")}
                  onClick={() => document.getElementById("order-table").scrollIntoView({ behavior: 'smooth' })}>
                  View More
                </button>
              </Col>
            </Row>
          </Col>
          <Col md={4} className={cx("section4")}>
            <Row className={cx("sector4")}>
              <Col>
                <Row className={cx("revenue")}>
                  <SmallerCard
                    types={{
                      name: "Active Users",
                      number: `${activeUsersCount}`, // Display the count of completed orders
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Ban Users",
                      number: `${banUsersCount}`, // Display the count of completed orders
                    }}

                  />
                </Row>
                <button
                  style={{ backgroundColor: "white", color: "black", borderRadius: "20px solid", border: "white", marginTop: "10px" }}
                  className={cx("btn", "btn-primary")}
                  onClick={() => document.getElementById("user-table").scrollIntoView({ behavior: 'smooth' })}>
                  View More
                </button>
              </Col>
            </Row>
          </Col>
          <Col md={4} className={cx("section5")}>
            <Row className={cx("sector5")}>
              <Col>
                <Row className={cx("revenue")}>
                  <SmallerCard
                    types={{
                      name: "Paid Orders",
                      number: `${paidOrdersCount}`, // Display the count of completed orders
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Cancel Order",
                      number: `${pendingOrdersCount}`, // Display the count of completed orders
                    }}

                  />
                </Row>
                <button
                  style={{ backgroundColor: "white", color: "black", borderRadius: "20px solid", border: "white", marginTop: "10px" }}
                  className={cx("btn", "btn-primary")}
                  onClick={() => document.getElementById("order-table").scrollIntoView({ behavior: 'smooth' })}>
                  View More
                </button>
              </Col>

            </Row>

          </Col>
        </Row>
        {/* ------------------------------------------------------------------------ */}


        <Col className={cx("user_table")}>
          <Row className={cx("user", "justify-content-center", "align-items-center")}>
            <Col>
              <div className={cx("table-container")}> {/* Sử dụng lớp CSS cho bảng */}
                <h2 id="user-table"></h2>
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
                      <th className="text-center">Status</th>
                      <th className="text-center">Verified Email</th>
                      <th className="text-center">Role</th>
                      <th className="text-center">Action</th> {/* Cột mới cho hành động */}
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
                          <img
                            src={account.userImage}
                            alt={account.fullname}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor: account.status === "banned" ? "#fbf1dd" : account.status === "active" ? "#dcf1e4" : "#f0f0f0", // Custom colors for "banned" and "active"
                              color: account.status === "banned" ? "#8a6111" : account.status === "active" ? "#0e612f" : "#000", // Text color
                            }}
                          >
                            {account.status}
                          </span>
                        </td>
                        <td className="text-center">{account.verifiedEmail ? "Yes" : "No"}</td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor:
                                account.role === "admin"
                                  ? "#ffe3e4"
                                  : account.role === "user"
                                    ? "#e9f7e9"
                                    : account.role === "shipper"
                                      ? "#f5ebfa"
                                      : "#f0f0f0",
                              color:
                                account.role === "admin"
                                  ? "#cf3115"
                                  : account.role === "user"
                                    ? "#438c41"
                                    : account.role === "shipper"
                                      ? "#9469bf"
                                      : "#000", // Text color
                            }}
                          >
                            {account.role}
                          </span>
                        </td>
                        <td className="text-center">

                          <Button
                            style={{ borderRadius: "30px" }}
                            variant="primary" onClick={() => handlePromote(account.id, account.role)}>
                            Promote
                          </Button>

                        </td>

                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Col>

        <Col className={cx("order_table")}>
          <Row className={cx("user", "justify-content-center", "align-items-center")}>
            <Col>
              <div className={cx("table-container")}>
                <h2 id="order-table"></h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="text-center">Order ID</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Phone</th>
                      <th className="text-center">Full Name</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Total Amount</th>
                      <th className="text-center">Service Fee</th>
                      <th className="text-center">Payment Status</th>
                      <th className="text-center">Order Status</th>
                      <th className="text-center">Order Method</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="text-center">{order.id}</td>
                        <td className="text-center">{order.buyer.email}</td>
                        <td className="text-center">{order.buyer.phone}</td>
                        <td className="text-center">{order.buyer.fullname}</td>
                        <td className="text-center">{order.quantity}</td>
                        <td className="text-center">{order.totalAmount.toFixed(2)}</td>
                        <td className="text-center">{order.serviceFee.toFixed(2)}</td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor: order.paymentStatus === "paid" ? "#dcf1e4" : "#f8d7da",
                              color: order.paymentStatus === "paid" ? "#0e612f" : "#721c24",
                            }}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor:
                                order.orderStatus === "received"
                                  ? "#dcf1e4"
                                  : order.orderStatus === "completed"
                                    ? "#d4edda"
                                    : order.orderStatus === "cancelled"
                                      ? "#f8d7da"
                                      : order.orderStatus === "shipping"
                                        ? "#faf0dc"
                                        : "#f0f0f0",
                              color:
                                order.orderStatus === "received"
                                  ? "#0e612f"
                                  : order.orderStatus === "completed"
                                    ? "#155724"
                                    : order.orderStatus === "cancelled"
                                      ? "#721c24"
                                      : order.orderStatus === "shipping"
                                        ? "#8a6212"
                                        : "#000",
                            }}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="text-center">{order.orderMethod}</td>
                        <td className="text-center">
                          {/* Order Status Update */}
                          <Form.Select
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            defaultValue={selectedStatus[order.id] || order.orderStatus}
                            style={{ display: 'inline-block', width: 'auto', marginRight: '5px' }}
                          >
                            <option value="" disabled>Select Status</option>
                            <option value="received">Received</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="shipping">Shipping</option>
                          </Form.Select>
                          <Button
                            style={{ borderRadius: "30px", marginBottom: '5px', marginRight: "5px" }}
                            variant="primary"
                            onClick={() => updateOrderStatus(order.id, selectedStatus[order.id])}>
                            Update Order
                          </Button>

                          {/* Payment Status Update */}
                          <Form.Select
                            onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                            defaultValue={selectedPaymentStatus[order.id] || order.paymentStatus}
                            style={{ display: 'inline-block', width: 'auto', marginRight: '5px' }}
                          >

                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </Form.Select>
                          <Button
                            style={{ borderRadius: "30px" }}
                            variant="secondary"
                            onClick={() => updatePaymentStatus(order.id, selectedPaymentStatus[order.id])}>
                            Update Payment
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Col>

        <Col className={cx("transaction_table")}>
          <Row className={cx("transaction", "justify-content-center", "align-items-center")}>
            <Col>
              <div className={cx("table-container")}> {/* Sử dụng lớp CSS cho bảng */}
                <h2 id="transaction-table"></h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Transaction Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment Method</th>
                      <th className="text-center">Buyer's Name</th> {/* Cột Buyer Username */}
                      <th className="text-center">Seller's Name</th> {/* Cột Seller Username */}
                      <th className="text-center">Service Fee</th> {/* Cột Service Fee */}
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{new Date(transaction.createdDate).toLocaleDateString()}</td>
                        <td>${transaction.transactionAmount ? transaction.transactionAmount.toFixed(2) : '0.00'}</td> {/* Hiển thị transactionAmount */}
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor:
                                transaction.order.orderStatus === "completed" ? "#dcf1e4" :
                                  transaction.order.orderStatus === "pending" ? "#fff4e6" :
                                    transaction.order.orderStatus === "failed" ? "#fbf1dd" : "#f0f0f0", // Màu sắc cho trạng thái
                              color:
                                transaction.order.orderStatus === "completed" ? "#0e612f" :
                                  transaction.order.orderStatus === "cancelled" ? "#856404" :
                                    transaction.order.orderStatus === "received" ? "#8a6111" : "#000", // Màu chữ

                            }}
                          >
                            {transaction.order.orderStatus}
                          </span>
                        </td>
                        <td>{transaction.order.orderMethod}</td>
                        <td className="text-center">{transaction.buyer.username}</td> {/* Hiển thị Buyer Username */}
                        <td className="text-center">{transaction.seller.username}</td> {/* Hiển thị Seller Username */}
                        <td className="text-center">${transaction.order.serviceFee ? transaction.order.serviceFee.toFixed(2) : '0.00'}</td> {/* Hiển thị Service Fee */}
                        <td>{/* Có thể thêm mô tả nếu cần */}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Col>


      </div>
    </>

  );
};

export default Admin;
