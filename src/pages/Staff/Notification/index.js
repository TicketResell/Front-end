import React, { useEffect, useState } from "react";
import { Table, Container, Form, Button, Alert, Modal, Dropdown , DropdownButton  } from "react-bootstrap";
import styles from "./Notification.module.scss";
import classNames from "classnames/bind";
import api from "../../../config/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { faPray } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userNames,setUserNames] = useState("");
  const [selectedUserName,setSelectedUserName] = useState("Select UserName");
  const [formData,setFormDate] = useState({
    title : "",
    message : "",
    userId: null,
  })
  const fetchNotification = async () => {
    try {
      const response = await api.get("/notifications"); // Get all feedback
      console.log("Notification response", response.data);
      setNotifications(response.data);
    } catch (err) {
      setError("Could not retrieve notification. Please try again later.");
    }
  };

  const fetchUserNotification = async () => {
    try {
      const response = await api.get("/admin/view-accounts"); // Get all feedback
      console.log("Notification response", response.data);
      setUserNames(response.data);
    } catch (err) {
      setError("Could not retrieve userName. Please try again later.");
    }
  };

  // Fetch feedback from backend on component mount
  useEffect(() => {
    fetchNotification();
  }, [showCreateModal]);

  useEffect(() => {
    fetchUserNotification();
  }, [showCreateModal]);

  // Handle feedback response submission by staff
  const handleDelete = async (notificationId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa vé này không?")
    if (confirmDelete) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      if (response.status === 200) {
        toast.success("Delete notification successfully", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      }
      fetchNotification();
    } catch (err) {
      setError("Failed to send the response. Please try again.");
    }
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    console.log("FormDataCreate",formData);
    if(!formData.title || !formData.message || selectedUserName === "Select UserName" ){
        toast.error("Please complete the notification creation form", {
            position: "top-center",
            autoClose: 5000,
            theme: "light",
            transition: Bounce,
          });
          return;
    }

    try {
      const response = await api.post(`/notifications`, formData);
      if (response.status === 200) {
        toast.success("Create Notification successfully", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      }
      setShowCreateModal(false);
    } catch (err) {
      toast.error("Error Form", {
            position: "top-center",
            autoClose: 5000,
            theme: "light",
            transition: Bounce,
          });
    }
  };

  const handleUserSelect = async (id, userName) =>{
    setFormDate(prevFormData =>({...prevFormData,userId : id}));
    setSelectedUserName(userName);
  };

  return (
    <Container className={cx("feedback-management-container", "my-4")}>
      <ToastContainer />
      <h3 className={cx("feedback-management-title")}>
        User Notification Management
      </h3>
      <Button variant="success" onClick={() => setShowCreateModal(true) }>
        Create
      </Button>
      {error && (
        <Alert
          variant="danger"
          className={cx("alert-danger")}
          onClose={() => setError("")}
          dismissible
        >
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Alert variant="info" className={cx("alert-info")}>
          No Notification available at the moment.
        </Alert>
      ) : (
        <Table striped bordered hover className={cx("feedback-table")}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>createdDate</th>
              <th>Message</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={notification.id}>
                <td>{index + 1}</td>
                <td>
                  {notification.user
                    ? notification.user.fullname
                    : "Notification System"}
                </td>
                <td>{notification.createdDate}</td>
                <td>{notification.message}</td>
                <td>{notification.title}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(notification.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateNotification}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter Title" onChange={(e)=>setFormDate(prevFormData =>({...prevFormData,title : e.target.value}))}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Messege</Form.Label>
              <Form.Control type="text" placeholder="Enter Messege" onChange={(e)=>setFormDate(prevFormData =>({...prevFormData,message : e.target.value}))}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>UserName</Form.Label>
              <DropdownButton
                  title={selectedUserName}
                  onSelect={(e) => {
                    if (e === "null") {
                        handleUserSelect(null, "All");
                      } else {
                        const selectedUser = userNames.find(
                          (user) => user.id === parseInt(e)
                        );
                        if (selectedUser) {
                          handleUserSelect(selectedUser.id, selectedUser.username);
                        }}
                  }}
                  variant="outline-secondary"
                >
                  {Array.isArray(userNames) &&
                    userNames.map((userName) => (
                      <Dropdown.Item eventKey={userName.id}>
                        {userName.username}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Item eventKey="null">
                        All
                      </Dropdown.Item>
                </DropdownButton>
                <Form.Text>
                </Form.Text>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Submit Rating
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
