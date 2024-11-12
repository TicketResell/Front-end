import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { GrMoney } from "react-icons/gr"; //Revenue
import { PiChartLineUpBold, PiChartLineDownBold } from "react-icons/pi";
import { FaDollarSign } from "react-icons/fa6"; //Sales
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Filler } from 'chart.js';

// Đăng ký các thành phần cần thiết
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Filler);

export default function SmallCard ({types}){

  const chartData = {
    labels: ['', '', ''], 
    datasets: [
      {
        data: types.status === "up" ? ( [null, 75, 100]) : ([100,75,null]) ,
      fill: true,
      borderColor: types.status === 'up' ? '#198754' : '#F04438',
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
      pointBorderColor: types.status === 'up' ? '#198754' : '#F04438',
      pointRadius: 6,
      backgroundColor: types.status === 'up' 
        ? 'rgba(25, 135, 84, 0.1)' 
        : 'rgba(240, 68, 56, 0.1)'
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false // Ẩn legend
      }
    },
    scales: {
      x: {
        display: false // Ẩn trục x
      },
      y: {
        display: false // Ẩn trục y
      }
    },
    maintainAspectRatio: false // Cho phép chart tự điều chỉnh kích thước
  };

  return (
    <Card style={{margin:"5px", borderRadius:"20px"}}>
      <Card.Body>
        <Container>
          <Row>
            <Col xs={2}>
            {types.name === "Revenue" ? (<GrMoney style={{ fontSize: '2rem', color: '#5e46ff' }} />) : (<FaDollarSign style={{ fontSize: '2rem', color: '#5e46ff' }} />) }
            </Col>
            <Col>
              <Card.Title>{types.name} this week</Card.Title>
            </Col>
          </Row>
          <Row>
            <Col>
              <h1>{types.name === "Revenue" ? "" : ""}{types.number}</h1>
              <p style={{ color: types.status === "up" ? '#17B26A' : '#F04438' }}>
                {types.status === "up" ? (<PiChartLineUpBold />):(<PiChartLineDownBold/>) } {types.percent}% vs last week
              </p>
            </Col>
            <Col xs={4}>
              <div style={{ height: '50px' }}> 
                <Line data={chartData} options={chartOptions} style={{height: '50px'}}/> 
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};
