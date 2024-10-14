import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios'; // Assuming we are using Axios for API calls
import styles from './Feedback.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function CustomerFeedback() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare feedback object
            const feedback = { name, email, message };

            // Send feedback to backend (adjust endpoint as needed)
            const response = await axios.post('http://localhost:3000/feedback', feedback);
            
            if (response.status === 200) {
                setSubmitted(true); // Show success message
                setName('');  // Clear form fields
                setEmail('');
                setMessage('');
                setError(''); // Clear any previous errors
            }
        } catch (err) {
            setError('There was a problem sending your feedback. Please try again.');
        }
    };

    return (
        <Container className={cx('feedback-container', 'my-4')}>
            <Row>
                <Col md={8} className="mx-auto">
                    <h3 className={cx('feedback-title')}>Customer Feedback</h3>

                    {submitted && (
                        <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                            Thank you for your feedback!
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit} className={cx('feedback-form')}>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={cx('input-field')}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={cx('input-field')}
                            />
                        </Form.Group>

                        <Form.Group controlId="formMessage" className="mb-3">
                            <Form.Label>Feedback</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Your feedback here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className={cx('input-field')}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className={cx('submit-btn')}>
                            Submit Feedback
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
