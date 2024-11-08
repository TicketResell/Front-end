import { Row, Col, Table, Button, Form } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./AdminOverview.module.scss";
import SmallerCard from "./SmallCard";
import RevenueChart from "./RevenueChart";
import SalesStatistics from "./SalesStatistics";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

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

  const token = "";  
  // Fetch data from APIs
  const fetchRevenueAndSalesData = async () => {
    try {
      const revenueResponse = await api.get("/staff/get-total-revenue-profit");

      setRevenue({
        money: revenueResponse.data.revenue.toFixed(2),
        percent: revenueResponse.data.profit * 100,
        status: revenueResponse.data.profit >= 0 ? "up" : "down",
      });

      const userResponse = await api.get("/staff/get-number-of-user");
      setTotalUser(userResponse.data);

      const ordersResponse = await api.get("/admin/count-orders");
      setTotalOrders(ordersResponse.data);

      const transactionsResponse = await api.get("/admin/transactions");
      setTransactions(transactionsResponse.data);

      const accountsResponse = await api.get("/admin/view-accounts");
      setAccounts(accountsResponse.data);

      const ordersResponseData = await api.get("/admin/all-orders");
      setOrders(ordersResponseData.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Could not fetch data.");
    }
  };

  useEffect(() => {
    fetchRevenueAndSalesData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await api.put(`/orders/update-order-status/${orderId}`, {
        order_status: status,
      });

      // Handle success response
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error.response ? error.response.data : error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/all-orders");
      setOrders(response.data); 
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
      const response = await api.put(`/orders/update-payment-status/${orderId}`, {
        payment_status: paymentStatus,
        vnpResponseCode: "",
        vnpTransactionNo: "",
      });

      if (response.status === 200) {
        fetchOrders(); 
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
     
      if (currentRole === "user") {
        newRole = "staff"; 
      } else if (currentRole === "staff") {
        newRole = "admin"; 
      } else {
        alert(`Account with role '${currentRole}' cannot be promoted.`);
        return; 
      }

      const payload = {
        role: newRole, 
      };

      const response = await api.put(`/admin/promote/${id}`, payload);

      await fetchAccounts(); 

    } catch (error) {
      console.error("Failed to promote account:", error);
      setError("Failed to promote account.");
    }
  };

  const fetchAccounts = async () => {
    try {
      const accountsResponse = await api.get("/admin/view-accounts");
      setAccounts(accountsResponse.data);
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
                      number: `${completedOrdersCount}`,
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Cancel Orders",
                      number: `${cancelOrdersCount}`,
                    }}

                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Shipping Orders",
                      number: `${shipOrdersCount}`, 
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
                      number: `${activeUsersCount}`, 
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Ban Users",
                      number: `${banUsersCount}`, 
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
                      number: `${paidOrdersCount}`, 
                    }}
                  />
                </Row>
                <Row className={cx("sales")}>
                  <SmallerCard
                    types={{
                      name: "Cancel Order",
                      number: `${pendingOrdersCount}`,
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
                      <th className="text-center">Action</th> 
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
                              backgroundColor: account.status === "banned" ? "#fbf1dd" : account.status === "active" ? "#dcf1e4" : "#f0f0f0", 
                              color: account.status === "banned" ? "#8a6111" : account.status === "active" ? "#0e612f" : "#000", 
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
                                      : "#000",
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
                            <option value="" disabled>Select Status</option>
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
              <div className={cx("table-container")}>
                <h2 id="transaction-table"></h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Transaction Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment Method</th>
                      <th className="text-center">Buyer's Name</th> 
                      <th className="text-center">Seller's Name</th> 
                      <th className="text-center">Service Fee</th> 
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{new Date(transaction.createdDate).toLocaleDateString()}</td>
                        <td>${transaction.transactionAmount ? transaction.transactionAmount.toFixed(2) : '0.00'}</td> 
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor:
                                transaction.order.orderStatus === "completed" ? "#dcf1e4" :
                                  transaction.order.orderStatus === "pending" ? "#fff4e6" :
                                    transaction.order.orderStatus === "failed" ? "#fbf1dd" :
                                      transaction.order.orderStatus === "orderbombing" ? "#fbf1dd" : 
                                        "#f0f0f0",
                              color:
                                transaction.order.orderStatus === "completed" ? "#0e612f" :
                                  transaction.order.orderStatus === "cancelled" ? "#856404" :
                                    transaction.order.orderStatus === "received" ? "#8a6111" :
                                      transaction.order.orderStatus === "orderbombing" ? "#ff0000" : 
                                        "#000",
                            }}
                          >
                            {transaction.order.orderStatus}
                          </span>
                        </td>

                        <td>{transaction.order.orderMethod}</td>
                        <td className="text-center">{transaction.buyer.username}</td>
                        <td className="text-center">{transaction.seller.username}</td> 
                        <td className="text-center">${transaction.order.serviceFee ? transaction.order.serviceFee.toFixed(2) : '0.00'}</td>
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
