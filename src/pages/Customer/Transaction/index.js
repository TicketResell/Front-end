import React, { useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Pagination from '../../../layouts/components/Pagination';

function Orders({listOrders}) {
  const [ordersPage,setOrdersPage] = useState(0);
  const itemsPerPage = 10;
    return (
        <MDBTable >
      <MDBTableHead >
        <tr>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >id</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >buyerId</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >sellerId</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >quantity</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >totalAmount</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >serviceFee</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >paymentStatus</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >orderStatus</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >orderMethod</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {listOrders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.buyerId}</td>
            <td>
              {order.sellerId}
            </td>
            <td>{order.ticketId}</td>
            <td>{order.quantity}</td>
            <td>{order.totalAmount}</td>
            <td>{order.serviceFee}</td>
            <td>{order.paymentStatus}</td>
            <td>{order.orderStatus}</td>
            <td>{order.orderMethod}</td>
          </tr>
        ))}
      </MDBTableBody>
      <Pagination
            currentPage={ordersPage}
            pageCount={Math.ceil(listOrders.length / itemsPerPage)}
            onPageChange={(selectedPage) => setOrdersPage(selectedPage)}
          />
    </MDBTable>
    );
}

export default Orders;