import React, { useEffect, useState } from "react"; 
import { Navbar, Nav, Container, Button } from "react-bootstrap"; 
import classNames from "classnames/bind"; 
import styles from "./NavigationBar.module.scss"; 
import logo from "../../../assets/images/ticket-logo.png"; 
import { GoBell } from "react-icons/go"; 
import { TbLogout } from "react-icons/tb"; 
import Notification from "./Notification";
import api from "../../../config/axios"; 
import { useNavigate } from "react-router-dom"; 

function NavigationBar() {
  const cx = classNames.bind(styles); 
  const [signedIn, setSignedIn] = useState(false); 
  const [user, setUser] = useState(null); 
  const [showNofitication, setShowNofitication] = useState(false); 
  const [categories, setCategories] = useState([]); 
  const [logoutMessage, setLogoutMessage] = useState("");
  const [listNofitication, setListNofitication] = useState([]); 
  const navigate = useNavigate(); 

  const fetchUser = () => {
    const userLogin = JSON.parse(localStorage.getItem("user"));
    if (userLogin) {
      try {
        setUser(userLogin);
        setSignedIn(true);
      } catch (error) {
        console.error("No user found", error);
      }
    }
  };

  const fetchCategoryNav = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchListNotification = async (user) => {
    try {
      const response = await api.get(`/notifications/${user.id}`);
      console.log("List Notification",response.data);
      setListNofitication(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategoryNav();
  }, []);

  useEffect(() => {
    fetchListNotification(user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setSignedIn(false);
    setLogoutMessage("You have logged out successfully!"); 
    setShowNofitication(true); 
    navigate("/"); 

    setTimeout(() => {
      setShowNofitication(false);
    }, 3000);
  };

  const handleLogin = (event) => {
    event.preventDefault(); 
    navigate("/login");
  };

  const handleRegister = (event) => {
    event.preventDefault();
    navigate("/register");
  };

  const handleAboutus = (event) => {
    event.preventDefault();
    navigate("/aboutUs");
  }

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#c2d18a", borderRadius: "40px", margin: '20px' }} className="navbar">
      <Container fluid className={cx("contain")}>
        <Navbar.Brand href="/" className={cx("navbar-brand")} style={{ marginLeft: "7rem" }}>
          TICKETRESELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{ marginLeft: "40px" }}>
          <Nav className="me-auto">
            {categories.map(category => (
              <Nav.Link key={category.id} style={{ fontSize: "20px", color: "#000", marginRight: "40px" }}>
                {category.name}
              </Nav.Link>
            ))}
            <Nav.Link href="aboutUs" style={{ fontSize: "20px", color: "#000", marginRight: "40px" }} onclick={handleAboutus}>
              About Us
            </Nav.Link>
            <Nav.Link href="categories" style={{ fontSize: "20px", color: "#000", marginRight: "40px" }}>
              Categories
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