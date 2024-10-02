import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function TicketEdit({ ticket, onSave }) {
  const [formData, setFormData] = useState(ticket);
  const [showImage,setShowImage] = useState(ticket.image);

  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if(file){
        const render = new FileReader();
        render.onloadend = () =>{
            setShowImage(render.result); //Xem ảnh xem trước
        };
        render.readAsDataURL(file); //Đọc URL file ảnh
        setFormData({...formData,image : URL.createObjectURL(file)}); //Lưu URL ảnh vào data để gửi lên BE
    }
  }

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
      <Form.Group>
        {showImage && (<div><img src={showImage} alt="Preview Upload Image " style={{ width: "100px", height: "100px", marginTop: "10px" }}/></div>)}
      <Form.Label>Image</Form.Label>
        <Form.Control
          type="file"
          onChange={handleImageChange}
        />
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
