import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const RevenueChart = ({revenue}) => {
  const [selectedYear, setSelectedYear] = useState('THIS YEAR'); 
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: selectedYear === 'THIS YEAR' ? 'This year' : 'Last year',
        data: selectedYear === 'THIS YEAR' 
          ? revenue.thisYear
          : revenue.lastYear, 
        backgroundColor: '#667eea', 
        borderRadius: 4, 
        barThickness: 10 
      }
    ]
  };
  

  const options = {
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false } 
    },
    scales: {
      x: {
        grid: {
          display: false 
        },barThickness: 10
      },
      y: {
        display: false, 
        beginAtZero: true 
      }
    }
  };

  return (
    <div style={{backgroundColor : "#ffffff",borderRadius : "5px"}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>TOTAL REVENUE</p> 
          <p style={{ fontSize: '1.5rem' }}>${revenue.money}</p> 
        </div>
        <DropdownButton id="dropdown-basic-button" title={selectedYear}>
          <Dropdown.Item onClick={() => setSelectedYear('THIS YEAR')}>THIS YEAR</Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedYear('LAST YEAR')}>LAST YEAR</Dropdown.Item>
        </DropdownButton>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '280px' }} >
      <Bar data={data} options={options} /> 
      </div>
    </div>
  );
};

export default RevenueChart;