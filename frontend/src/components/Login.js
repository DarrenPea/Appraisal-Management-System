import React, { useState } from 'react';
import '../css/style_login.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login () {
    const [values, setValues] = useState({
        staffID:'',
        password:''
    });
    const navigate = useNavigate();

    // handle 'Log in' button
    const handleloginSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:3000/auth', values)
        .then(res => {
            const data = res.data;
            const role = data[0].role;

            // non-existent username is entered
            if (data[0] === 1) {
                toast.error("Wrong username!", {
                    position: 'bottom-right',
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    autoClose: 2500,
                    closeOnClick: true,
                    closeButton: true,
                    draggable: false,
                    progress: undefined,
                });
            }
            // username exists but wrong password
            else if (data[0] === 2) {
                toast.error("Wrong password!", {
                    position: 'bottom-right',
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    autoClose: 2500,
                    closeOnClick: true,
                    closeButton: true,
                    draggable: false,
                    progress: undefined,
                });
            }
            // correct username and password, leads user to their respective home page
            else{
                if (role === "HR") {
                    const name = data[0].hrName;
                    toast.success("Login successful!", {
                        position: 'bottom-right',
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        autoClose: 2500,
                        closeOnClick: true,
                        closeButton: true,
                        draggable: false,
                        progress: undefined,
                    });
                    navigate('/hr', {state: {staffID: values.staffID, name}})
                }
                else if (role === "Employee") {
                    const name = data[0].employeeName;
                    toast.success("Login successful!", {
                        position: 'bottom-right',
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        autoClose: 2500,
                        closeOnClick: true,
                        closeButton: true,
                        draggable: false,
                        progress: undefined,
                    });
                    navigate('/employee', {state: {staffID: values.staffID, name}})
                }
                else if (role === "HOD") {
                    const name = data[0].hodName;
                    toast.success("Login successful!", {
                        position: 'bottom-right',
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        autoClose: 2500,
                        closeOnClick: true,
                        closeButton: true,
                        draggable: false,
                        progress: undefined,
                    });
                    navigate('/hod', {state: {staffID: values.staffID, name}})
                }
                else {
                    alert(res.data.Error);
                }
            }
        })
        .then(err => console.log(err));
    };

    return (
        <div className='login-body'>
            <div className="containerlogin">
                <h1>TSH GROUP</h1>
                <form id="loginForm" onSubmit={handleloginSubmit}>
                    {/* username field */}
                    <label htmlFor="username" style={{textAlign:'left'}}>Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => setValues({...values, staffID: e.target.value})}
                        required
                    />
                    {/* password field */}
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => setValues({...values, password: e.target.value})}
                        required
                    />
                    {/* 'Log in' button */}
                    <button type="submit" className='buttonlogin'>Log in</button>
                </form>
            </div>
        </div>
    );
};

export default Login;