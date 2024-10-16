import React, { useState } from 'react';
import './index.scss';

const OrderPage = () => {
  const [order, setOrder] = useState({
    paymentID: 'PAY123456789',
    eventTitle: 'Concert of the Century',
    quantity: 2,
    salePrice: 100.0, // price per ticket
    buyer: {
      username: 'johndoe123',
      phone: '0903500680',
    }
  });

  const totalPrice = order.quantity * order.salePrice;

  const handleConfirmOrder = () => {
    // Code for handling order confirmation
    console.log("Order confirmed:", order);
    alert('Order confirmed! Payment ID: ' + order.paymentID);
  };

  return (
    <div className="order-page-container">
      <h1>Order Summary</h1>
      <div className="order-details">
        <div className="order-field">
          <label>Payment ID:</label>
          <span>{order.paymentID}</span>
        </div>
        <div className="order-field">
          <label>Event Title:</label>
          <span>{order.eventTitle}</span>
        </div>
        <div className="order-field">
          <label>Quantity:</label>
          <span>{order.quantity}</span>
        </div>
        <div className="order-field">
          <label>Sale Price (per ticket):</label>
          <span>${order.salePrice.toFixed(2)}</span>
        </div>
        <div className="order-field">
          <label>Total Price:</label>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="order-field">
          <label>Buyer Username:</label>
          <span>{order.buyer.username}</span>
        </div>
        <div className="order-field">
          <label>Buyer Phone:</label>
          <span>{order.buyer.phone}</span>
        </div>
      </div>
      <button className="confirm-order-btn" onClick={handleConfirmOrder}>
        Confirm Order
      </button>
    </div>
  );
};

export default OrderPage;
