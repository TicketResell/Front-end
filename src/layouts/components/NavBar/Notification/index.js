import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from "./Notification.module.scss";
import api from '../../../../config/axios'; // Import your configured Axios instance

function Notification() {
  const cx = classNames.bind(styles);
  const notificationRef = useRef(null);
  const [listNotification, setListNotification] = useState([]);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setListNotification(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      // Remove the deleted notification from the state
      setListNotification(listNotification.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Close the notification box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setListNotification([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={notificationRef} className={cx("notificationBox")}>
        <ul style={{ listStyleType: 'none', padding: '10px', margin: '0' }}>
          {listNotification.map((notification) => (
            <li key={notification.id} className={cx("notificationItem")}>
              <strong>{notification.title}</strong>

              <p>{notification.message}</p>
              <p style={{ color: "#aaa" }}>
                {notification.createdDate ? notification.createdDate.split("T")[0] : "No date available"}
              </p>
              <button onClick={() => handleDeleteNotification(notification.id)} style={{ color: "red" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default Notification;
