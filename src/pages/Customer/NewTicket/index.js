import React, { useState,useEffect } from "react";
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
import api from "../../../config/axios";
import uploadImgBB from "../../../config/imgBB";

const cx = classNames.bind(styles);

export default function NewTick({ user }) {
  const [ticketType, setTicketType] = useState("Select Ticket Type");
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  
  // Khai báo formData ở đây
  const [formData, setFormData] = useState({
    price: "",
    userID: user.id,
    eventTitle: "",
    eventDate: "",
    categoryId: "",
    location: "",
    ticketType: "",
    ticketDetails: "",
    createddate: new Date(),
    imageUrls: [],
    status: "onsale",
    quantity : "",
  });

  const handleImageChange = async (e) => {
    const imageList = Array.from(e.target.files);
    if (imageList.length > 5) {
      //Nếu lớn hơn 5 tấm sẽ dừng tại đây
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

    setFormData({ ...formData, imageUrls: validUrls });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "eventDate") {
      const currentDate = new Date();
      const selectedDate = new Date(value);
      currentDate.setHours(0, 0, 0, 0);

      // Nếu ngày nhập nhỏ hơn ngày hiện tại thì reset về ngày hôm nay
      if (selectedDate < currentDate) {
        const today = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        setFormData({ ...formData, eventDate: today});
        toast.error("The event date was not selected in the past. Reset to current date", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
        return;
      }else{
        setFormData({ ...formData, eventDate: selectedDate });
      }
    }
  
    if (name === "quantity") {
      // Giới hạn số lượng tối đa là 30 và không nhỏ hơn 1
      const newQuantity = Math.max(Math.min(Number(value), 30), 1);
      setFormData({ ...formData, quantity: newQuantity });
      return;
    }
  
    setFormData({ ...formData, [name]: value });
  };
  

  const handleCategorySelect = (categoryId, categoryName) => {
    console.log("Category",categoryId);
    setFormData({ ...formData, categoryId });
    setSelectedCategory(categoryName); 
  };
  const handleSelectedTicketType = (e) =>{
    console.log("Ticket Type",e);
    setTicketType(e)
    setFormData({ ...formData, ticketType: e });
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      const fetchedCategories = response.data;
  
      if (Array.isArray(fetchedCategories)) {
        setCategories(fetchedCategories);
      } else {
        console.error("Fetched categories is not an array");
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.eventTitle ||
      !formData.eventDate ||
      ticketType === "Select Ticket Type" ||
      !formData.location ||
      !formData.price ||
      selectedCategory === "Select Category" ||
      !formData.imageUrls ||
      formData.imageUrls.length === 0
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

    if (selectedCategory === "Select Category") {
      toast.error("Vui lòng chọn sự kiện", {
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

    if (!formData.price) {
      toast.error("Vui lòng nhập giá gốc", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một ảnh", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (new Date(formData.eventDate) < new Date()) {
      toast.error("Ngày sự kiện không được chọn trong quá khứ.", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Form data",formData);
      const response = await api.post("/tickets/create", formData);
      console.log(response.data);
      if(response.status === 200){
        toast.success('Đã tạo vé thành công ', {
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
        setFormData({
          price: "",
          userID: user.id,
          eventTitle: "",
          eventDate: "",
          categoryId: "",
          location: "",
          ticketType: "",
          ticketDetails: "",
          createddate: new Date(),
          imageUrls: [],
          status: "onsale",
          quantity: "",
        }); 
      }
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
  useEffect(() => {
    fetchCategories();
  }, []);

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
                    key={index}
                    style={{
                      width: "100px",
                      height: "100px",
                      marginTop: "10px",
                    }}
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
                  name="eventTitle"
                  placeholder="Enter event title"
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEventDate">
              <Form.Label column sm="2">
                Event Date
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
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
                  onSelect={(e) => handleSelectedTicketType(e)}
                  variant="outline-secondary"
                >
                  <Dropdown.Item eventKey="Standard">
                  Standard
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Premium">
                  Premium
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="VIP">
                  VIP
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formTicketType">
              <Form.Label column sm="2">
                Category
              </Form.Label>
              <Col sm="10">
                <DropdownButton
                  title={selectedCategory}
                  onSelect={(e) => {
                    const selectedCat = categories.find(cat => cat.id === parseInt(e));
                    handleCategorySelect(e, selectedCat.name);
                  }}
                  variant="outline-secondary"
                >
                  {Array.isArray(categories) && categories.map((category)=>(
                    <Dropdown.Item eventKey={category.id}>
                    {category.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formTicketDetails">
              <Form.Label column sm="2">
              Ticket Details
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="textarea" rows={3}
                  name="ticketDetails"
                  placeholder="Enter Ticket Details"
                  value={formData.ticketDetails}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formLocation">
              <Form.Label column sm="2">
                Location
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formOriginalPrice">
              <Form.Label column sm="2">
                Price $
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formQuantity"
            >
              <Form.Label column sm="2">
                Quantity
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
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
