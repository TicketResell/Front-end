import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import classNames from 'classnames/bind';
import styles from "./OrdersToday.module.scss"

function OrdersToday({ listOrder }) {
    const cx = classNames.bind(styles);
  return (
    <MDBTable >
      <MDBTableHead >
        <tr>
          <th scope="col" className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}}  >OrderID</th>
          <th scope="col"className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}} >BuyerID</th>
          <th scope="col"className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}} >TicketID</th>
          <th scope="col"className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}} >OverDate</th>
          <th scope="col"className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}} >PaymentID</th>
          <th scope="col"className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}} >Order Method</th>
          <th scope="col"className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}} >TotalAmount</th>
          <th scope="col"className={cx('custom-title')} style={{backgroundColor : "#8e65ff",color : "white"}} >Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {listOrder.map((order) => (
          <tr key={order.id}>
            <td>{order.orderID}</td>
            <td>
              {order.buyerID}
            </td>
            <td>{order.ticketID}</td>
            <td>{order.orderDate}</td>
            <td>{order.paymentID}</td>
            <td>{order.orderMethod}</td>
            <td>{order.totalAmount}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default OrdersToday;
