import React, { useState, useEffect } from "react";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Input, Watermark, message } from "antd";
import { Endpoint } from "../../src/utils/endpoint";
import logo from "../assets/logo.png"; // Import the image using ES6 import
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [getPassword, setPassword] = useState("");
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(null); // Track login error message
  const [state, setState] = useState(true);
  const [getEmail, setEmail] = useState(localStorage.getItem("email") || "");

  function handleEmail(e) {
    setEmail(e.target.value);
    setEmailError(false); // Reset error state
    setLoginError(null); // Reset login error message
  }
  function handlePassword(e) {
    setPassword(e.target.value);
    setPasswordError(false); // Reset error state
    setLoginError(null); // Reset login error message
  }
  async function handleLogin() {
    if (!getEmail || !getPassword) {
      if (!getEmail) {
        setEmailError(true); // Set error state for email
      }
      if (!getPassword) {
        setPasswordError(true); // Set error state for password
      }
      message.warning("Veuillez remplir les champs obligatoires.");
      return;
    }

    setIsloading(true);

    try {
      const response = await fetch(Endpoint() + "/api/loginAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: getEmail, password: getPassword }),
      });

      if (response.ok) {
        const { token, data } = await response.json();
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("email", getEmail);
        localStorage.setItem("data", data);
        window.location.href = "/dashboard/";
      } else {
        message.error(
          "Échec de la connexion. Veuillez vérifier vos identifiants"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Une erreur s'est produite lors de la connexion");
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    const email = localStorage.getItem("email");
    setEmail(email);
    const handleLogout = async () => {
      const token = await localStorage.getItem("jwtToken");
      if (token.length > 1) {
        navigate("/dashboard");
      }
    };
    handleLogout();
  }, []);

  return state ? (
    <Watermark content="">
      <div className="flex justify-center mt-10"></div>
      <div className="w-80 h-60 m-auto mt-1 flex flex-col justify-center items-center space-y-5">
        <Input
          style={
            (emailError || loginError) && !getEmail
              ? { borderColor: "red" }
              : null
          }
          required
          onChange={handleEmail}
          onBlur={(e) => {
            if (e.target.value.length === 1) {
              setEmail(""); // Set getEmail state to empty when the field is cleared
            }
          }}
          size="large"
          value={getEmail}
          placeholder="Old Email"
          prefix={<UserOutlined />}
        />

        {isLoading ? (
          <Button className="w-80" loading>
            Login
          </Button>
        ) : (
          <Button className="font-medium w-80" onClick={handleLogin}>
            Forget Password
          </Button>
        )}
        {loginError && <div className="text-red-500">{loginError}</div>}
      </div>
      <Link to="/login">
        <div className="text-blue-400 underline underline-offset-1 text-center">
          Login
        </div>
      </Link>
    </Watermark>
  ) : (
    (window.location.href = "/dashboard/profile")
  );
}
