import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Usercontext";
import axios from "axios";
import Swal from "sweetalert2";

const RegisterAndLoginFrom = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState(null);
  const { setUsername: setLoggedInUsername, setId }  = useContext(UserContext);
  const URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (isRegister == true) {
      setIsLoginOrRegister("register");
    } else {
      setIsLoginOrRegister("login");
    }
  }, [isRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add your authentication logic here
    // For example, you can use an API to handle login/register

    console.log(
      `Email: ${username}, Password: ${password}, isRegister: ${isRegister}`
    );
    console.log(isRegister);
    console.log(isLoginOrRegister);
    console.log(`${URL}${isLoginOrRegister}`);
    const { data } = await axios.post(`${URL}${isLoginOrRegister}`, {
      username,
      password,
    });
    
    // Swal.fire({
    //   position: "top-end",
    //   icon: "success",
    //   title: "Your work has been saved",
    //   showConfirmButton: false,
    //   timer: 1500
    // });
    
    if (isLoginOrRegister === "login") {
      setLoggedInUsername(username);
      setId(data.id);
    }
    console.log(data.id);
    console.log(data.username);
  };

  return (
    <div className="auth-form">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="text"
          value={username}
          className="block w-full rounded-sm p-2 mb-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="text"
          value={password}
          className="block w-full rounded-sm p-2 mb-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" onClick={handleSubmit}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default RegisterAndLoginFrom;
