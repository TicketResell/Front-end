import { Navbar, Nav, Container,Button } from "react-bootstrap";
import styles from "../NavBar/NavigationBar.module.scss";
import logo from "../../../assets/images/ticket-logo.png";
import classNames from "classnames/bind";
import { GoBell } from "react-icons/go";
import { TbLogout } from "react-icons/tb";
import { useEffect, useState } from "react";
import Notification from "./Nofitication";
import api from "../../../config";

function NavigationBar() {
  const cx = classNames.bind(styles);
  const [signedIn,setSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showNofitication,setShowNofitication] = useState(false)

  const [categories,setCategories] = useState([])
  /*const [listNofitication,setListNofitication] = useState([])*/
/*const fetchListNotification = async ()=>{
  const response = await api.get("nofiticationList");
  setListNofitication(response.data)
}*/
const fetchUser = () =>{
  const userLogin = JSON.parse(localStorage.getItem("user"));
  if(userLogin){
    try {
      //fetchListNotification();
      setUser(userLogin);
      setSignedIn(true);
    } catch (error) {
      console.error("Không có người dùng", error);
    }
  }
}
const fetchCategoryNav = async () =>{
    const response = await api.get("/categories")
    setCategories(response.data);
  }

  
  useEffect(()=>{
    fetchUser();
    fetchCategoryNav();
  },[])

  const handleLogout = ()=>{
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setSignedIn(false);
  }
    // Mẫu thông báo
    const listNofitication = [
      "Thông báo 1: Bạn đã nhận được một vé mới.",
      "Thông báo 2: Vé của bạn đã được xác nhận.",
      "Thông báo 3: Sự kiện bạn quan tâm sẽ diễn ra trong 3 ngày tới.",
    ];
  return (
    <Navbar expand="lg" fixed="top" data-bs-theme="dark" style={{backgroundColor: " rgba(0, 0, 0, 0.4)"}} className="navbar">
      <Container fluid className={cx("contain")}>
        <Navbar.Brand href="/" className={cx("navbar-brand")}>
          <img alt="" src={logo} width="200" height="150" style={{paddingBottom: "40px", objectFit: "cover"}}/>
          TICKETRESELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{ marginLeft: "40px" }}>
          <Nav className="me-auto">
            {categories.map(category =>(
            <Nav.Link key={category.id} style={{ fontSize:"20px",color: "#fff",marginRight: "40px", fontFamily : "bold"}}>
              {category.name}
            </Nav.Link>
            ))}
            <Nav.Link href="aboutUs" style={{ fontSize:"20px",color: "#fff" ,marginRight: "40px",fontFamily : "bold"}}>
              About Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {signedIn ? (          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outline-light" style={{ marginRight: "10px" }} title="Notification" onClick={()=>(setShowNofitication(!showNofitication))}>
              <GoBell /> 
            </Button>
            {showNofitication && (<Notification listNofitication={listNofitication}/>)}
            <Button variant="outline-light" style={{ marginRight: "10px" }} href="/customer">
              <img src={user.user_image} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <span style={{ marginLeft: '10px', color: '#fff' }}>{user.fullname}</span>
            </Button>
            <Button variant="outline-light" style={{ marginRight: "10px" }} onClick={handleLogout}>
            <span style={{ marginLeft: '10px', color: '#fff' }} >Logout</span>
            <TbLogout /> 
            </Button>
          </div>):(
            <>
          <Button variant="outline-light" href="register" style={{marginRight: "10px"}}>Register</Button>
        <Button variant="outline-light" href="login">Login</Button>
        </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
