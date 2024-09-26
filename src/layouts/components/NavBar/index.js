import { Navbar, Nav, Container,Button } from "react-bootstrap";
import styles from "../NavBar/NavigationBar.module.scss";
import logo from "../../../assets/images/ticket-logo.png";
import classNames from "classnames/bind";
import { GoBell,GoGear } from "react-icons/go";
import { useEffect, useState } from "react";

function NavigationBar() {
  const cx = classNames.bind(styles);
  const [signedIn,setSignedIn] = useState(false);
  useEffect(()=>{
    const user = localStorage.getItem("user");
    setSignedIn(user);
  },[])
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
            <Nav.Link href="#home" style={{ fontSize:"20px",color: "#fff",marginRight: "40px", fontFamily : "bold"}}>
              Buổi hòa nhạc
            </Nav.Link>
            <Nav.Link href="#link" style={{ fontSize:"20px",color: "#fff" ,marginRight: "40px",fontFamily : "bold"}}>
              Thể thao
            </Nav.Link>
            <Nav.Link href="#link" style={{ fontSize:"20px",color: "#fff" ,marginRight: "40px",fontFamily : "bold"}}>
              Phim ảnh
            </Nav.Link>
            <Nav.Link href="#link" style={{ fontSize:"20px",color: "#fff" ,marginRight: "40px",fontFamily : "bold"}}>
              Nhạc kịch
            </Nav.Link>
            <Nav.Link href="#link" style={{ fontSize:"20px",color: "#fff" ,marginRight: "40px",fontFamily : "bold"}}>
              Gia đình
            </Nav.Link>
            <Nav.Link href="#link" style={{ fontSize:"20px",color: "#fff" ,marginRight: "40px",fontFamily : "bold"}}>
              Giới thiệu
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {signedIn ? (          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outline-light" style={{ marginRight: "10px" }}>
              <GoGear />
            </Button>
            <Button variant="outline-light" style={{ marginRight: "10px" }}>
              <GoBell /> 
            </Button>
            <Button variant="outline-light" style={{ marginRight: "10px" }}>
              <img src="path_to_user_image" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <span style={{ marginLeft: '10px', color: '#fff' }}>UserName</span>
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
