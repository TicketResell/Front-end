import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./TicketEdit.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";

function TicketEdit({ ticket, onSave }) {
  const cx = classNames.bind(styles);
  const [formData, setFormData] = useState(ticket);
  const [showImages, setShowImages] = useState(ticket.imageUrls || []);

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

  const handleImageChange = async (e) => {
    const imageList = Array.from(e.target.files);

    if (imageList.length > 5) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "eventDate") {
      const today = new Date();
      const inputDate = new Date(value);

      // Kiểm tra nếu ngày nhập nhỏ hơn ngày hiện tại thì reset về ngày ban đầu
      if (inputDate < today) {
        toast.error("Ngày sự kiện không thể là quá khứ. Đặt lại ngày ban đầu.", {
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
        setFormData({ ...formData, eventDate: ticket.eventDate });
        return;
      }
    }

    if (name === "quantity") {
      // Giới hạn số lượng tối đa là 30
      const newQuantity = Math.min(Number(value), 30);
      setFormData({ ...formData, quantity: newQuantity });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ToastContainer />
      <Form.Group>
        <Form.Group as={Row} className={cx("mb-3")} controlId="formImages">
          <Form.Label className={cx("fui-upload")}>
            <div className={cx("upload-icon")}>
              <img src="https://i.ibb.co/5cQkzZN/img-upload.png" />
            </div>
            <Form.Control
              type="file"
              multiple
              className={cx("fui-input-upload")}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <span className={cx("fui-upload-text")}>Upload a photo</span>
          </Form.Label>
          {showImages &&
            showImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview Image ${index}`}
                style={{ width: "100px", height: "100px", marginTop: "10px" }}
              />
            ))}
          <br />
        </Form.Group>

        <Form.Label>Event Title</Form.Label>
        <Form.Control
          type="text"
          name="eventTitle"
          value={formData.eventTitle}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Ticket Type</Form.Label>
        <Form.Control
          as="select"
          name="ticketType"
          value={formData.ticketType}
          onChange={handleInputChange}
        >
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
          <option value="Standard">Standard</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Event Date</Form.Label>
        <Form.Control
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
}

export default TicketEdit;
