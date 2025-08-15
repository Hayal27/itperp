import React, { useState, useEffect } from "react";
import logo from "../../assets/img/SNRS_logo.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auths/AuthContex";
import Axios from "axios";
import jwt_decode from 'jwt-decode';  // Correct import

// import * as jwt_decode from 'jwt-decode';  // Adjusted import

const Login = () => {
  const [user_name, setuser_name] = useState("");
  const [pass, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { dispatch } = useAuth();
  const navigate = useNavigate();

  // Check for token and validate on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode.default(token);  // Access decode function correctly
        // Dispatch a login action if the token is valid
        dispatch({ type: 'LOGIN', payload: decoded });
        navigate("/");  // Redirect if token is valid
      } catch (error) {
        console.error("Invalid token:", error);
        dispatch({ type: 'LOGOUT' });  // Log out if the token is invalid
      }
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Sending login request
      const response = await Axios.post("http://localhost:5000/login", {
        user_name,
        pass,
      });
  
      console.log("Login response:", response.data); // Log the full response for debugging
  
      if (response.data.success) {
        // Assuming 'token' is part of the response
        const { user, token } = response.data;
  
        // Decode the JWT token to inspect the payload
        const decodedToken = jwt_decode(token);  // Use jwt_decode correctly
        console.log("Decoded token:", decodedToken); // This will log the decoded token
  
        // Save token to localStorage
        localStorage.setItem("token", token); // Save the token in localStorage
        console.log("Token saved:", localStorage.getItem("token")); // Optional: Debugging token storage
  
        // Dispatch login action with user data (for global state management)
        dispatch({ type: "LOGIN", payload: user });
  
        // Navigate to the homepage or dashboard
        navigate("/"); 
      } else {
        setMessage("Login failed.");
      }
    } catch (error) {
      setMessage("An error occurred, please try again.");
      console.error("Login error:", error); // Log any errors
    }
  };

  return (
    <div>
      <div id ="login" className="container-l">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4"></div>
              <div className="col-lg-5 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <a href="index.html" className="logo d-flex align-items-center w-auto login-logo">
                    <img src={logo} alt="logo" />
                    <br />
                  </a>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Login to Your Account
                      </h5>
                      {message ? (
                        <p style={{ color: "red" }} className="text-center small">
                          {message}
                        </p>
                      ) : (
                        <p className="text-center small">
                          Enter your user_name & password to login
                        </p>
                      )}
                    </div>
                    <form className="row g-3 needs-validation" noValidate>
                      <div className="col-12">
                        <label htmlFor="youruser_name" className="form-label">
                          user_name
                        </label>
                        <div className="input-group has-validation">
                          <span className="input-group-text" id="inputGroupPrepend">
                            @
                          </span>
                          <input
                            type="text"
                            name="user_name"
                            className="form-control"
                            id="youruser_name"
                            value={user_name}
                            onChange={(e) => setuser_name(e.target.value)}
                            required
                          />
                          <div className="invalid-feedback">Please enter your user_name.</div>
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="yourPassword" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={pass}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control"
                          id="yourPassword"
                          required
                        />
                        <div className="invalid-feedback">Please enter your password!</div>
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="remember"
                            defaultValue="true"
                            id="rememberMe"
                          />
                          <label className="form-check-label" htmlFor="rememberMe">
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button
                          className="btn btn-primary w-100"
                          type="button"
                          onClick={handleLogin}
                        >
                          Login
                        </button>
                      </div>
                      <div className="col-12">
                        <p className="small mb-0">
                          Don't have account? <a href="#">Please inform to Admin</a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="credits">
                  Developed by <a href="#">ITPC IT Departmen</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
