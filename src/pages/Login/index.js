import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { confirmEmail } from "../../services/api/RegisterAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../../config";

function Login() {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const checkEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!confirmEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Email không đúng định dạng" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const checkPass = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 8) {
      setErrors((prev) => ({ ...prev, password: "Mật khẩu phải từ 8 ký tự" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkEmail({ target: { value: email } });
    checkPass({ target: { value: password } });

    if (errors.email || errors.password) {
      toast.error("Vui lòng sửa các lỗi trên form", {
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

    try {
      const response = await api.post("accounts/login", {
        email,
        password,
      });
      console.log("Response",response)
      console.log("Response Data:", response.data);
      // Successful login
      toast.success("Đăng nhập thành công!", {
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
      const { jwt } = response.data;
      console.log(jwt);
      const decodedToken = jwtDecode(jwt);
      console.log(decodedToken);
      const currentTime = Date.now() / 1000;
      console.log(decodedToken.exp)
      if (decodedToken.exp < currentTime) {
        // Token đã hết hạn
        console.log("Token expired, please login again.");
      }
      console.log(decodedToken);
      localStorage.setItem("token", jwt);
      console.log("JSON",JSON.stringify(decodedToken))
      localStorage.setItem("user", JSON.stringify(decodedToken));
      navigate("/");
    } catch (error) {
      // Login failed
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Lỗi không xác định";
        console.error("Response Error:", error.response);
        toast.error(`Đăng nhập không thành công: ${errorMessage}`, {
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
      } else if (error.request) {
        console.error("No Response Error:", error.request);
        toast.error(
          "Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          }
        );
      } else {
        console.error("Error:", error.message);
        toast.error(`Đã xảy ra lỗi: ${error.message}`, {
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

  return (
    <Container fluid className={cx("vh-100", "login-screen")}>
      <ToastContainer />
      <Row className={cx("h-100")}>
        <Col
          md={6}
          className={cx("d-none", "d-md-block", "gradient-background")}
        ></Col>

        <Col
          md={6}
          className={cx(
            "d-flex",
            "align-items-center",
            "justify-content-center"
          )}
        >
          <div className={cx("form-container")}>
            <h2 className={cx("mb-4")} style={{ paddingBottom: "20px" }}>
              Đăng nhập
            </h2>
            <Form style={{ marginTop: "-20px" }} onSubmit={handleSubmit}>
              <Form.Group
                controlId="formBasicEmail"
                className={cx("mt-3", "form-group")}
              >
                <Form.Control
                  type="email"
                  placeholder="Email"
                  className={cx("input", "form-control-lg")}
                  onChange={checkEmail}
                  value={email}
                  isInvalid={!!errors.email}
                  isValid={!errors.email && email.length > 0}
                />
                {errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <Form.Control.Feedback></Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group
                controlId="formBasicPassword"
                className={cx("mt-3", "form-group")}
              >
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className={cx("input", "form-control-lg")}
                  onChange={checkPass}
                  value={password}
                  isInvalid={!!errors.password}
                  isValid={!errors.password && password.length > 0}
                />
                <span
                  className={cx("password-toggle-icon")}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <Form.Control.Feedback></Form.Control.Feedback>
                )}
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className={cx("mt-4", "w-100", "btn-lg")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span className="ml-2">Đang xác nhận...</span>
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              <div
                className={cx(
                  "d-flex",
                  "justify-content-between",
                  "align-items-center",
                  "mt-3"
                )}
              >
                <span>
                  Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </span>
                <Link
                  to="/forgot-password"
                  className={cx("forgot-password-btn")}
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </Form>

            {/* Divider */}
            <div className={cx("divider")}>
              <div className={cx("divider-line")}></div>
              <span className={cx("divider-text")}>Hoặc</span>
              <div className={cx("divider-line")}></div>
            </div>

            {/* Google Login */}
            <div className={cx("google-login")}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const tokenId = credentialResponse.credential;
                  fetch("accounts/login-google", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: tokenId }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      toast.success("Đăng nhập bằng Google thành công!", {
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
                      console.log("User logged in successfully:", data);
                    })
                    .catch((error) => {
                      toast.error("Lỗi đăng nhập bằng Google!", {
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
                      console.error("Error:", error);
                    });
                }}
                onError={(error) => {
                  toast.error("Lỗi đăng nhập bằng Google!", {
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
                  console.error("Google login error:", error);
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
