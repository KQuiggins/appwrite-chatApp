import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
  const { handleUserRegister } = useAuth();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form
          onSubmit={(e) => {
            handleUserRegister(e, credentials);
          }}
        >
          <div className="field--wrapper">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
              value={credentials.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password1"
              name="password1"
              placeholder="Enter your password"
              required
              value={credentials.password1}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <label htmlFor="password">Confirm Password:</label>
            <input
              type="password"
              id="password2"
              name="password2"
              placeholder="Confirm password"
              required
              value={credentials.password2}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <input
              type="submit"
              value="Login"
              className="btn btn--lg btn--main"
            />
          </div>
        </form>
        <p>
          Already have an account? Login <Link to="/login">Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
