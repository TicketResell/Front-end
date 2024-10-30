import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import api from "../../config/axios";
import ticketLogo from '../../assets/images/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.scss';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        identifier: '',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState(false); // Thêm trạng thái cho checkbox

    const checkIdentifier = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        setErrors((prev) => ({
            ...prev,
            identifier: value ? '' : 'Email hoặc tên đăng nhập không được để trống'
        }));
    };

    const checkPass = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prev) => ({
            ...prev,
            password: value.length >= 8 ? '' : 'Mật khẩu phải từ 8 ký tự'
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (errors.identifier || errors.password) {
            toast.error('Vui lòng sửa các lỗi trên form', {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/accounts/login', { identifier, password });
            if (response && response.status === 200) {
                const { jwt } = response.data;
                const decodedUser = jwtDecode(jwt);
                localStorage.setItem("token", jwt);
                localStorage.setItem("user", JSON.stringify(decodedUser));

                toast.success('Đăng nhập thành công!', {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light",
                    transition: Bounce,
                });
              
                setTimeout(() => {
                    navigate(decodedUser.role === 'admin' ? "/admin" : decodedUser.role === 'staff' ? "/staff" : "/");
                }, 2000);
            }
        } catch (error) {
            toast.error(error.response?.data || 'Đăng nhập không thành công! Vui lòng kiểm tra lại thông tin đăng nhập.', {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="vh-100" style={{ backgroundColor: '#9A616D' }}>
            <ToastContainer />
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ borderRadius: '1rem 0 0 1rem', border:"0px"}}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800"
                                        alt="login form" className="img-fluid" style={{ borderRadius: '1rem 0 0 1rem', height:"100%" }} />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <img src={ticketLogo} alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
                                                <span className="h1 fw-bold mb-0">TicketResell</span>
                                            </div>
                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-lg ${errors.identifier ? 'is-invalid' : ''}`}
                                                    placeholder="Email/Tên đăng nhập"
                                                    onChange={checkIdentifier}
                                                    value={identifier}
                                                    required
                                                />
                                                {errors.identifier && <div className="invalid-feedback">{errors.identifier}</div>}
                                            </div>

                                            <div className={cx('form-outline', 'mb-4', 'position-relative')}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                                                    placeholder="Mật khẩu"
                                                    onChange={checkPass}
                                                    value={password}
                                                    required
                                                    style={{ paddingRight: '50px' }} // Đảm bảo có khoảng cách cho biểu tượng
                                                />
                                                <span className={cx('passwordIcon')} onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                                {errors.password && (
                                                    <div className="invalid-feedback" style={{ position: 'absolute', bottom: '-20px' }}>
                                                        {errors.password}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Thêm checkbox ghi nhớ */}
                                            <div className="form-check mb-4">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="rememberMe"
                                                    checked={rememberMe}
                                                    onChange={() => setRememberMe(!rememberMe)}
                                                />
                                                <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                                            </div>

                                            <div className="pt-1 mb-4">
                                                <button className="btn btn-dark btn-lg btn-block" type="submit" disabled={loading}>
                                                    {loading ? 'Loading...' : 'Login'}
                                                </button>
                                            </div>

                                            <Link className="small text-muted" to="/forgot-password">Forgot password?</Link>
                                            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                                                Don't have an account? <Link to="/register" style={{ color: '#393f81' }}>Register here</Link>
                                            </p>
                                            <Link to="#" className="small text-muted">Terms of use.</Link>
                                            <Link to="#" className="small text-muted">Privacy policy</Link>
                                        </form>

                                        <div className="mt-4">
                                            <GoogleLogin
                                                onSuccess={credentialResponse => {
                                                    const tokenId = credentialResponse.credential;
                                                    fetch('http://localhost:8084/api/accounts/login-google', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ id_token: tokenId }),
                                                    })
                                                        .then(response => {
                                                            if (!response.ok) throw new Error('Login failed');
                                                            return response.json();
                                                        })
                                                        .then(data => {
                                                            const { jwt } = data;
                                                            const decodedUser = jwtDecode(jwt);
                                                            localStorage.setItem("token", jwt);
                                                            localStorage.setItem("user", JSON.stringify(decodedUser));

                                                            toast.success('Đăng nhập bằng Google thành công!', {
                                                                position: "top-center",
                                                                autoClose: 5000,
                                                                theme: "light",
                                                                transition: Bounce,
                                                            });

                                                            setTimeout(() => {
                                                                navigate("/");
                                                            }, 2000);
                                                        })
                                                        .catch(() => {
                                                            toast.error('Lỗi đăng nhập bằng Google!', {
                                                                position: "top-center",
                                                                autoClose: 5000,
                                                                theme: "light",
                                                                transition: Bounce,
                                                            });
                                                        });
                                                }}
                                                onError={() => toast.error('Lỗi đăng nhập bằng Google!', {
                                                    position: "top-center",
                                                    autoClose: 5000,
                                                    theme: "light",
                                                    transition: Bounce,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
