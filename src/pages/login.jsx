import React, { useState, useEffect } from "react";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { Endpoint } from "../utils/endpoint";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png"

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState(false);
    const [getPassword, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loginError, setLoginError] = useState(null); // Track login error message
    const [userType, setUserType] = useState("admin"); // Track user type (admin or coach)
    const [getEmail, setEmail] = useState(
        localStorage.getItem(`${userType}email`) || ""
    );

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
            message.warning("Please fill in all required fields.");
            return;
        }

        setIsloading(true);

        try {
            const response = await fetch(Endpoint() + "/api/loginStaff/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: getEmail, password: getPassword }),
            });

            if (response.ok) {
                const { token, data } = await response.json();
                if (data) {
                    localStorage.setItem("jwtToken", token);
                    localStorage.setItem(`${userType}email`, getEmail);
                    localStorage.setItem("data", JSON.stringify(data));
                    navigate("/dashboard");
                } else {
                    message.error("Login failed. Please check your credentials.");
                }
            } else {
                message.error("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            message.error("An error occurred during login.");
        } finally {
            setIsloading(false);
        }
    }

    useEffect(() => {
        const email = localStorage.getItem(`${userType}email`);
        setEmail(email || "");
    }, [userType]);

    return (
        <div className="w-full h-screen">
            <div className="flex justify-center mt-10">
                <div className="bg-white rounded-md">
                    <img
                        height={100}
                        width={100}
                        src={"../../src/assets/logo.png"}
                    />
                </div>
            </div>
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
                    placeholder="Email"
                    prefix={<UserOutlined />}
                />

                <Input.Password
                    style={passwordError || loginError ? { borderColor: "red" } : null}
                    required
                    onChange={handlePassword}
                    size="large"
                    type="password"
                    placeholder="Password"
                    prefix={<KeyOutlined />}
                />
                {isLoading ? (
                    <Button className="w-80" loading>
                        Se connecter
                    </Button>
                ) : (
                    <Button className="font-medium w-80" onClick={handleLogin}>
                        Se connecter
                    </Button>
                )}
                {loginError && <div className="text-red-500">{loginError}</div>}
            </div>
            <Link to="/forget-password">
                <div className="text-blue-400 underline underline-offset-1 text-center">
                    Mot de passe oublié?{" "}
                </div>
            </Link>
        </div>
    );
}
