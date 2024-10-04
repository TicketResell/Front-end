import React from 'react';
import { Container, Row, Col, Card ,Image} from 'react-bootstrap';
import classNames from 'classnames/bind';
import styles from "./Categories.module.scss"

function Categories({categories}) {
  const cx = classNames.bind(styles);
    return (      
    <Container className={cx("category-grid")}>
        <Row>
          {categories.map((category, index) => (
            <Col key={index} xs={6} md={4} lg={3} className={cx("mb-4")}>
               <div className={cx("card")}>
                <Image                   
                  variant="top"
                  src={category.imgSrc}
                  alt={category.title}
                  className={cx("card-img")} 
                  />
                  </div>
                  <h1 className={cx("card-title","text-center")}>{category.title}</h1>
            </Col>
          ))}
        </Row>
      </Container>
      );
}

export default Categories;