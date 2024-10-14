import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.scss'; // Import SCSS module

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('enterEmail'); // 'enterEmail' or 'resetPassword'
    
    // State to toggle password visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //Send link function here
    const handleSendResetLink = (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Define the API request body
        const requestBody = {
            email: email,
        };
    
        // API call to send the reset link
        fetch('https://your-backend-api.com/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (response.ok) {
                    toast.success('Link đặt lại mật khẩu đã được gửi tới email của bạn!', { transition: Bounce });
                    setStep('resetPassword'); // Switch to the reset password page
                } else {
                    toast.error('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.');
                }
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi khi gửi yêu cầu.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //Reset password function here
    const handleResetPassword = (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!', { transition: Bounce });
            setLoading(false);
            return;
        }
    
        // Define the API request body
        const requestBody = {
            email: email, // Assuming you keep track of the user's email during the reset process
            newPassword: newPassword,
        };
    
        // API call to reset the password
        fetch('https://your-backend-api.com/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (response.ok) {
                    toast.success('Mật khẩu của bạn đã được đặt lại thành công!', { transition: Bounce });
                } else {
                    toast.error('Đã xảy ra lỗi khi đặt lại mật khẩu.');
                }
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi khi gửi yêu cầu.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Toggle password visibility for New Password
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    // Toggle password visibility for Confirm Password
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Container className={styles.forgotPasswordPage}>
            <ToastContainer />
            <Row className="justify-content-center">
                <Col md={10} lg={12} className="d-flex justify-content-center">
                    <div className={styles.forgotPasswordContainer}>
                        <div className={styles.backToLogin}>
                            <Link to={step === 'enterEmail' ? "/login" : "#"} onClick={() => setStep('enterEmail')}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                        </div>

                        {/* Step 1: Enter Email */}
                        {step === 'enterEmail' && (
                            <>
                                <h2 className={styles.formTitle}>Quên mật khẩu</h2>
                                <p className={styles.formDescription}>Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
                                <Form onSubmit={handleSendResetLink}>
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
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Gửi liên kết'}
                                        </Button>
                                    </div>
                                </Form>
                            </>
                        )}

                        {/* Step 2: Reset Password */}
                        {step === 'resetPassword' && (
                            <>
                                <h2 className={styles.formTitle}>Đặt lại mật khẩu</h2>
                                <p className={styles.formDescription}>Vui lòng nhập mật khẩu mới của bạn.</p>
                                <Form onSubmit={handleResetPassword}>
                                    <div className={styles.formWrapper}>
                                        {/* New Password Field */}
                                        <Form.Group controlId="formNewPassword" className={styles.formGroup}>
                                            <Form.Label>Mật khẩu mới</Form.Label>
                                            <div className={styles.passwordWrapper}>
                                                <Form.Control
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    placeholder="Nhập mật khẩu mới"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                                <FontAwesomeIcon
                                                    icon={showNewPassword ? faEyeSlash : faEye}
                                                    onClick={toggleNewPasswordVisibility}
                                                    className={styles.passwordToggleIcon}
                                                />
                                            </div>
                                        </Form.Group>

                                        {/* Confirm Password Field */}
                                        <Form.Group controlId="formConfirmPassword" className={styles.formGroup}>
                                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                                            <div className={styles.passwordWrapper}>
                                                <Form.Control
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Nhập lại mật khẩu mới"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                                <FontAwesomeIcon
                                                    icon={showConfirmPassword ? faEyeSlash : faEye}
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    className={styles.passwordToggleIcon}
                                                />
                                            </div>
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
