import React from "react";
import { Carousel, Row, Col } from "react-bootstrap";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import crowd_background from "../../../assets/images/vuconcert.jpg";
import movie_background from "../../../assets/images/movie-background.jpg";
import sport_background from "../../../assets/images/sport-background.png";
import NavigationBar from "../NavBar";
function Header() {
  const cx = classNames.bind(styles);
  return (
    <>
      <NavigationBar />
      <div className={cx("content")}>
        <section style={{ padding:'2rem'}}>
          <Row>
            <Col xs={12} md={5} className="mb-4">
              <Carousel interval={3000} controls={false} indicators={true} pause="hover">
                <Carousel.Item>
                  <div
                    className={cx("img-slides")}
                    style={{
                      backgroundImage: `url('https://i.pinimg.com/enabled/564x/a9/00/8d/a9008d702f734a3ca67eeb2bc25a1b6c.jpg')`,
                    }}
                  ></div>

                </Carousel.Item>

                <Carousel.Item>
                  <div
                    className={cx("img-slides")}
                    style={{
                      backgroundImage: `url('https://i.pinimg.com/enabled/564x/eb/2f/ce/eb2fce16d6839837c9b0be0ef7306c8e.jpg')`,
                    }}
                  ></div>

                </Carousel.Item>
                <Carousel.Item>
                  <div
                    className={cx("img-slides")}
                    style={{
                      backgroundImage: `url('https://i.pinimg.com/enabled/564x/e2/b4/d4/e2b4d4ba00621bd7a042727ef2fa60ba.jpg')`,
                    }}
                  ></div>

                </Carousel.Item>
                <Carousel.Item>
                  <div
                    className={cx("img-slides")}
                    style={{
                      backgroundImage: `url('https://i.pinimg.com/enabled/564x/0a/b6/8b/0ab68b57ffc459089f8745434e120864.jpg')`,
                    }}
                  ></div>

                </Carousel.Item>
              </Carousel></Col>
            <Col xs={12} md={7} className="mb-4 d-flex flex-column">
              <div
                className={cx("img-slides")}
                style={{
                  backgroundImage: `url('https://i.pinimg.com/736x/f4/79/e4/f479e4e9dfab25e1b4b30bf49e961ca0.jpg')`,
                }}
              ></div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4} className="mb-4">
            <div
                className={cx("img-slides")}
                style={{
                  backgroundImage: `url('https://i.pinimg.com/enabled/564x/e5/a8/68/e5a86896ab14462175ea9d308fe91e6f.jpg')`,
                }}
              ></div>
             </Col>
            <Col xs={12} md={4} className="mb-4 d-flex flex-column">
              <div
                className={cx("img-slides")}
                style={{
                  backgroundImage: `url('https://i.pinimg.com/enabled/564x/7b/54/08/7b540861f36a1feb9e7f537024ab151e.jpg')`,
                }}
              ></div>
            </Col>
            <Col xs={12} md={4} className="mb-4 d-flex flex-column">
              <div
                className={cx("img-slides")}
                style={{
                  backgroundImage: `url('https://i.pinimg.com/enabled/564x/a7/03/90/a7039087bb901ccef5d27e7ae7a01e23.jpg')`,
                }}
              ></div>
            </Col>
          </Row>
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
        </section>
      </div>
    </>
  );
}

export default Header;
