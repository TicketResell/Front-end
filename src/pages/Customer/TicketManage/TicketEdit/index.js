import { useState,useEffect } from "react";
import { Button, Form, Row ,Col, Dropdown , DropdownButton} from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./TicketEdit.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";
import uploadImgBB from "../../../../config/imgBB";
import api from "../../../../config/axios";
import apiLocation from "../../../../config/vietNamLocation";

function TicketEdit({ ticket, onSave }) {
  console.log('ticket',ticket);
  const cx = classNames.bind(styles);
  const [formData, setFormData] = useState(ticket);
  const [showImages, setShowImages] = useState(ticket.imageUrls || []);
  const [priceError, setPriceError] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceName, setSelectedProvinceName] = useState("Select Province");
  const [selectedDistrictName, setSelectedDistrictName] = useState("Select District");
  const [selectedWardName, setSelectedWardName] = useState("Select Ward");

  const [selectedProvinceCode, setSelectedProvinceCode] = useState(0);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(0);

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

  const handleImageChange = async (e) => {
    const imageList = Array.from(e.target.files);

    if (imageList.length > 5) {
      toast.error("You can only upload a maximum of 5 photos", {
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
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData({ ...formData, price: numericValue });
      if (numericValue < 10000 || numericValue > 20000000) {
        setPriceError("The change price is not within the valid range from 10,000 to 20,000,000 VND");
      } else {
        setPriceError("");
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.price < 10000 || formData.price > 20000000) {
      toast.error("Cannot save if the amount is not valid", {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return; 
    }
  
    try {
      console.log("Form thay đổi trả cho backend",formData);
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

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    fetchDistricts(selectedProvinceCode);
  }, [selectedProvinceCode]);

  useEffect(() => {
    fetchWards(selectedDistrictCode);
  }, [selectedDistrictCode]);

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
            {/*Location detail */}
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
                  {Array.isArray(provinces) &&
                    provinces.map((province) => (
                      <Dropdown.Item eventKey={province.province_id}>
                        {province.province_name}
                      </Dropdown.Item>
                    ))}
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
                  {Array.isArray(districts) &&
                    districts.map((district) => (
                      <Dropdown.Item eventKey={district.district_id}>
                        {district.district_name}
                      </Dropdown.Item>
                    ))}
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
                  {Array.isArray(wards) &&
                    wards.map((ward) => (
                      <Dropdown.Item eventKey={ward.ward_id}>
                        {ward.ward_name}
                      </Dropdown.Item>
                    ))}
                </DropdownButton>
              </Col>
            </Form.Group>

        <Form.Group>
          <Form.Label>Price (VND)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price.toLocaleString('vi-VN')}
            onChange={handleInputChange}
          />
           {priceError && <div style={{ color: "red" }}>{priceError}</div>}
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
