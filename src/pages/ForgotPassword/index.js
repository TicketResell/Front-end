import React, { useState } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import api from "../../config"; // Assuming you have a pre-configured API service

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/request-otp', { email });
            toast.success('OTP đã được gửi tới email của bạn!', {
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
        } catch (error) {
            toast.error('Lỗi khi gửi OTP!', {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="forgot-password-page">
            <ToastContainer />
            <h2 className="text-center">Quên mật khẩu</h2>
            <Form onSubmit={handleRequestOTP}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Đang gửi...
                        </>
                    ) : (
                        'Gửi OTP'
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default ForgotPassword;
