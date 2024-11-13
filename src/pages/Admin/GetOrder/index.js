import { Row, Col, Table, Button, Form, Modal } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./AdminOverview.module.scss";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

const cx = classNames.bind(styles);

const OrderList = () => {
  const [revenue, setRevenue] = useState(null);
  const [totalUser, setTotalUser] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newServiceFee, setNewServiceFee] = useState("");
  const [serviceFeeError, setServiceFeeError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = "";

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPagedOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return orders.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleOpenModal = (order) => {
    setCurrentOrder(order);
    setSelectedStatus(order.orderStatus);
    setSelectedPaymentStatus(order.paymentStatus);
    setNewServiceFee(order.serviceFee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentOrder(null);
  };

  const updateServiceFee = async () => {
    if (!currentOrder || newServiceFee === "") return;
  
    const newFee = parseFloat(newServiceFee);
    const currentFee = parseFloat(currentOrder.serviceFee);
  
    if (newFee > currentFee) {
      setServiceFeeError("The new service fee must be smaller than the current service fee.");
      return;
    }
  
    try {
      const response = await api.put(`/admin/update-service-fee/${currentOrder.id}`, {
        serviceFee: newFee,
      });
  
      const updatedOrder = { ...currentOrder, serviceFee: response.data.serviceFee };
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === currentOrder.id ? updatedOrder : order
        )
      );
      
      setCurrentOrder(updatedOrder);
  
     
      setShowModal(false);
      
      await fetchOrders();
      
    } catch (error) {
      console.error("Error updating service fee:", error);
    }
  };
  

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/all-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  if (!revenue) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cx("adminPage")}>
      <Col className={cx("order_table")}>
        <Row className={cx("user", "justify-content-center", "align-items-center")}>
          <Col>
            <div className={cx("table-container")}>
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
                  {getPagedOrders().map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td className="text-center">{order.buyer.email}</td>
                      <td className="text-center">{order.buyer.phone}</td>
                      <td className="text-center">{order.buyer.fullname}</td>
                      <td className="text-center">{order.quantity}</td>
                      <td className="text-center">{order.totalAmount}</td>
                      <td className="text-center">{order.serviceFee}</td>
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
                                      : order.orderStatus === "orderbombing"
                                        ? "#ffebcc"
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
                                      : order.orderStatus === "orderbombing"
                                        ? "#856404"
                                        : "#000",
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="text-center">{order.orderMethod}</td>
                      <td className="text-center">
                        <Button variant="primary" onClick={() => handleOpenModal(order)}>
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="pagination-controls">
              <Button
                variant="outline-primary"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </Button>
              <span className="mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </Col>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Service Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formServiceFee">
              <Form.Label>New Service Fee</Form.Label>
              <Form.Control
                type="number"
                value={newServiceFee}
                onChange={(e) => setNewServiceFee(e.target.value)}
                min="0"
              />
              {serviceFeeError && (
                <Form.Text className="text-danger">{serviceFeeError}</Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" onClick={updateServiceFee}>
              Update Fee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OrderList;
