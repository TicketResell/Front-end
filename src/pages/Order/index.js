import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card , Dropdown , DropdownButton} from "react-bootstrap";
import styles from "./Order.module.scss";
import { useLocation } from "react-router-dom";
import { confirmAddress, confirmPhone } from "../../services/api/Format";
import { FaLockOpen,FaLock } from "react-icons/fa";
import api from "../../config/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import apiLocation from "../../config/vietNamLocation";

const OrderPage = () => {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;
  const quantity = location.state?.quantity;

  const [order, setOrder] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    eventTitle: "",
    quantity: 0,
    price: 0,
    totalAmount: 0,
    orderMethod: "COD"
  });
  
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [addressPart, setAddressPart] = useState([]);
  const [selectedProvinceName, setSelectedProvinceName] = useState("Select Province");
  const [selectedDistrictName, setSelectedDistrictName] = useState("Select District");
  const [selectedWardName, setSelectedWardName] = useState("Select Ward");

  const [selectedProvinceCode, setSelectedProvinceCode] = useState(0);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(0);

  const [errors, setErrors] = useState({
    fullname: "",
    phone: "",
    address: "",
  });

  // Thêm trạng thái để theo dõi xem các field có ở trạng thái readonly hay không
  const [isReadonly, setIsReadonly] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Save");
  const [disabled,setDisabled] = useState(true);
  const [isPaymentCODSuccess,setIsPaymentCODSuccess] = useState(false);

  const UserLocalStorage = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchProfileUser = async () => {
    if (user) {
      const response = await api.get(`/accounts/profile/${user.sub}`);
      console.log("Profile Information",response.data);
      setProfile(response.data);
    }
  };

  useEffect(() => {
    UserLocalStorage();
  }, []);

  useEffect(() => {
      fetchProfileUser();
  }, [user]);

  useEffect(() => {
    console.log("ProfileAddress",profile.address);
    const addresspart = profile.address ? profile.address.split(",") : [];
    console.log("addresspart",addresspart);
    setAddressPart(addresspart);

    setSelectedProvinceName(addresspart[3]);
    setSelectedDistrictName(addresspart[2]);
    setSelectedWardName(addresspart[1]);
  }, [profile]);



  // Update order every time profile changes
  useEffect(() => {
    if (profile && user) {
      const orderCreate = {
        fullname: user.fullname || "", // Kiểm tra trường hợp fullname không có
        phone: profile.phone || "", // Kiểm tra trường hợp phone không có
        email: user.email || "",
        address: profile.address || "", // Giữ lại giá trị address
        eventTitle: ticket.eventTitle,
        quantity: quantity,
        price: ticket.price,
        totalAmount: quantity * ticket.price+ 15000,
        orderMethod: "COD",
      };
      setOrder(orderCreate);
    }
  }, [profile, user, ticket, quantity]); // Chạy khi profile, user, ticket hoặc address thay đổi

  const fetchProvinces = async () => {
    try {
      const response = await apiLocation.get("/");
      console.log("Provinces List", response.data.results);
      const provinceList = response.data.results;
      if (provinceList.length === 0) {
        provinceList = ["No Province Found"];
      }
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
      if (districtList.length === 0) {
        districtList = ["No District Found"];
      }
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
      if (wardList.length === 0) {
        wardList = ["No Ward Found"];
      }
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

  const handleWardsSelect = (wardName) => {
    setSelectedWardName(wardName);
  };

  const handleRadioChange = (e) => {
    setOrder({ ...order, orderMethod: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formSend = {
      fullname : order.fullname,
      phone: order.phone,
      address : order.address,
      email : order.email
    }
    // Nếu nút hiện tại là "Save", thì chuyển sang trạng thái readonly và thay đổi nhãn nút
    if (buttonLabel === "Save") {
      setIsReadonly(true);
      setButtonLabel("Update");
      const response = await api.put(`accounts/${user.sub}`,formSend);
      if(response.status === 200){
        toast.success("Saved successfully", {
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
      }
      setDisabled(false);
    } else {
      // Nếu nút hiện tại là "Update", chuyển các field về trạng thái không readonly
      setIsReadonly(false);
      setDisabled(true);
      setButtonLabel("Save");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);

    if(name === "address"){
      const locationForm = value + ","+ selectedWardName+ ","+ selectedDistrictName + "," + selectedProvinceName;
      setOrder((prevOrder) => ({ ...prevOrder, address: locationForm }));
    }

    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "Do not leave blank cells" }));
    } else if (name === "phone" && !confirmPhone(value)) {
      setErrors((prev) => ({ ...prev, [name]: "Phone number is incorrect" }));
    } else if (name === "address" && !confirmAddress(value)) {
        setErrors((prev) => ({ ...prev, [name]: "Address format is incorrect" }));
      } else if (value.length < 10) {
        setErrors((prev) => ({ ...prev, [name]: "Address must have at least 10 characters" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleCreateOrder = async () =>{
      // Kiểm tra thông tin trong phần Delivery Information
if (!order.fullname || !order.phone || !order.address || errors.fullname || errors.phone || errors.address) {
  toast.error("You have not filled in enough delivery information", {
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
    const orderCraete = {
      buyerId : user.id,
      sellerId : ticket.seller.id,
      ticketId : ticket.id,
      quantity : quantity,
      totalAmount : order.totalAmount,
      paymentStatus : "pending",
      orderStatus: "pending",
      orderMethod: order.orderMethod,
    }
    console.log("Vé của bố ở đây",ticket);
    console.log("Create order",orderCraete);
    try {
      const response = await api.post("orders/create", orderCraete);
      console.log("Response thanh toan binh thuong",response.status);
      const OrderCreated = response.data;
      if (response && response.status === 200) {
        toast.success("Order information received, Redirecting to payment page", {
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
      }
      if(orderCraete.orderMethod === "vnpay"){
        try {
          const response = await api.post("/vnpay/create-payment", {orderId : OrderCreated.id, amount: OrderCreated.totalAmount});
          console.log("Response VNPAY",response.data);
          const urlBank = response.data
          if(response.status === 200){
            window.location.href = urlBank;
          } 
        } catch (error) {
          toast.error(error.response.data, {
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
        }
      }else{
        setIsPaymentCODSuccess(true);
      }
    } catch (error) {
      toast.error(error.response.data, {
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
  }

  const handleHomeClick = () =>{
    setIsPaymentCODSuccess(false);
    navigate("/customer");
  }

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
    isPaymentCODSuccess ? (
      <div className={cx("body")}>
      <div className={cx("card")}>
    <div style={{borderRadius: "200px",height: "200px",width: "200px",background:"#F8FAF5",margin: "0 auto"}}>
      <i className={cx("checkmark")}>✓</i>
    </div>
      <h1 className={cx("success-text")}>Success</h1> 
      <p className={cx("success-payment-text")}>We received your purchase request;<br/> we'll be in touch shortly!</p>
      <Button variant="success" onClick={handleHomeClick}> Back </Button>
    </div>
    </div>
  ) : (
    <Container className="order-page">
      <ToastContainer/>
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Delivery Information</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group >
                  <Form.Label style={{ color: "red" }}>Fullname (Required) <span>{isReadonly ? <FaLock/> : <FaLockOpen/> }</span></Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Please type fullname"
                    name="fullname"
                    value={order.fullname}
                    isInvalid={errors.fullname}
                    isValid={!errors.fullname && order.fullname.length > 0}
                    onChange={handleInputChange}
                    readOnly={isReadonly} // Thêm thuộc tính readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullname}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group >
                  <Form.Label style={{ color: "red" }}>Phone (Required) <span>{isReadonly ? <FaLock/> : <FaLockOpen/> }</span></Form.Label>
                  <Form.Control
                    required
                    placeholder="Please type phone"
                    name="phone"
                    value={order.phone}
                    isInvalid={errors.phone}
                    isValid={!errors.phone && order.phone.length > 0}
                    onChange={handleInputChange}
                    readOnly={isReadonly} // Thêm thuộc tính readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group >
                  <Form.Label style={{ color: "red" }}>
                    Address (Required) (Do not re-enter Provinces, Districts, Wards in this box) <span>{isReadonly ? <FaLock/> : <FaLockOpen/> }</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Please type address"
                    name="address"
                    value={order.address}
                    isInvalid={errors.address}
                    isValid={!errors.address && order.address.length > 0}
                    onChange={handleInputChange}
                    readOnly={isReadonly} // Thêm thuộc tính readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">

              <Col sm="3"  style={{ marginRight: '30px' }} >
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
                    handleWardsSelect(selectedWard.ward_name);
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

                <Form.Group >
                  <Form.Label>Email <span><FaLock/></span></Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={order.email}
                    readOnly
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  {buttonLabel} {/* Hiển thị nhãn của nút */}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Select Payment Method</h3>
              <Form.Group controlId="orderMethod" className="radio-group">
                <div>
                  <Form.Check
                    type="radio"
                    name="orderMethod"
                    value="COD"
                    label="Cash On Delivery"
                    checked={order.orderMethod === "COD"}
                    onChange={handleRadioChange}
                  />

                  <Form.Check
                    type="radio"
                    name="order_method"
                    value="vnpay"
                    label="VNPAY"
                    checked={order.orderMethod === "vnpay"}
                    onChange={handleRadioChange}
                  />
                </div>
              </Form.Group>
              {disabled && <h6 style={{color : "red"}}>You must save delivery information before making payment</h6>}
              <Button variant="success" className="mt-3" block onClick={handleCreateOrder} disabled ={disabled}>
                Proceed to Payment
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h4>Order Summary</h4>
              <p>Ticket Title : {order.eventTitle}</p>
              <p>Price: {order.price.toLocaleString("vi-VN")} VND</p>
              <p>Quantity: {order.quantity}</p>
              <p>Shipping Fee: 15,000 VND</p>
              <h4>Total Amount: {order.totalAmount.toLocaleString("vi-VN")} VND</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>)
  );
};

export default OrderPage;
