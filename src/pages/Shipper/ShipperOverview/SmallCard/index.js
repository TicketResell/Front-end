import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { MdLocalShipping } from "react-icons/md";
import { RiEmotionUnhappyLine } from "react-icons/ri";


export default function SmallCard ({types}){

  return (
    <Card style={{margin: "5px 0 5px 5px"  }}>
      <Card.Body>
        <Container>
          <Row>
            <Col xs={2}>
            {types.name === "Shipping Count" ? (<MdLocalShipping style={{ fontSize: '2rem', color: '#5e46ff' }} />) : (<RiEmotionUnhappyLine style={{ fontSize: '2rem', color: '#5e46ff' }} />)}
            </Col>
            <Col>
              <Card.Title>{types.name}</Card.Title>
            </Col>
          </Row>
          <Row>
            <Col>
              <h1 style={{marginTop : "40px"}}>{types.number}</h1>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};
