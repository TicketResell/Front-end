import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.module.scss"; 

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Go Back to Home
      </Button>
    </div>
  );
}

export default ErrorPage;