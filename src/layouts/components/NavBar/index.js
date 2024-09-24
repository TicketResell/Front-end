import { Navbar, Nav, Container,Button } from "react-bootstrap";
import styles from "../NavBar/NavigationBar.module.scss";
import logo from "../../../assets/images/ticket-logo.png";
import classNames from "classnames/bind";

function NavigationBar() {
  const cx = classNames.bind(styles);
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
        <Button variant="outline-light" href="register" style={{marginRight: "10px"}}>Đăng kí</Button>{' '}
        <Button variant="outline-light" href="login">Đăng nhập</Button>{' '}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
