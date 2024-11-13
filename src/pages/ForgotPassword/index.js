import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation,useNavigate } from 'react-router-dom'; // Sử dụng useLocation
import styles from './ForgotPassword.module.scss'; // Import SCSS module
import api from '../../config/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('enterEmail'); // 'enterEmail' or 'resetPassword'

    // State to toggle password visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Lấy email từ URL query parameters
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailFromURL = searchParams.get('email');
        console.log("emailFromURL",emailFromURL)
        if (emailFromURL) {
            // Nếu có email trong URL, chuyển sang bước reset password và dừng loading
            setEmail(emailFromURL);
            setStep('resetPassword');
            setLoading(false);
        }
    }, [location]);

    // Gửi liên kết đặt lại mật khẩu
    const handleSendResetLink = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Send request to the backend to check if the email exists and send the reset link
            const response = await api.post('/accounts/reset', { email });
            
            // If the email exists and the link is sent successfully
            if (response && response.status === 200) {
                toast.success(response.data, {
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
                setStep('resetPassword');  // Move to reset password step
            }
        } catch (error) {
            // Handle error when email is not found
            if (error.response && error.response.status === 400) {
                toast.error('Email chưa được đăng ký! Vui lòng kiểm tra lại.', {
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
            } else {
                // Handle general errors
                toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.', {
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
            }
        } finally {
            setLoading(false);
        }
    };
    

    // Đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!', { transition: Bounce });
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/accounts/update-password', { email, newPassword });
            if (response && response.status === 200) {
                toast.success(response.data, {
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
            
            }
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            toast.error(error.data, {
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
        }
    };

    // Toggle visibility cho mật khẩu mới
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    // Toggle visibility cho mật khẩu xác nhận
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Container className={styles.forgotPasswordPage}>
            <ToastContainer />
            <Row className="justify-content-center">
                <Col md={12} className="d-flex justify-content-center">
                    <div className={styles.forgotPasswordContainer}>
                        <div className={styles.backToLogin}>
                            <Link to={step === 'enterEmail' ? "/login" : "#"} onClick={() => setStep('enterEmail')}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                        </div>

                        {/* Bước 1: Nhập email */}
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

                        {/* Bước 2: Đặt lại mật khẩu */}
                        {step === 'resetPassword' && (
                            <>
                                <h2 className={styles.formTitle}>Đặt lại mật khẩu</h2>
                                <p className={styles.formDescription}>Vui lòng nhập mật khẩu mới của bạn.</p>
                                <Form onSubmit={handleResetPassword}>
                                    <div className={styles.formWrapper}>
                                        {/* Mật khẩu mới */}
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

                                        {/* Xác nhận mật khẩu */}
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