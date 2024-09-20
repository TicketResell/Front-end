import { Navbar, NavDropdown, Nav, Container,Button } from "react-bootstrap";
import styles from "../NavBar/NavigationBar.module.scss";
import logo from "../../../assets/images/ticket-logo.png";
import classNames from "classnames/bind";

function NavigationBar() {
  const cx = classNames.bind(styles);
  return (
    <Navbar expand="lg" fixed="top" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="/" className={cx("navbar-brand")}>
          <img alt="" src={logo} width="100" height="100" />
          TICKETRESELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" style={{ color: "#fff" }}>
              Buổi hòa nhạc
            </Nav.Link>
            <Nav.Link href="#link" style={{ color: "#fff" }}>
              Thể thao
            </Nav.Link>
            <Nav.Link href="#link" style={{ color: "#fff" }}>
              Phim ảnh,Tranh
            </Nav.Link>
            <Nav.Link href="#link" style={{ color: "#fff" }}>
              Nhạc kịch
            </Nav.Link>
            <Nav.Link href="#link" style={{ color: "#fff" }}>
              Gia đình
            </Nav.Link>
            <Nav.Link href="#link" style={{ color: "#fff" }}>
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
