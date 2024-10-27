import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from "./Notification.module.scss"

function Notification({listNofitication}){
  const cx = classNames.bind(styles)  
  const notificationRef = useRef(null);

  // Đóng thông báo khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
        <div ref={listNofitication} className={cx("notificationBox")}>
          <ul style={{ listStyleType: 'none', padding: '10px', margin: '0' }}>
            {listNofitication.map((notification, index) => (
              <li key={index} className = {cx("notificationItem")}>{notification}</li>
            ))}
          </ul>
        </div>
    </div>
  );
};
export default Notification;
