import React, { useState } from 'react';
import '../css/style_login.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login () {
    const [values, setValues] = useState({
        staffID:'',
        password:''
    });
    const navigate = useNavigate();
    const handleloginSubmit = (event) => {
        event.preventDefault();
        // navigate('/employee', {state: {staffID: values.staffID}});

        // uncomment when connect to database

        axios.post('http://localhost:3000/auth', values)
        .then(res => {
            const data = res.data;
            // const validUser = data[0].valid_user;
            const role = data[0].role;
            const name = data[0].employeeName;
            // if (validUser) {
            //     if (role === "HR") {
            //         navigate('/hr', {state: {staffID: values.staffID}})  // does this work??? the param
            //     }
            //     else if (role === "employee") {
            //         navigate('/employee', {state: {staffID: values.staffID}})
            //     }
            //     else if (role === "HOD") {
            //         navigate('/hod', {state: {staffID: values.staffID}})
            //     }
            //     else {
            //         alert(res.data.Error);
            //     }
            // }
            // else {
            //     alert(res.data.Error);
            // }
            if (data[0]===1 || data[0]===2) {
                //if pw or ID wrong
                //TODO: SHOULD indicate pw or username fail
                alert(res.data.Error);
            }
            else{
                if (role === "HR") {
                    navigate('/hr', {state: {staffID: values.staffID}})  // does this work??? the param. YES
                }
                else if (role === "employee") {
                    navigate('/employee', {state: {staffID: values.staffID}})
                }
                else if (role === "HOD") {
                    navigate('/hod', {state: {staffID: values.staffID}})
                }
                else {
                    alert(res.data.Error);
                }
            }
        })
        .then(err => console.log(err));

        // until here!!!



        //axios.post('http"//localhost:3000/login', values)
        //.then(res => {
        //    if(res.data.Status === "Success") {
        //        navigate('/')
        //    }
        //    else {
        //        alert(res.data.Error);
        //    }
        //})
        //.then(err => console.log(err));
    };

    return (
        <div className='login-body'>
            <div className="containerlogin">
                <h1>TSH GROUP</h1>
                <form id="loginForm" onSubmit={handleloginSubmit}>
                    <label htmlFor="username" style={{textAlign:'left'}}>Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => setValues({...values, staffID: e.target.value})}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => setValues({...values, password: e.target.value})}
                        required
                    />
                    <button type="submit" className='buttonlogin'>Log in</button>
                </form>
            </div>
        </div>
    );
};

export default Login;