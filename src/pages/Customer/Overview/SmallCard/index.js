import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { GrMoney } from "react-icons/gr"; //Revenue
import { PiChartLineUpBold, PiChartLineDownBold } from "react-icons/pi";
import { FaDollarSign } from "react-icons/fa6"; //Sales
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Filler } from 'chart.js';

// Đăng ký các thành phần cần thiết
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Filler);

export default function SmallCard ({types}){

  return (
    <Card style={{margin: "5px 0 5px 5px" ,height: "210px" }}>
      <Card.Body>
        <Container>
          <Row>
            <Col xs={2}>
            {types.name === "Revenue" ? (<GrMoney style={{ fontSize: '2rem', color: '#5e46ff' }} />) : (<FaDollarSign style={{ fontSize: '2rem', color: '#5e46ff' }} />) }
            </Col>
            <Col>
              <Card.Title>{types.name} this quarter</Card.Title>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
            <Col className="text-center">
              <h1 style={{ fontSize: "3rem" }}>{types.number.toLocaleString("vi-VN")} {types.name === "Revenue" ? "VND" : ""}</h1>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};
