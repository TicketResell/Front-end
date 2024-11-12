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
                      number: `${parseFloat(revenue.money).toLocaleString()} VNĐ`,  // Định dạng tiền theo kiểu có dấu chấm phân cách
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

      </div>
    </>

  );
};

export default Admin;
