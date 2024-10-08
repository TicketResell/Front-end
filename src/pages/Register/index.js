import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { confirmEmail, confirmPhone } from "../../services/api/RegisterAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import api from "../../config";

function Register() {
  const cx = classNames.bind(styles);
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const iconShowPassword = () => setShowPassword((prev) => !prev);
  const iconShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);
  const navigate = useNavigate();

  const checkFullname = (e) => {
    const value = e.target.value;
    setFullname(value);
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, fullname: "Do not leave blank cells" }));
    } else {
      setErrors((prev) => ({ ...prev, fullname: "" }));
    }
  };

  const checkUsername = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, username: "Do not leave blank cells" }));
    } else if (value.trim().length >= 40) {
      setErrors((prev) => ({
        ...prev,
        username: "User name can only be a maximum of 40 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const checkEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!confirmEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Email is not in correct format" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const checkPhone = (e) => {
    const value = e.target.value;
    setPhone(value);
    if (!confirmPhone(value)) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is incorrect" }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const checkPass = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be 8 characters long",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const checkPassAgain = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirmation password does not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { ...errors };

    checkFullname({ target: { value: fullname } });
    checkUsername({ target: { value: username } });
    checkEmail({ target: { value: email } });
    checkPhone({ target: { value: phone } });
    checkPass({ target: { value: password } });
    checkPassAgain({ target: { value: confirmPassword } });

    if (!fullname && !username && !email && !phone && !password && !confirmPassword) {
      toast.error("Please fill out all information in the form", {
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

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      toast.error("Please check your registration information again", {
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

    if (!acceptTerms) {
      toast.error("You must accept the terms of service", {
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
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const data = { fullname, username, email, phone, password };
    console.log(data);
    try {
      const response = await api.post("accounts/register", data);
      console.log("Status",response.status)
      if(response && response.status === 200){
        toast.success("Registered successfully", {
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
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data, {
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
  };

  return (
    <Container fluid className={cx("vh-100", "register-screen")}>
      <ToastContainer />
      <Row className={cx("h-100")}>
        <Col md={6} className={cx("d-none", "d-md-block", "gradient-background")}></Col>
        <Col md={6} className={cx("d-flex", "align-items-center", "justify-content-center")}>
          <div className={cx("form-container")}>
            <h2 className={cx("form-title", "mb-4")}>Register an account</h2>
            <Form onSubmit={handleSubmit}>
              {/* Fullname input */}
              <Form.Group controlId="formBasicFullname" className={cx("mt-3", "form-group")}>
                <Form.Control
                  required
                  type="text"
                  placeholder="Full Name"
                  className={cx("input", "form-control-lg")}
                  onChange={checkFullname}
                  value={fullname}
                  isInvalid={errors.fullname}
                  isValid={!errors.fullname && fullname.length > 0}
                />
                {errors.fullname ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.fullname}
                  </Form.Control.Feedback>
                ) : (
                  <Form.Control.Feedback></Form.Control.Feedback>
                )}
              </Form.Group>

              {/* Username input */}
              <Form.Group controlId="formBasicUsername" className={cx("mt-3", "form-group")}>
                <Form.Control
                  required
                  type="text"
                  placeholder="User Name"
                  className={cx("input", "form-control-lg")}
                  onChange={checkUsername}
                  value={username}
                  isInvalid={errors.username}
                  isValid={!errors.username && username.length > 0}
                />
                {errors.username ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                ) : (
                  <Form.Control.Feedback></Form.Control.Feedback>
                )}
              </Form.Group>

              {/* Email input */}
              <Form.Group controlId="formBasicEmail" className={cx("mt-3", "form-group")}>
                <Form.Control
                  required
                  type="email"
                  placeholder="Email"
                  className={cx("input", "form-control-lg")}
                  onChange={checkEmail}
                  value={email}
                  isInvalid={errors.email}
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

              {/* Phone input */}
              <Form.Group controlId="formBasicPhone" className={cx("mt-3", "form-group")}>
                <Form.Control
                  required
                  type="text"
                  placeholder="Phone"
                  className={cx("input", "form-control-lg")}
                  onChange={checkPhone}
                  value={phone}
                  isInvalid={errors.phone}
                  isValid={!errors.phone && phone.length > 0}
                />
                {errors.phone ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                ) : (
                  <Form.Control.Feedback></Form.Control.Feedback>
                )}
              </Form.Group>

              {/* Password input */}
              <Form.Group
                controlId="formBasicPassword"
                className={cx("mt-3", "form-group")}
              >
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={cx("input", "form-control-lg")}
                  onChange={checkPass}
                  value={password}
                  isInvalid={errors.password}
                  isValid={!errors.password && password.length > 0}
                />
                <span
                  className={cx("password-icon")}
                  onClick={iconShowPassword}
                  style={{ top: errors.password ? "25%" : "50%" }}
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

              <Form.Group
                controlId="formBasicConfirmPassword"
                className={cx("mt-3", "form-group")}
              >
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={cx("input", "form-control-lg")}
                  onChange={checkPassAgain}
                  value={confirmPassword}
                  isInvalid={errors.confirmPassword}
                  isValid={
                    !errors.confirmPassword && confirmPassword.length > 0
                  }
                />
                <span
                  className={cx("password-icon")}
                  onClick={iconShowConfirmPassword}
                  style={{ top: errors.confirmPassword ? "25%" : "50%" }}
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

              <Form.Check
                type="switch"
                id="custom-switch"
                label="I accept the terms of service"
                onChange={(e) => setAcceptTerms(e.target.checked)}
                checked={acceptTerms}
              />

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <h6 style={{ margin: "0", marginRight: "5px" }}>
                Already have an account?
                </h6>
                <Link to="/login">Log in</Link>
              </span>

              <Button
                variant="primary"
                type="submit"
                className={cx("mt-4", "w-100", "btn-lg")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span className="ml-2">Confirming...</span>
                  </>
                ) : (
                  "Confirm"
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
