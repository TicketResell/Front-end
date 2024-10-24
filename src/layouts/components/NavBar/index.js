import React, { useEffect, useState } from "react"; 
import { Navbar, Nav, Container, Button } from "react-bootstrap"; 
import classNames from "classnames/bind"; 
import styles from "./NavigationBar.module.scss"; 
import logo from "../../../assets/images/ticket-logo.png"; 
import { GoBell } from "react-icons/go"; 
import { TbLogout } from "react-icons/tb"; 
import Notification from "./Nofitication"; 
import api from "../../../config/axios"; 
import { useNavigate } from "react-router-dom"; // Cập nhật từ useHistory thành useNavigate

function NavigationBar() {
  const cx = classNames.bind(styles); 
  const [signedIn, setSignedIn] = useState(false); 
  const [user, setUser] = useState(null); 
  const [showNofitication, setShowNofitication] = useState(false); 
  const [categories, setCategories] = useState([]); 
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate(); // Sử dụng useNavigate

  const fetchUser = () => {
    const userLogin = JSON.parse(localStorage.getItem("user"));
    if (userLogin) {
      try {
        setUser(userLogin);
        setSignedIn(true);
      } catch (error) {
        console.error("Không có người dùng", error);
      }
    }
  };

  const fetchCategoryNav = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  useEffect(() => {
    fetchUser();
    fetchCategoryNav();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setSignedIn(false);
    setLogoutMessage("Bạn đã đăng xuất thành công!"); // Set logout message
    setShowNofitication(true); // Show notification
    navigate("/"); // Redirect to home after logging out

    // Automatically hide notification after 3 seconds
    setTimeout(() => {
      setShowNofitication(false);
    }, 3000);
  };

  // Cập nhật hàm handleLogin để sử dụng useNavigate
  const handleLogin = (event) => {
    event.preventDefault(); 
    navigate("/login"); // Sử dụng navigate thay vì history.push
  };

  // Thêm hàm handleRegister
  const handleRegister = (event) => {
    event.preventDefault();
    navigate("/register"); // Sử dụng navigate để điều hướng đến trang đăng ký
  };

  const listNofitication = [
    "Thông báo 1: Bạn đã nhận được một vé mới.",
    "Thông báo 2: Vé của bạn đã được xác nhận.",
    "Thông báo 3: Sự kiện bạn quan tâm sẽ diễn ra trong 3 ngày tới.",
  ];

  return (
    <Navbar expand="lg" fixed="top" data-bs-theme="dark" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} className="navbar">
      <Container fluid className={cx("contain")}>
        <Navbar.Brand href="/" className={cx("navbar-brand")}>
          <img alt="Logo" src={logo} width="200" height="150" style={{ paddingBottom: "40px", objectFit: "cover" }} />
          TICKETRESELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{ marginLeft: "40px" }}>
          <Nav className="me-auto">
            {categories.map((category) => (
              <Nav.Link key={category.id} style={{ fontSize: "20px", color: "#fff", marginRight: "40px", fontFamily: "bold" }}>
                {category.name}
              </Nav.Link>
            ))}
            <Nav.Link href="aboutUs" style={{ fontSize: "20px", color: "#fff", marginRight: "40px", fontFamily: "bold" }}>
              About Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {signedIn ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button variant="outline-light" style={{ marginRight: "10px" }} title="Notification" onClick={() => setShowNofitication(!showNofitication)}>
              <GoBell />
            </Button>
            {showNofitication && <Notification listNofitication={listNofitication} />}
            <Button variant="outline-light" className={cx("custom-button")} style={{ marginRight: "10px" }} href={user.role === "user" ? "/customer" : user.role === "staff" ? "/staff" : "/admin"}>
              <img src={user.user_image} alt="User" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
              <span style={{ marginLeft: "10px", color: "#fff" }}>{user.fullname}</span>
            </Button>
            <Button variant="outline-light" className={cx("custom-button")} style={{ marginRight: "10px" }} onClick={handleLogout}>
              <span style={{ marginLeft: "10px", color: "#fff" }}>Logout</span>
              <TbLogout />
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline-light" style={{ marginRight: "10px" }} onClick={handleRegister}>
              Register
            </Button>
            <Button variant="outline-light" onClick={handleLogin}>
              Login
            </Button>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
