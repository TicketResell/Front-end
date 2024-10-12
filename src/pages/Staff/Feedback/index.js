import React, { useEffect, useState } from 'react';
import { Table, Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import styles from './Feedback.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function FeedbackManagement() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState('');
    const [response, setResponse] = useState({}); // Store responses by feedback ID

    // Fetch feedback from backend on component mount
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get('http://localhost:3000/feedback'); // Get all feedback
                setFeedbacks(response.data);
            } catch (err) {
                setError('Could not retrieve feedback. Please try again later.');
            }
        };
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

            setFeedbacks((prevFeedbacks) => 
                prevFeedbacks.map((fb) => fb.id === feedbackId ? { ...fb, response: feedbackResponse.response, status: feedbackResponse.status } : fb)
            );
            setError('');
        } catch (err) {
            setError('Failed to send the response. Please try again.');
        }
    };

    return (
        <Container className={cx('feedback-management-container', 'my-4')}>
            <h3 className={cx('feedback-management-title')}>User Feedback Management</h3>

            {error && (
                <Alert variant="danger" className={cx('alert-danger')} onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            {feedbacks.length === 0 ? (
                <Alert variant="info" className={cx('alert-info')}>
                    No feedback available at the moment.
                </Alert>
            ) : (
                <Table striped bordered hover className={cx('feedback-table')}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Feedback</th>
                            <th>Status</th>
                            <th>Response</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={feedback.id}>
                                <td>{index + 1}</td>
                                <td>{feedback.name}</td>
                                <td>{feedback.email}</td>
                                <td>{feedback.message}</td>
                                <td>{feedback.status}</td>
                                <td>
                                    {feedback.status === 'Responded' ? (
                                        feedback.response
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            placeholder="Write a response..."
                                            value={response[feedback.id] || ''}
                                            onChange={(e) => setResponse({ ...response, [feedback.id]: e.target.value })}
                                        />
                                    )}
                                </td>
                                <td>
                                    {feedback.status === 'Pending' && (
                                        <Button variant="primary" onClick={() => handleResponseSubmit(feedback.id)}>
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
