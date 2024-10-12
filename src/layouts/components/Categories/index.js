import React from 'react';
import { Container, Row, Col, Card ,Image, Button} from 'react-bootstrap';
import classNames from 'classnames/bind';
import styles from "./Categories.module.scss"

function Categories({categories,clickCategory,clickAll}) {
  const cx = classNames.bind(styles);
  
    return (      
    <Container className={cx("category-grid")}>
        <Row>
          {categories.map((category) => (
            <Col key={category.id} xs={6} md={4} lg={3} className={cx("mb-4")}>
               <div>
                  <Button variant="outline-dark"  onClick={() => clickCategory(category.id)} >{category.name}</Button>
                </div>
            </Col>
          ))}
            <Button variant="outline-dark"  onClick={() => clickAll()} >All</Button>
        </Row>
      </Container>
      );
}

export default Categories;