import logo from './logo.svg';
import './App.css';
import Signup from './Components/Signup.js';
import Login from './Components/Login.js';
import { Link } from 'react-router-dom'
import {Routes,Route} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from './Components/ForgotPassword.js';
import Otp from './Components/Otp.js';
import Changepassword from './Components/Changepassword.js';
import Home from './Components/Home.js';
import Solvedpuzzle from './Components/Solvedpuzzle.js';
import Savedpuzzle from './Components/Savedpuzzle.js';
import Dopuzzle from './Components/Dopuzzle.js';
function App() {
  return (
  <>
   <Routes>
     
  
   <Route exact path="/" element={<Signup />}></Route>
  <Route exact path="/login" element={<Login />}></Route>
  <Route exact path="/forgotpassword" element={<ForgotPassword/>}></Route>
  <Route exact path="/otp" element={<Otp />}></Route>
  <Route exact path="/changepassword" element={<Changepassword />}></Route>
  <Route exact path="/Home" element={<Home />}></Route>
  <Route exact path="/mysolvedpuzzle" element={<Solvedpuzzle />}></Route>
        <Route exact path="/mysavedpuzzle" element={<Savedpuzzle />}></Route>
        <Route exact path="/dopuzzle" element={<Dopuzzle />}></Route>
  </Routes>


  </>
  
  );
}

export default App;
