import React from "react";
import classNames from "classnames/bind";
import styles from "./Categories.module.scss"; // Import SCSS mới
import crowd from "../../../assets/images/crowd-background.jpg";
import { Container, Row, Col, Card } from "react-bootstrap";

function Categories({ categories, clickCategory, clickAll }) {
  const cx = classNames.bind(styles);

  return (
    <Container className={cx("card-container")}>
      <Row>
        <div className={cx("wrapper")}>
          {categories.map((category) => (
            <Col key={category.id} xs={12} md={6} lg={3} className={cx("mb-4")}>
              <div className={cx("card")}>
                <img src={crowd} alt={category.name} />
                <div className={cx("info")}>
                  <h1>{category.name}</h1>
                  <p></p>
                  <button onClick={() => clickCategory(category.id)}>
                    View More
                  </button>
                </div>
              </div>
            </Col>
          ))}

          {/* "All Categories" as a Card */}
          <Col xs={12} md={6} lg={3} className={cx("mb-4")}>
            <div className={cx("card")} onClick={clickAll}>
              <img
                src="https://i.ibb.co/sVqtRrc/raffle-tickets-600x600.jpg"
                alt="All Categories"
              />
              <div className={cx("info")}>
                <h1>All Categories</h1>
                <p></p>
                <button className={cx("all-button")}>
                  View More
                </button>
              </div>
            </div>
          </Col>
        </div>
      </Row>
    </Container>
  );
}

export default Categories;
