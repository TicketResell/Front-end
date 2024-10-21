import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./TicketEdit.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";
import uploadImgBB from "../../../../config/imgBB";
import api from "../../../../config/axios";

function TicketEdit({ ticket, onSave }) {
  console.log('ticket',ticket);
  const cx = classNames.bind(styles);
  const [formData, setFormData] = useState(ticket);
  const [showImages, setShowImages] = useState(ticket.imageUrls || []);

  const handleImageChange = async (e) => {
    const imageList = Array.from(e.target.files);

    if (imageList.length > 5) {
      toast.error("Bạn chỉ có thể tải lên tối đa 5 ảnh", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    console.log('imageList',imageList);

    // Preview images (base64 for preview)
    const previewImages = imageList.map((image) => URL.createObjectURL(image));
    setShowImages(previewImages);

    // Upload images to imgBB
    const uploadedUrls = await uploadImgBB(imageList);
    console.log('uploadedUrls',uploadedUrls);
    const validUrls = uploadedUrls.filter((url) => url !== null);

    // Check if the images have changed
    const imagesChanged = validUrls.length !== (formData.imageUrls?.length || 0) ||
                      validUrls.some((url, index) => url !== formData.imageUrls[index]);

if (imagesChanged) {
  setFormData((prevData) => ({
    ...prevData,
    imageUrls: validUrls,
  }));
}
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "eventDate") {
      const today = new Date();
      const inputDate = new Date(value);

      // Prevent past event dates
      if (inputDate < today) {
        toast.error("Ngày sự kiện không thể là quá khứ. Đặt lại ngày ban đầu.", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
        setFormData({ ...formData, eventDate: ticket.eventDate });
        return;
      }
    }

    if (name === "quantity") {
      // Limit the quantity to a maximum of 30
      const newQuantity = Math.min(Number(value), 30);
      setFormData({ ...formData, quantity: newQuantity });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (JSON.stringify(formData.imageUrls) !== JSON.stringify(ticket.imageUrls)) {
        const response = await api.put(`/tickets/${formData.id}`, formData);

        if (response.status === 200) {
          toast.success("Ticket updated successfully", {
            position: "top-center",
            autoClose: 3000,
            theme: "light",
            transition: Bounce,
          });
          onSave(formData);
        }
      } else {
        toast.info("No changes to the images, no update needed.", {
          position: "top-center",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Failed to update ticket", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      console.error("Update error:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ToastContainer />
      <Form.Group>
        <Form.Group as={Row} className={cx("mb-3")} controlId="formImages">
          <Form.Label className={cx("fui-upload")}>
            <div className={cx("upload-icon")}>
              <img src="https://i.ibb.co/5cQkzZN/img-upload.png" alt="Upload Icon" />
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
          <div className="image-previews">
            {showImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                style={{ width: "100px", height: "100px", marginTop: "10px" }}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group>
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
      </Form.Group>
    </Form>
  );
}

export default TicketEdit;
