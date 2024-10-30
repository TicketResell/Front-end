import { Row, Col, Table, Button } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./shipper.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import uploadImgBB from "../../config/imgBB";

const cx = classNames.bind(styles);

const Shipper = () => {
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0cmlubXNlMTgzMDMzQGZwdC5lZHUudm5fZ29vZ2xlIiwicm9sZSI6InNoaXBwZXIiLCJ1c2VyX2ltYWdlIjoiaHR0cHM6Ly9pLmliYi5jby96Rm1ITVB2L2Rvd25sb2FkLTM1LmpwZyIsImlkIjoxNCwiZnVsbG5hbWUiOiJUcmkgZHoiLCJleHAiOjE3MzA3MDI4NzQsImlhdCI6MTczMDA5ODA3NCwiZW1haWwiOiJ0cmlubXNlMTgzMDMzQGZwdC5lZHUudm4ifQ.xxFu9023VAW1Qju4DBjLDwRGjiwsQZ0pzs5CHbMociY"; // Thay thế bằng token thực tế của bạn

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

  const confirmShipment = async (orderId) => {
    if (!selectedImage) {
      alert("Please select an image to upload.");
      return;
    }
  
 
    const uploadedUrls = await uploadImgBB(selectedImage);
    const validUrls = uploadedUrls.filter((url) => url !== null);
  
    if (validUrls.length === 0) {
      alert("Failed to upload image. Please try again.");
      return;
    }
  
    const requestData = {
      imageUrl: validUrls[0], 
    };
    
    try {
      await axios.put(`http://localhost:8084/set-shipping-status/${orderId}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    } catch (error) {
      console.error("Error confirming shipment:", error);
    }
    
  

    console.log("Sending request to set shipping status:");
    console.log("URL:", `http://localhost:8084/set-shipping-status/${orderId}`);
    console.log("Method:", "PUT");
    console.log("Headers:", {
      Authorization: `Bearer ${token}`,
    });
    console.log("Body:", requestData);
  
    try {
      await axios.put(`http://localhost:8084/order/set-shipping-status/${orderId}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  

      const response = await axios.get("http://localhost:8084/order/show-all-order/ship", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setSelectedImage(null); 
    } catch (error) {
      console.error("Error confirming shipment:", error);
    }
  };
  
  const cancelShipment = async (orderId) => {
    try {
      await axios.put(`http://localhost:8084/order/set-shipping-status-false/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const response = await axios.get("http://localhost:8084/order/show-all-order/ship", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error canceling shipment:", error);
    }
  };

  return (
    <Col className={cx("user_table")}>
      <Row className={cx("user", "justify-content-center", "align-items-center")}>
        <Col>
          <div className={cx("table-container")}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Buyer Name</th>
                  <th className="text-center">Seller Name</th>
                  <th className="text-center">Ticket Name</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Total Amount</th>
                  <th className="text-center">Service Fee</th>
                  <th className="text-center">Payment Status</th>
                  <th className="text-center">Order Status</th>
                  <th className="text-center">Order Method</th>
                  <th className="text-center">Image</th> 
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="text-center">{order.id}</td>
                    <td className="text-center">{order.buyerName}</td>
                    <td className="text-center">{order.sellerName}</td>
                    <td className="text-center">{order.ticketName}</td>
                    <td className="text-center">{order.quantity}</td>
                    <td className="text-center">${order.totalAmount.toFixed(2)}</td>
                    <td className="text-center">${order.serviceFee.toFixed(2)}</td>
                    <td className="text-center">{order.paymentStatus}</td>
                    <td className="text-center">{order.orderStatus}</td>
                    <td>{order.orderMethod}</td>
                    <td className="text-center">
                      {order.imageUrl && <img src={order.imageUrl} alt="Order" style={{ width: '50px', height: '50px' }} />} 
                    </td>
                    <td className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files)} 
                        style={{ marginRight: '10px' }}
                      />
                      <Button
                        style={{ borderRadius: "30px", backgroundColor:"green", border:"green", marginRight: '5px' }}
                        variant="primary"
                        onClick={() => confirmShipment(order.id)} 
                      >
                        Confirm Successful
                      </Button>
                      <Button
                        style={{ borderRadius: "30px", backgroundColor: "red", border: "red" }}
                        variant="danger"
                        onClick={() => cancelShipment(order.id)}
                      >
                        Confirm Cancel
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
