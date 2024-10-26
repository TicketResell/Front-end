import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { Container,Row,Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./Footer.module.scss"; 

function Footer() {
  const cx = classNames.bind(styles);
  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={6} className="mb-4">
          <div
            className={cx("img-slides")}
            style={{
              backgroundImage: `url('https://i.pinimg.com/736x/4b/f6/f8/4bf6f865d36390715e102632051c36f3.jpg')`,
            }}
          ></div>
        </Col>
        <Col xs={12} md={6} className="mb-4 d-flex flex-column">
          <div
            className={cx("img-slides")}
            style={{
              backgroundImage: `url('https://i.pinimg.com/enabled/564x/37/5f/06/375f0625ee6f420fe8cb8792d5cd1281.jpg')`,
            }}
          ></div>
        </Col>
      </Row>
      <Row>
      <MDBFooter
        className="text-center text-lg-start text-white"
        style={{ backgroundColor: "#1c2230" }}
      >
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Kết nối với chúng tôi trên các mạng xã hội:</span>
          </div>
          <div>
            <a
              href="https://www.facebook.com/ticketresell.2024/"
              className="me-4 text-reset"
            >
              <MDBIcon fab icon="facebook-f" />
            </a>
            <a href="#" className="me-4 text-reset">
              <MDBIcon fab icon="instagram" />
            </a>
            <a href="#" className="me-4 text-reset">
              <MDBIcon fab icon="tiktok" />
            </a>
            <a href="#" className="me-4 text-reset">
              <MDBIcon fab icon="linkedin" />
            </a>
          </div>
        </section>

        <section className="">
          <MDBContainer className="text-center text-md-start mt-5">
            <MDBRow className="mt-3">
              <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <MDBIcon icon="ticket-alt" className="me-3" />
                  TicketResell
                </h6>
                <p>
                  Với sứ mệnh truyền tải những nội dung sự kiện và tạo điều kiện
                  kết nối giữa người mua và người bán vé.
                </p>
              </MDBCol>

              <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  Liên kết hữu ích
                </h6>
                <p>
                  <a href="#" className="text-reset">
                    Điều khoản sử dụng
                  </a>
                </p>
                <p>
                  <a href="#" className="text-reset">
                    Chính sách bảo mật
                  </a>
                </p>
                <p>
                  <a href="#" className="text-reset">
                    Trợ giúp
                  </a>
                </p>
              </MDBCol>

              <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                <p>
                  <MDBIcon icon="home" className="me-2" />
                  TP. Hồ Chí Minh, Việt Nam
                </p>
                <p>
                  <MDBIcon icon="envelope" className="me-3" />
                  support@ticketresell.vn
                </p>
                <p>
                  <MDBIcon icon="phone" className="me-3" /> +84 123 456 789
                </p>
                <p>
                  <MDBIcon icon="print" className="me-3" /> +84 987 654 321
                </p>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>

        <div
          className="text-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © 2024 Bản quyền:
          <a className="text-reset fw-bold" href="/">
            TicketResell.vn
          </a>
        </div>
      </MDBFooter>
      </Row>
    </Container>
  );
}

export default Footer;
