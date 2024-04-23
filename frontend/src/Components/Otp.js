import React,{useState,useEffect} from 'react'
import Photo5 from './photo5.webp'
import logo from './numbers.png'
import { Link } from 'react-router-dom'
import {Routes,Route} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Changepassword from './Changepassword';
import LoadingBar from 'react-top-loading-bar';
export default function Otp() {
  const [userstate,setuserstate]=useState(0);
    const[otp,setotp]=useState("");
    const [email,setemail]=useState("");
    const[alt,setalt]=useState(false);
    const naviprofile= useNavigate();
    const onsubmit=async()=>{
       setuserstate(30);
        const response=await fetch(`${process.env.REACT_APP_API_KEY}/auth/otpverfication`,{
         method:'POST',
         headers:{
            'Content-Type':'application/json',
         },
         body :JSON.stringify({
                  "email":email,
                  "otp":otp
         })
        })
     //   const data=await response.json();
  console.log(response);
    if(response.status==200){
        setalt(false);
      setuserstate(100);
        naviprofile(`/changepassword`, { state:{} });
    }else{
      setuserstate(100);
        setalt(true);
    }
    }
  return (
   <>
    <Routes>
        <Route path="/changepassword" element={<Changepassword />}></Route>
    </Routes>
    <LoadingBar
        color='#f11946'
        progress={userstate}
      />
    <div style={{width:'100%',height:'100vw',position:'relative'}}>
        
        <nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#" style={{fontWeight:'bolder'}}>
      <img src={logo} alt="Logo" width="30" height="24" class="d-inline-block align-text-top" />
      Game of Numbers
    </a>
  </div>
</nav>
       <div id="box">
          <img src={Photo5} alt="" style={{width:'40%'}}></img>
          <form>
            <h2 class="text-center" style={{fontWeight:'bolder'}}>OTP verfication</h2>
            <div id="emailHelp" className="text-center" style={{margin:'2%',color:'grey'}}>enter the 6 digit code that we sent to our registered email</div>
            {alt===true? <div class={`alert alert-danger alert-dismissible fade show`} role="alert">
    <strong>Wrong email or otp </strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>:""}
         
  <div class="input-group mb-3">
  <input type="email" class="form-control" onChange={e=>setemail(e.target.value)} placeholder="Enter Email" aria-label="Username" aria-describedby="basic-addon1"/>
  <span class="input-group-text" id="basic-addon1">.com</span>
</div>
<div class="input-group mb-3">
  <input type="text" class="form-control" onChange={e=>setotp(e.target.value)} placeholder="Enter Otp" aria-label="Username" aria-describedby="basic-addon1" maxLength="6"  />
 
</div>



  <button  disabled={email===""||otp==="" ?true:false} type="button" onClick={onsubmit} class="container text-center btn btn-dark rounded-pill">Submit</button>
  
  
</form>
       </div>
    </div>
    </>
  )
}


