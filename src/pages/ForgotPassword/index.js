import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.scss'; // Import SCSS module
import api from "../../config"; // Assuming you have a pre-configured API service

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('enterEmail');

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/request-otp', { email });
            toast.success('OTP đã được gửi tới email của bạn!', { transition: Bounce });
            setStep('verifyOTP');
        } catch (error) {
            toast.error('Lỗi khi gửi OTP!', { transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/verify-otp', { otp });
            toast.success('OTP hợp lệ!', { transition: Bounce });
            setStep('resetPassword');
        } catch (error) {
            toast.error('OTP không chính xác!', { transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!', { transition: Bounce });
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/reset-password', { newPassword });
            toast.success('Mật khẩu của bạn đã được đặt lại thành công!', { transition: Bounce });
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setStep('enterEmail');
        } catch (error) {
            toast.error('Lỗi khi đặt lại mật khẩu!', { transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className={styles.forgotPasswordPage}>
            <ToastContainer />
            <Row className="justify-content-center">
                <Col md={10} lg={12} className="d-flex justify-content-center">
                    <div className={styles.forgotPasswordContainer}>
                        {/* Back to login button */}
                        <div className={styles.backToLogin}>
                            <Link to="/login">
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                        </div>

                        {/* Step 1: Enter Email */}
                        {step === 'enterEmail' && (
                            <>
                                <h2 className={styles.formTitle}>Quên mật khẩu</h2>
                                <p className={styles.formDescription}>Vui lòng nhập email của bạn để nhận mã OTP.</p>
                                <Form onSubmit={handleRequestOTP}>
                                    <div className={styles.formWrapper}>
                                        <Form.Group controlId="formEmail" className={styles.formGroup}>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập địa chỉ email của bạn"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button className={styles.submitButton} variant="primary" type="submit" disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Gửi OTP'}
                                        </Button>
                                    </div>
                                </Form>
                            </>
                        )}

                        {/* Step 2: Verify OTP */}
                        {step === 'verifyOTP' && (
                            <>
                                <h2 className={styles.formTitle}>Xác nhận OTP</h2>
                                <p className={styles.formDescription}>Vui lòng nhập mã OTP đã được gửi tới email của bạn.</p>
                                <Form onSubmit={handleVerifyOTP}>
                                    <div className={styles.formWrapper}>
                                        <Form.Group controlId="formOTP" className={styles.formGroup}>
                                            <Form.Label>Mã OTP</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập mã OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button className={styles.submitButton} variant="primary" type="submit" disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận OTP'}
                                        </Button>
                                    </div>
                                </Form>
                            </>
                        )}

                        {/* Step 3: Reset Password */}
                        {step === 'resetPassword' && (
                            <>
                                <h2 className={styles.formTitle}>Đặt lại mật khẩu</h2>
                                <p className={styles.formDescription}>Nhập mật khẩu mới của bạn.</p>
                                <Form onSubmit={handleResetPassword}>
                                    <div className={styles.formWrapper}>
                                        <Form.Group controlId="formNewPassword" className={styles.formGroup}>
                                            <Form.Label>Mật khẩu mới</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập mật khẩu mới"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formConfirmPassword" className={styles.formGroup}>
                                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập lại mật khẩu mới"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button className={styles.submitButton} variant="primary" type="submit" disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Đặt lại mật khẩu'}
                                        </Button>
                                    </div>
                                </Form>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
