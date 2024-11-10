import { useState, useEffect } from "react";
import api, { apiWithoutPrefix } from "../../../config/axios";
import { Modal, Button, Form, DropdownButton, Dropdown } from "react-bootstrap";
import Pagination from "../../../layouts/components/Pagination";
import { FaBan } from "react-icons/fa";
import styles from "./GetOrder.module.scss";
import { MDBBadge } from "mdb-react-ui-kit";
import classNames from "classnames/bind";
import uploadImgBB from "../../../config/imgBB";
import { ToastContainer, toast, Bounce } from "react-toastify";

function OrderList({ user }) {
  const cx = classNames.bind(styles);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [orderPage, setOrderPage] = useState(0);
  const [showImages, setShowImages] = useState([]);
  const itemsPerPage = 12;
  const offset = orderPage * itemsPerPage;
  const currentOrders = orders.slice(offset, offset + itemsPerPage);
  const [img, setImg] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderIDSelected, setOrderIDSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showModalImage, setShowModalImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await apiWithoutPrefix.get("/order/all-order/ship");
      console.log("Response", response.data);
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error("Fetch Orders Error:", err);
    }
  };

  const handleDropdownClick = (orderId, title) => {
    setOrderIDSelected(orderId);
    setSelectedStatus(title);
    setShowModal(true);
  };

  useEffect(() => {
    fetchOrders();
  }, [showModal]);

  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setShowModalImage(true);
  };

  const handleImageChange = async (e) => {
    const imageList = Array.from(e.target.files);
    let previewImages = [];
    imageList.forEach((image) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewImages = [...previewImages, reader.result];
        setShowImages(previewImages);
      };
      reader.readAsDataURL(image);
    });

    const uploadedUrls = await uploadImgBB(imageList);
    const validUrls = uploadedUrls.filter((url) => url !== null);

    setImg(validUrls);
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();

    console.log("Image", img[0]);

    const payload = { img: img[0] };

    if (selectedStatus === "received") {
      const response = await apiWithoutPrefix.put(
        `/order/set-shipping-status/${orderIDSelected}`,
        payload
      );
      if (response.status === 200) {
        toast.success("Status Update Successfully", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      }
    } else {
      const response = await apiWithoutPrefix.put(
        `/order/set-shipping-status-false/${orderIDSelected}`,
        payload
      );
      if (response.status === 200) {
        toast.success("Status Update Successfully", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      }
    }
    setShowModal(false);
  };

  return (
    <div className={cx("order-list-container")}>
      <ToastContainer />
      <h1>Order List</h1>
      {error && <p>{error}</p>}
      <table className={cx("order-table")}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer Name </th>
            <th>Seller Name</th>
            <th>Ticket Title</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Service Fee</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Order Method</th>
            <th>Image Verification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order.id}>
              <td>{offset + index + 1}</td>
              <td>{order.buyer.username}</td>
              <td>{order.seller.username}</td>
              <td>{order.ticket.eventTitle}</td>
              <td>{order.quantity}</td>
              <td>{order.totalAmount}</td>
              <td>{order.serviceFee}</td>
              <td>
                <MDBBadge
                  color={order.paymentStatus === "paid" ? "warning" : "success"}
                  pill
                >
                  {order.paymentStatus}
                </MDBBadge>
              </td>
              <td>
                <MDBBadge
                  color={
                    order.orderStatus === "pending"
                      ? "warning"
                      : order.orderStatus === "shipping"
                      ? "dark"
                      : order.orderStatus === "received"
                      ? "success"
                      : order.orderStatus === "orderbombing"
                      ? "danger"
                      : "primary"
                  }
                  pill
                >
                  {order.orderStatus}
                </MDBBadge>
              </td>
              <td>{order.orderMethod}</td>
              <td>{order && <img 
              src={order.imgShiper || "https://i.ibb.co/nr0rNrn/360-F-227739395-Bhszne-Mcufc-Ae9-DJEBTHFFx-VJM1-PR8-RT.jpg"} 
               alt="Order Image" 
               style={{height: "30px", width : "auto"}}
               onClick={() => handleImageClick(order.imgShiper || "https://i.ibb.co/nr0rNrn/360-F-227739395-Bhszne-Mcufc-Ae9-DJEBTHFFx-VJM1-PR8-RT.jpg")}
              />}</td>
              <td>
                {order.orderStatus === "shipping" ? (
                  <DropdownButton
                    id="dropdown-basic-button"
                    title="Update Order Status"
                  >
                    <Dropdown.Item
                      onClick={() =>
                        handleDropdownClick(order.id, "orderbombing")
                      }
                    >
                      Orderbombing
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleDropdownClick(order.id, "received")}
                    >
                      Received
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <FaBan size={30} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitStatus}>
            <Form.Group controlId="formFile">
              <Form.Label>Upload Image</Form.Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label htmlFor="fui-input-upload" className={cx("fui-upload")}>
                  <div className={cx("upload-content")}>
                    <div className={cx("upload-icon")}>
                      <img
                        src="https://i.ibb.co/5cQkzZN/img-upload.png"
                        alt=""
                      />
                    </div>
                    <input
                      type="file"
                      name="fui-input-upload"
                      hidden
                      accept="image/*"
                      id="fui-input-upload"
                      onChange={handleImageChange}
                    />
                    <span className={cx("fui-upload-text")}>Tải ảnh lên</span>
                  </div>
                </label>

                {/* Hiển thị ảnh xem trước */}
                {showImages &&
                  showImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      style={{
                        width: "300px",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      alt={`Preview ${index}`}
                    />
                  ))}
              </div>
            </Form.Group>

            {/* Di chuyển nút Submit vào trong Form */}
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

       {/* Modal hiển thị ảnh phóng to */}
       <Modal show={showModalImage} onHide={() => setShowModalImage(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Ảnh Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={selectedImage}
                alt="Phóng to Order Image"
                style={{ width: "100%", height: "auto" }}
              />
            </Modal.Body>
          </Modal>

      <Pagination
        currentPage={orderPage}
        pageCount={Math.ceil(orders.length / itemsPerPage)}
        onPageChange={(selectedPage) => setOrderPage(selectedPage)}
      />
    </div>
  );
}

export default OrderList;
