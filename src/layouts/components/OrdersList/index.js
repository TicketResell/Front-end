import React, { useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import classNames from 'classnames/bind';
import styles from "./OrdersToday.module.scss"
import Pagination from '../Pagination';

function OrdersList({ listOrders = [] }) {
    const cx = classNames.bind(styles);
    console.log("List in Orders",listOrders);
    const [orderPage,setOrderPage] = useState(0);
    const itemsPerPage = 5;
  return (
    <MDBTable >
      <MDBTableHead >
        <tr>
        <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>id</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>buyerId</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>sellerId</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>ticketId</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>quantity</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>totalAmount</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>serviceFee</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>paymentStatus</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>orderStatus</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} classNames = {cx(".custom-tiltle")}>orderMethod</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {listOrders && listOrders.length > 0 ? (listOrders.map((order,index) => (
          <tr key={order.id}>
            <td>{index+1}</td>
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
        ))) : (<p>No orders found</p>)}
      </MDBTableBody>
      <Pagination
            currentPage={orderPage}
            pageCount={Math.ceil(listOrders.length / itemsPerPage)}
            onPageChange={(selectedPage) => setOrderPage(selectedPage)}
          />
    </MDBTable>
  );
}

export default OrdersList;
