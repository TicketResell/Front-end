import { Row, Col, Table, Button } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./shipper.scss";
import { useEffect, useState } from "react";
import axios from "axios";

const cx = classNames.bind(styles);

const Shipper = () => {
  const [orders, setOrders] = useState([]);

  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0cmlubXNlMTgzMDMzQGZwdC5lZHUudm5fZ29vZ2xlIiwicm9sZSI6InNoaXBwZXIiLCJ1c2VyX2ltYWdlIjoiaHR0cHM6Ly9pLmliYi5jby96Rm1ITVB2L2Rvd25sb2FkLTM1LmpwZyIsImlkIjoxNCwiZnVsbG5hbWUiOiJUcmkgZHoiLCJleHAiOjE3MzA3MDI4NzQsImlhdCI6MTczMDA5ODA3NCwiZW1haWwiOiJ0cmlubXNlMTgzMDMzQGZwdC5lZHUudm4ifQ.xxFu9023VAW1Qju4DBjLDwRGjiwsQZ0pzs5CHbMociY";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8084/order/show-all-order/ship", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <Col className={cx("user_table")}>
      <Row className={cx("user", "justify-content-center", "align-items-center")}>
        <Col>
          <div className={cx("table-container")}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Buyer Name</th>
                  <th>Seller Name</th>
                  <th>Ticket Name</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Service Fee</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Order Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.buyerName}</td>
                    <td>{order.sellerName}</td>
                    <td>{order.ticketName}</td>
                    <td>{order.quantity}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>${order.serviceFee.toFixed(2)}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.orderMethod}</td>
                    <td className="text-center">
                      <Button
                        style={{ borderRadius: "30px" }}
                        variant="primary"
                        // Add appropriate action for the button
                        onClick={() => console.log(`Action for order ID: ${order.id}`)}
                      >
                        Action
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
  );
};

export default Shipper;
