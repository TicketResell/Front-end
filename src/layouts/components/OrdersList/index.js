import React, { useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import classNames from "classnames/bind";
import styles from "./OrdersToday.module.scss";
import Pagination from "../Pagination";
import { Button } from "react-bootstrap";
import api from "../../../config/axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';

function OrdersList({ listOrders = [], isOrderBuyer }) {
  const cx = classNames.bind(styles);
  console.log("List in Orders", listOrders);
  const [orderPage, setOrderPage] = useState(0);
  const itemsPerPage = 10;
  const offset = orderPage * itemsPerPage; // Vị trí bắt đầu của dữ liệu trên trang hiện tại
  const currentOrders = listOrders.slice(offset, offset + itemsPerPage); // Lấy ra dữ liệu của trang hiện tại

  const handleShipped = async (id)=>{
    const response = await api.put(`/orders/update-order-status/${id}`,{order_status : "shipping"});
    console.log("Response Shipping",response.data);
    if(response.status === 200){
      toast.success('Response is sent', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
    }
  }

  return (
    <div className="container">
      <ToastContainer/>
      <div className="row">
        <h1>{isOrderBuyer ? "Your purchase order" : "Your sales order"}</h1>
      </div>
      <MDBTable>
        <MDBTableHead>
          <tr>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              ID
            </th>
            {isOrderBuyer ? (
              <th
                scope="col"
                style={{ backgroundColor: "#8e65ff", color: "white" }}
                className={cx(".custom-tiltle")}
              >
                Seller Name
              </th>
            ) : (
              <th
                scope="col"
                style={{ backgroundColor: "#8e65ff", color: "white" }}
                className={cx(".custom-tiltle")}
              >
                Buyer Name
              </th>
            )}
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Ticket Name
            </th>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Quantity
            </th>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Total Amount
            </th>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Service Fee
            </th>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Payment Status
            </th>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Order Status
            </th>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Order Method
            </th>
            <th
              scope="col"
              style={{ backgroundColor: "#8e65ff", color: "white" }}
              className={cx(".custom-tiltle")}
            >
              Action
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {listOrders && listOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{offset + index + 1}</td>
                {/* Hiển thị tên seller hoặc buyer thay vì ID */}
                {isOrderBuyer ? <td>{order.sellerName}</td> : <td>{order.buyerName}</td>}
                {/* Hiển thị tên ticket thay vì ID */}
                <td>{order.ticketName}</td>
                <td>{order.quantity}</td>
                <td>{order.totalAmount}</td>
                <td>{order.serviceFee}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.orderStatus}</td>
                <td>{order.orderMethod}</td>
                {isOrderBuyer ? (
                  <td>
                    <Button
                      className={cx("btn-response")}
                      variant="outline-success"
                    >
                      Goods received
                    </Button>
                    <Button
                      className={cx("btn-complaints")}
                      variant="outline-danger"
                    >
                      Complaints
                    </Button>
                  </td>
                ) : (
                  <td>
                    <Button
                      className={cx("btn-response")}
                      variant={order.orderMethod === "COD" ? "outline-dark" :"outline-success"}
                      onClick={() => handleShipped(order.id)}
                     disabled = {order.orderMethod === "COD" ? true :false}
                    >
                     Confirm Shipped
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No orders found</td>
            </tr>
          )}
          <Pagination
            currentPage={orderPage}
            pageCount={Math.ceil(listOrders.length / itemsPerPage)}
            onPageChange={(selectedPage) => setOrderPage(selectedPage)}
          />
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}

export default OrdersList;
