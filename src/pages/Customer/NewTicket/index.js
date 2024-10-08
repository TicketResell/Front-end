import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Col,
  Row,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./NewTick.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";
import api from "../../../config";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng sau khi gửi thành công

const cx = classNames.bind(styles);

export default function NewTick() {
  const [ticketType, setTicketType] = useState("Select Ticket Type");
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState([]);

  // Khai báo formData ở đây
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDate: "",
    location: "",
    originalPrice: "",
    discountedPrice: "",
    images: [],
  });

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng sau khi form được gửi thành công

  const apiKey = "a393ae4d99828767ecd403ef4539e170";

  async function uploadImgBB(files) {
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append("image", file);

      return fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => data.data.url)
        .catch((error) => {
          console.log("Upload error:", error);
          return null;
        });
    });

    return Promise.all(uploadPromises);
  }

  const handleSelect = (e) => {
    setTicketType(e);
  };

  const handleImageChange = async (e) => {
    const imageList = Array.from(e.target.files);
    if (imageList.length > 5) { //Nếu lớn hơn 5 tấm sẽ dừng tại đây 
      toast.error("Bạn chỉ có thể tải lên tối đa 5 ảnh", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
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

    setFormData({ ...formData, images: validUrls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.eventTitle ||
      !formData.eventDate ||
      ticketType === "Select Ticket Type" ||
      !formData.location ||
      !formData.originalPrice ||
      !formData.discountedPrice ||
      !formData.images ||
      formData.images.length === 0
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin vé", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.eventTitle) {
      toast.error("Vui lòng nhập tiêu đề sự kiện", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.eventDate) {
      toast.error("Vui lòng nhập ngày diễn ra sự kiện", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (ticketType === "Select Ticket Type") {
      toast.error("Vui lòng chọn loại vé", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.location) {
      toast.error("Vui lòng nhập địa điểm sự kiện", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.originalPrice) {
      toast.error("Vui lòng nhập giá gốc", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.discountedPrice) {
      toast.error("Vui lòng nhập giá đã giảm", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một ảnh", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);

    const data = {
      eventTitle: formData.eventTitle,
      eventDate: formData.eventDate,
      ticketType,
      location: formData.location,
      originalPrice: formData.originalPrice,
      discountedPrice: formData.discountedPrice,
      images: formData.images,
    };

    try {
      const response = await api.post("your-api-endpoint", data);
      console.log(response.data);

      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/success-page"); // Điều hướng đến trang thành công
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={cx("wrapper", "d-flex")}>
      <ToastContainer />
      <Row>
        <Col></Col>
        <Col>
          <Form className={cx("formStyle")} onSubmit={handleSubmit}>

            <Form.Group as={Row} className={cx("mb-3")} controlId="formImages">
              <Form.Label className={cx("fui-upload")}>
              <div className={cx("upload-icon")}>
                <img src="https://i.ibb.co/5cQkzZN/img-upload.png"/>
              </div>
              <Form.Control
                type="file"
                multiple
                className={cx("fui-input-upload")}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              <span className={cx("fui-upload-text")}>Tải ảnh lên</span>
              </Form.Label>
              {showImages &&
              showImages.map((image, index) => (
                <img
                  src={image}
                  alt={`Preview Image ${index}`}
                  key={index}
                  style={{ width: "100px", height: "100px", marginTop: "10px" }}
                />
              ))}
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEventTitle">
              <Form.Label column sm="2">
                Event Title
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Enter event title"
                  value={formData.eventTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, eventTitle: e.target.value })
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEventDate">
              <Form.Label column sm="2">
                Event Date (Hạn vé)
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formTicketType">
              <Form.Label column sm="2">
                Ticket Type
              </Form.Label>
              <Col sm="10">
                <DropdownButton
                  title={ticketType}
                  onSelect={handleSelect}
                  variant="outline-secondary"
                >
                  <Dropdown.Item eventKey="Event tickets">
                    Event tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Sports tickets">
                    Sports tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Travel tickets">
                    Travel tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Tourist attraction tickets">
                    Tourist attraction tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Movie tickets">
                    Movie tickets
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Fair tickets">
                    Fair tickets
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formLocation">
              <Form.Label column sm="2">
                Location
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formOriginalPrice">
              <Form.Label column sm="2">
                Original Price
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Enter original price"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formDiscountedPrice"
            >
              <Form.Label column sm="2">
                Discounted Price
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Enter discounted price"
                  value={formData.discountedPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountedPrice: e.target.value,
                    })
                  }
                />
              </Col>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className={cx("submitBtn")}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
