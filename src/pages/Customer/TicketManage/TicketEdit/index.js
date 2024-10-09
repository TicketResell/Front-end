import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./TicketEdit.module.scss";
import { ToastContainer,toast,Bounce } from "react-toastify";
function TicketEdit({ ticket, onSave }) {
  const cx = classNames.bind(styles);
  const [formData, setFormData] = useState(ticket);
  const [showImages, setShowImages] = useState(ticket.images || []);

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
        .then((data) => data.data.url) // Trả về URL sau khi upload xong
        .catch((error) => {
          console.log("Upload error:", error);
          return null; // Trả về null nếu lỗi xảy ra
        });
    });

    // Chờ tất cả các ảnh được upload xong và trả về danh sách URL
    return Promise.all(uploadPromises);
  }

  const handleImageChange = async (e) => {
    const imageList = Array.from(e.target.files); // Chuyển các file thành mảng

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
    console.log(imageList);
    // Hiển thị ảnh xem trước
    imageList.forEach((image) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewImages = [...previewImages, reader.result];
        setShowImages(previewImages); // Cập nhật danh sách xem trước
      };
      reader.readAsDataURL(image);
    });

    // Upload tất cả ảnh lên ImgBB cùng lúc
    const uploadedUrls = await uploadImgBB(imageList);
    const validUrls = uploadedUrls.filter((url) => url !== null); // Loại bỏ URL null nếu có lỗi

    // Cập nhật formData với danh sách URL ảnh
    setFormData({ ...formData, images: validUrls });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Gọi hàm onSave với dữ liệu đã chỉnh sửa
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
            <span className={cx("fui-upload-text")}>Tải ảnh lên</span>
          </Form.Label>
          {showImages &&
            showImages.map((image, index) => (
              <img
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
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Ticket Type</Form.Label>
        <Form.Control
          type="text"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Event Date</Form.Label>
        <Form.Control
          type="text"
          name="date"
          value={formData.date}
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
          type="text"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Sale Price</Form.Label>
        <Form.Control
          type="text"
          name="salePrice"
          value={formData.salePrice}
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
