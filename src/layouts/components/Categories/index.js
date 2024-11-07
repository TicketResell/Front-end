import React from "react";
import classNames from "classnames/bind";
import styles from "./Categories.module.scss"; // Import SCSS mới
import crowd from "../../../assets/images/crowd-background.jpg";
import { Container, Row, Col, Card } from "react-bootstrap";
import allCategoriesImg from "../../../assets/images/pixelcut-export (1).jpeg"

function Categories({ categories, clickCategory, clickAll }) {
  const cx = classNames.bind(styles);

  return (
    <Container className={cx("card-container")} fluid>
      <Row>
        <div className={cx("wrapper")}>
          {categories.map((category) => (
            <Col key={category.id} xs={12} md={6} lg={3} className={cx("mb-4")}>
              <div className={cx("card")}>
                <img src={category.image} alt={category.name} />
                <div className={cx("info")}>
                  <h1 style={{color : "white"}}>{category.name}</h1>
                  <p></p>
                  <button onClick={() => clickCategory(category.id)}>
                    View More
                  </button>
                </div>
              </div>
            </Col>
          ))}
        </div>
        {/* "All Categories" as a Card */}
        <Row>
          <div className={cx("card")} onClick={clickAll}>
            <img
              src={allCategoriesImg}
              alt="All Categories"
            />
            <div className={cx("info")}>
              <h1 style={{color : "white"}} >All Categories</h1>
              <p></p>
              <button className={cx("all-button")}>View More</button>
            </div>
          </div>
        </Row>
      </Row>
    </Container>
  );
}

export default Categories;
