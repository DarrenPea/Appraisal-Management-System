import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './components/Login';
import HodHome from './components/hodhome';
import EmployeeHome from './components/employeehome'
import HrHome from './components/hrhome';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AppraisalForm from './components/appraisalform';

function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/hod' element={<HodHome />}></Route>
        <Route path='/employee' element={<EmployeeHome />}></Route>
        <Route path='/hr' element={<HrHome />}></Route>
        <Route path='/form' element={<AppraisalForm />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
