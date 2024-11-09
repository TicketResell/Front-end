import React, { useEffect, useState } from 'react';
import { Table, Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import styles from './Notification.module.scss';
import classNames from 'classnames/bind';
import api from '../../../config/axios';

const cx = classNames.bind(styles);

export default function NotificationManagement() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');
    const [response, setResponse] = useState({}); // Store responses by feedback ID

    const fetchFeedback = async () => {
        try {
            const response = await api.get("/notifications"); // Get all feedback
            console.log("Notification response",response.data);
            setNotifications(response.data);
        } catch (err) {
            setError('Could not retrieve feedback. Please try again later.');
        }
    };
    // Fetch feedback from backend on component mount
    useEffect(() => {
        fetchFeedback();
    }, []);

    // Handle feedback response submission by staff
    const handleResponseSubmit = async (feedbackId) => {
        if (!response[feedbackId] || response[feedbackId].trim() === '') {
            setError('Response cannot be empty.');
            return;
        }

        try {
            const feedbackResponse = { response: response[feedbackId], status: 'Responded' };
            await axios.put(`http://localhost:3000/feedback/${feedbackId}`, feedbackResponse); // Update feedback with response

            setNotifications((prevnotifications) => 
                prevnotifications.map((fb) => fb.id === feedbackId ? { ...fb, response: feedbackResponse.response, status: feedbackResponse.status } : fb)
            );
            setError('');
        } catch (err) {
            setError('Failed to send the response. Please try again.');
        }
    };

    return (
        <Container className={cx('feedback-management-container', 'my-4')}>
            <h3 className={cx('feedback-management-title')}>User Notification Management</h3>

            {error && (
                <Alert variant="danger" className={cx('alert-danger')} onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            {notifications.length === 0 ? (
                <Alert variant="info" className={cx('alert-info')}>
                    No Notification available at the moment.
                </Alert>
            ) : (
                <Table striped bordered hover className={cx('feedback-table')}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>createdDate</th>
                            <th>Email</th>
                            <th>Feedback</th>
                            <th>Title</th>
                            <th>Response</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification, index) => (
                            <tr key={notification.id}>
                                <td>{index + 1}</td>
                                <td>{notification.user ? notification.user.fullname : 'Notification System'}</td>
                                <td>{notification.createdDate}</td>
                                <td>{notification.message}</td>
                                <td>{notification.title}</td>
                                <td>
                                    {notification.status === 'Responded' ? (
                                        notification.response
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            placeholder="Write a response..."
                                            value={response[notification.id] || ''}
                                            onChange={(e) => setResponse({ ...response, [notification.id]: e.target.value })}
                                        />
                                    )}
                                </td>
                                <td>
                                    {notification.status === 'Pending' && (
                                        <Button variant="primary" onClick={() => handleResponseSubmit(notification.id)}>
                                            Submit Response
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
