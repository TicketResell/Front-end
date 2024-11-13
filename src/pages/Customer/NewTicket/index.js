import React, { useState, useEffect } from "react";
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
import apiLocation from "../../../config/vietNamLocation";

const cx = classNames.bind(styles);

export default function NewTick({ user }) {
  const [ticketType, setTicketType] = useState("Select Ticket Type");
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [priceError, setPriceError] = useState("");
  //Location
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceName, setSelectedProvinceName] = useState("Select Province");
  const [selectedDistrictName, setSelectedDistrictName] = useState("Select District");
  const [selectedWardName, setSelectedWardName] = useState("Select Ward");

  const [selectedProvinceCode, setSelectedProvinceCode] = useState(0);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(0);

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
    quantity: "",
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
        const today = `${currentDate.getFullYear()}-${(
          currentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        setFormData({ ...formData, eventDate: today });
        toast.error(
          "The event date was not selected in the past. Reset to current date",
          {
            position: "top-center",
            autoClose: 5000,
            theme: "light",
            transition: Bounce,
          }
        );
        return;
      } else {
        setFormData({ ...formData, eventDate: selectedDate });
      }
    }

    if (name === "quantity") {
      if (value === "") {
        setFormData({ ...formData, quantity: value });
        return;
      }
      // Limit the quantity to a maximum of 30
      const newQuantity = Math.max(1, Math.min(Number(value), 30));
      setFormData({ ...formData, quantity: newQuantity });
      return;
    }

    if (name === "price") {
      setFormData({ ...formData, price: value });
      if (value < 10000 || value > 20000000) {
        setPriceError(
          "The change price is not within the valid range from 10,000 to 20,000,000 VND"
        );
      } else {
        setPriceError("");
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCategorySelect = (categoryId, categoryName) => {
    console.log("Category", categoryId);
    setFormData({ ...formData, categoryId });
    setSelectedCategory(categoryName);
  };

  const handleProvinceSelect = (provinceCode, provinceName) => {
    console.log("Province Code", provinceCode);
    setSelectedProvinceCode(provinceCode);
    setSelectedProvinceName(provinceName);
    setSelectedDistrictName("Select District");
    setSelectedWardName("Select Ward");
  };

  const handleDistrictsSelect = (districtCode, districtName) => {
    console.log("District", districtCode);
    setSelectedDistrictCode(districtCode);
    setSelectedDistrictName(districtName);
  };

  const handleWardsSelect = (wardCode, wardName) => {
    setSelectedWardName(wardName);
  };

  const handleSelectedTicketType = (e) => {
    console.log("Ticket Type", e);
    setTicketType(e);
    setFormData({ ...formData, ticketType: e });
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      const fetchedCategories = response.data;
      console.log("Category trên New Tick", fetchedCategories);
      if (Array.isArray(fetchedCategories)) {
        setCategories(fetchedCategories);
      } else {
        console.error("Fetched categories is not an array");
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await apiLocation.get("/");
      console.log("Provinces List", response.data.results);
      const provinceList = response.data.results;
      setProvinces(provinceList);
    } catch (error) {
      console.error("Không kéo được location", error);
    }
  };

  const fetchDistricts = async (pid) => {
    try {
      const response = await apiLocation.get(`/district/${pid}`);
      console.log("Districts List", response.data.results);
      const districtList = response.data.results;
      setDistricts(districtList);
    } catch (error) {
      console.error("Không kéo được location", error);
    }
  };

  const fetchWards = async (did) => {
    try {
      const response = await apiLocation.get(`/ward/${did}`);
      console.log("Wards List", response.data.results);
      const wardList = response.data.results;
      setWards(wardList);
    } catch (error) {
      console.error("Không kéo được location", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Thông tin vé", formData);
    if (
      !formData.eventTitle ||
      !formData.eventDate ||
      ticketType === "Select Ticket Type" ||
      !formData.ticketDetails ||
      !formData.location ||
      !formData.price ||
      selectedCategory === "Select Category" ||
      !formData.imageUrls ||
      formData.imageUrls.length === 0
    ) {
      toast.error("Please enter complete ticket information", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      toast.error("Please upload at least one photo", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.eventTitle) {
      toast.error("Please enter an event title", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    } else if (/\d/.test(formData.eventTitle)) {
      toast.error("Event titles cannot contain numbers", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }else if (/[^a-zA-Z0-9\s]/.test(formData.eventTitle)) {
      toast.error("Event titles cannot contain special characters", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.eventDate) {
      toast.error("Please enter the event date", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (new Date(formData.eventDate) < new Date()) {
      toast.error("The event date was not selected in the past.", {
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

    if (!formData.ticketDetails) {
      toast.error("Please enter a detailed ticket description", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    } else if (/[^a-zA-Z0-9\s]/.test(formData.ticketDetails)) {
      toast.error("Detailed descriptions cannot contain special characters", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.location) {
      toast.error("Please enter event location", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!formData.price) {
      toast.error("Please enter original price", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (formData.price < 10000 || formData.price > 20000000) {
      toast.error("Cannot save if the amount is not valid", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);
    const totalLocation = formData.location=","+selectedWardName+","+selectedDistrictName+","+selectedProvinceName
    const { location, ...formDataWithoutLocation } = formData;
    const formDataToSend = { ...formDataWithoutLocation, location: totalLocation }
     

    try {
      console.log("Form data", formDataToSend);
      const response = await api.post("/tickets/create", formDataToSend);
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Đã tạo vé thành công ", {
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
    fetchProvinces();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDistricts(selectedProvinceCode);
  }, [selectedProvinceCode]);

  useEffect(() => {
    fetchWards(selectedDistrictCode);
  }, [selectedDistrictCode]);

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
                  <Dropdown.Item eventKey="Standard">Standard</Dropdown.Item>
                  <Dropdown.Item eventKey="Premium">Premium</Dropdown.Item>
                  <Dropdown.Item eventKey="VIP">VIP</Dropdown.Item>
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
                    const selectedCat = categories.find(
                      (cat) => cat.id === parseInt(e)
                    );
                    handleCategorySelect(e, selectedCat.name);
                  }}
                  variant="outline-secondary"
                >
                  {Array.isArray(categories) &&
                    categories.map((category) => (
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
                  as="textarea"
                  rows={3}
                  name="ticketDetails"
                  placeholder="Enter Ticket Details"
                  value={formData.ticketDetails}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            {/*Location*/}

            <Form.Group as={Row} className="mb-3" controlId="formLocation">
              <Form.Label column sm="2">
                Location
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter venue number"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            {/*Location Detail*/}
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
              </Form.Label>

              <Col sm="3"  style={{ marginRight: '15px' }} >
                <Form.Label>Provinces</Form.Label>
                <DropdownButton
                  title={selectedProvinceName}
                  onSelect={(e) => {
                    const selectedPro = provinces.find(
                      (pro) => pro.province_id === e
                    );
                    console.log("Province đang chọn",selectedPro);
                    handleProvinceSelect(e, selectedPro.province_name);
                  }}
                  variant="outline-secondary"
                >
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }} >
                  {Array.isArray(provinces) &&
                    provinces.map((province) => (
                      <Dropdown.Item eventKey={province.province_id}>
                        {province.province_name}
                      </Dropdown.Item>
                    ))}
                    </div>
                </DropdownButton>
              </Col>

              <Col sm="3"  style={{ marginRight: '15px' }} >
                <Form.Label>Districts</Form.Label>
                <DropdownButton
                  title={selectedDistrictName}
                  onSelect={(e) => {
                    const selectedDis = districts.find(
                      (dis) => dis.district_id === e
                    );
                    handleDistrictsSelect(e, selectedDis.district_name);
                  }}
                  variant="outline-secondary"
                >
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }} >
                  {Array.isArray(districts) &&
                    districts.map((district) => (
                      <Dropdown.Item eventKey={district.district_id}>
                        {district.district_name}
                      </Dropdown.Item>
                    ))}
                    </div>
                </DropdownButton>
              </Col>

              <Col sm="3"  style={{ marginRight: '15px' }}>
                <Form.Label>Wards</Form.Label>
                <DropdownButton
                  title={selectedWardName}
                  onSelect={(e) => {
                    const selectedWard = wards.find(
                      (ward) => ward.ward_id === e
                    );
                    handleWardsSelect(e, selectedWard.ward_name);
                  }}
                  variant="outline-secondary"
                >
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }} >
                  {Array.isArray(wards) &&
                    wards.map((ward) => (
                      <Dropdown.Item eventKey={ward.ward_id}>
                        {ward.ward_name}
                      </Dropdown.Item>
                    ))}
                  </div>
                </DropdownButton>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formOriginalPrice">
              <Form.Label column sm="2">
                Price VND
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {priceError && <div style={{ color: "red" }}>{priceError}</div>}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formQuantity">
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
