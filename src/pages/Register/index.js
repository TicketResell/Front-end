import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { validateEmail, validatePhone } from '../../services/api/Register';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import biểu tượng
import { ToastContainer, toast, Bounce } from 'react-toastify';
function Register() {
    const cx = classNames.bind(styles); // bind classNames
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        userName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    const checkUserName = (e) => {
        const value = e.target.value;
        setUserName(value);
        if (value.trim() === '') {
            setErrors((prev) => ({ ...prev, userName: 'Không được để ô trống' }));
        } else if (value.trim().length > 40) {
            setErrors((prev) => ({ ...prev, userName: 'Tên người dùng chỉ được tối đa 40 kí tự' }));
        } else {
            setErrors((prev) => ({ ...prev, userName: '' }));
        }
    };

    const checkEmail = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!validateEmail(value)) {
            setErrors((prev) => ({ ...prev, email: 'Email không đúng định dạng' }));
        } else {
            setErrors((prev) => ({ ...prev, email: '' }));
        }
    };

    const checkPhone = (e) => {
        const value = e.target.value;
        setPhone(value);
        if (!validatePhone(value)) {
            setErrors((prev) => ({ ...prev, phone: 'Số điện thoại không đúng' }));
        } else {
            setErrors((prev) => ({ ...prev, phone: '' }));
        }
    };

    const checkPass = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value.length <= 8) {
            setErrors((prev) => ({ ...prev, password: 'Mật khẩu phải trên 8 ký tự' }));
        } else {
            setErrors((prev) => ({ ...prev, password: '' }));
        }
    };

    const checkPassAgain = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value !== password) {
            setErrors((prev) => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
        } else {
            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của nút submit
        const newErrors = { ...errors };

        // Kiểm tra lỗi cho các trường nhập liệu
        checkUserName({ target: { value: userName } });
        checkEmail({ target: { value: email } });
        checkPhone({ target: { value: phone } });
        checkPass({ target: { value: password } });
        checkPassAgain({ target: { value: confirmPassword } });

        if (!acceptedTerms) {
            toast.error('Bạn phải chấp nhận điều khoản dịch vụ', { 
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
            return;
        }

        // Kiểm tra nếu có lỗi nào
        const hasErrors = Object.values(newErrors).some((error) => error);
        if (hasErrors) {
            toast.error('Vui lòng sửa các lỗi trên form', {
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
            return;
        }
        setLoading(true);
        // Giả lập một tác vụ mất thời gian
        setTimeout(() => {
            setLoading(false);
            // Xử lý sau khi hoàn thành
        }, 2000); // Thay đổi thời gian theo nhu cầu
    };

    return (
        <Container fluid className={cx('vh-100', 'register-screen')}>
            <ToastContainer />
            <Row className={cx('h-100')}>
                {/* Cột trống với nền gradient */}
                <Col md={6} className={cx('d-none', 'd-md-block', 'gradient-background')}></Col>

                {/* Cột chứa form đăng ký với nền trong suốt */}
                <Col md={6} className={cx('d-flex', 'align-items-center', 'justify-content-center')}>
                    <div className={cx('form-container')}>
                        <h2 className={cx('mb-4')} style={{ paddingBottom: '20px' }}>
                            Đăng kí
                        </h2>
                        <Form style={{ marginTop: '-20px' }}>
                            <Form.Group controlId="formBasicUserName" className={cx('mt-3', 'form-group')}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Họ và Tên"
                                    className={cx('input', 'form-control-lg')}
                                    onChange={checkUserName}
                                    value={userName}
                                    isInvalid={errors.userName} // Cờ để kích hoạt hiển thị lỗi
                                    isValid={!errors.userName && userName.length > 0}
                                />
                                {errors.userName ? (
                                    <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                                ) : (
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                )}
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail" className={cx('mt-3', 'form-group')}>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    className={cx('input', 'form-control-lg')}
                                    onChange={checkEmail}
                                    value={email}
                                    isInvalid={errors.email}
                                    isValid={!errors.email && email.length > 0}
                                />
                                {errors.email ? (
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                ) : (
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                )}
                            </Form.Group>
                            <Form.Group controlId="formBasicPhone" className={cx('mt-3', 'form-group')}>
                                <Form.Control
                                    type="tel"
                                    placeholder="Số điện thoại"
                                    className={cx('input', 'form-control-lg')}
                                    onChange={checkPhone}
                                    value={phone}
                                    isInvalid={errors.phone}
                                    isValid={!errors.phone && phone.length > 0}
                                />
                                {errors.phone ? (
                                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                ) : (
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                )}
                            </Form.Group>
                            
                            <Form.Group controlId="formBasicPassword" className={cx('mt-3', 'form-group')}>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mật khẩu"
                                    className={cx('input', 'form-control-lg')}
                                    onChange={checkPass}
                                    value={password}
                                    isInvalid={errors.password}
                                    isValid={!errors.password && password.length > 0}
                                />
                                <span
                                    className={cx('password-toggle-icon')}
                                    onClick={toggleShowPassword}
                                    style={{top: errors.password ? '25%' : '50%'}}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {errors.password ? (
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                ) : (
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                )}
                            </Form.Group>

                            

                            <Form.Group controlId="formBasicConfirmPassword" className={cx('mt-3', 'form-group')}>
                                <Form.Control
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Xác nhận mật khẩu"
                                    className={cx('input', 'form-control-lg')}
                                    onChange={checkPassAgain}
                                    value={confirmPassword}
                                    isInvalid={errors.confirmPassword}
                                    isValid={!errors.confirmPassword && confirmPassword.length > 0}
                                />
                                 <span
                                    className={cx('password-toggle-icon')}
                                    onClick={toggleShowConfirmPassword}
                                    style={{top: errors.confirmPassword ? '25%' : '50%'}}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {errors.confirmPassword ? (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmPassword}
                                    </Form.Control.Feedback>
                                ) : (
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                )}
                            </Form.Group>

                            <Form.Check type="switch" id="custom-switch" label="Tôi chấp nhận điều khoản dịch vụ" 
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                                checked={acceptedTerms}/>

                            <span style={{ display: 'inline-flex', alignItems: 'center', marginTop: '10px' }}>
                                <h6 style={{ margin: '0', marginRight: '5px' }}>Đã có tài khoản?</h6>
                                <Link to="/login">Đăng nhập</Link>
                            </span>

                            <Button
                                variant="primary"
                                type="submit"
                                className={cx('mt-4', 'w-100', 'btn-lg')}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" />
                                        <span className="ml-2">Đang xác nhận...</span>
                                    </>
                                ) : (
                                    'Xác nhận'
                                )}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
