import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    axios
      .post("http://localhost:3001/api/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.message) {
          console.log(response.data.message);
          setError(response.data.message);
        } else {
          console.log(response.data);
          sessionStorage.setItem("token", response.data);
          navigate("/");
        }
      });
  };

  return (
    <div className="card w-500 m-auto">
      <h2 className="center">Login Page</h2>
      {error && <h3 className="mt-3">{error}</h3>}
      <div className="input">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          className="rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          className="rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="center">
        <button type="submit" className="block" onClick={() => submit()}>
          Login
        </button>
        <Link to={"/register"} className="mb-3">
          Create an accout here.
        </Link>
      </div>
    </div>
  );
};

export default Login;
