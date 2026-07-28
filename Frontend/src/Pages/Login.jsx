import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/Login.css';
import { login } from '../Service/user';

function Login() {
    const [info, setInfo] = useState({ email: '', password: '' });
    const navigate = useNavigate();

//     const onLogin = async () => {
//         if (!info.email) {
//             toast.error('Email cannot be empty');
//         } else if (!info.password) {
//             toast.error('Password cannot be empty');
//         } else {
//             try {
//                 const result = await login({ ...info, email: info.email.trim() });
                
//                 // if (result.success) {
//                 //     sessionStorage.setItem("token", result.data);
//                 //     // sessionStorage.setItem("role", "USER");

//                 //     // const token = sessionStorage.getItem("token");
//                 //     // const payloadBase64 = token.split('.')[1];
//                 //     // const payload = JSON.parse(atob(payloadBase64));
//                 //     // console.log("payload : ",payload);
                    
//                 //     toast.success('Welcome to IndiSky!');
//                 //     navigate('/');

//                 if (result.success) {
//     sessionStorage.setItem("token", result.data);

//     // Decode JWT Token
//     const token = result.data;
//     const payloadBase64 = token.split('.')[1];
//     const payload = JSON.parse(atob(payloadBase64));

//     console.log(payload);

//     toast.success("Welcome to IndiSky!");

//     // Redirect according to role
//     if (payload.role === "ADMIN") {
//         navigate("/admin");
//     } else {
//         navigate("/");
//     }
// }
//                 // } else {
//                 //     toast.error(result.error || 'Invalid credentials');
//                 // }
//             } catch (err) {
//                 console.error(err);
//                 toast.error('Something went wrong');
//             }
//         }
//     };

const onLogin = async () => {
    if (!info.email) {
        toast.error('Email cannot be empty');
    } else if (!info.password) {
        toast.error('Password cannot be empty');
    } else {
        try {
            const result = await login({ ...info, email: info.email.trim() });

            if (result.success) {
                sessionStorage.setItem("token", result.data);

                // Decode JWT
                const token = result.data;
                const payloadBase64 = token.split('.')[1];
                const payload = JSON.parse(atob(payloadBase64));

                console.log("Payload:", payload);

                toast.success("Welcome to IndiSky!");

                // if (payload.role === "ADMIN") {
                if (payload.Role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }

            } else {
                toast.error(result.error || "Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    }
};

    return (
        <div className="login-container">
            <div className="login-box shadow-lg rounded-4">
                <h2 className="text-center mb-4 text-primary">✈️ Login</h2>

                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    />
                    <label htmlFor="email">Email address</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setInfo({ ...info, password: e.target.value })}
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <button className="btn btn-primary w-100 mb-3" onClick={onLogin}>
                    Login
                </button>

                <div className="text-center mt-3">
                    <p className="text-muted">
                        New user?{' '}
                        <Link
                            to="/register"
                            className="register-link text-decoration-none fw-semibold">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
