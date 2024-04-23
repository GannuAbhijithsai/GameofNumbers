import React,{useState,useEffect} from 'react'
import Photo6 from './photo6.webp'
import logo from './numbers.png'
import { Link } from 'react-router-dom'
import {Routes,Route} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Login from './Login';


export default function Changepassword() {
  const [userstate,setuserstate]=useState(0);
  const[otp,setotp]=useState("");
    const[cpassword,setcpassword]=useState("");
    const [password,setpassword]=useState("");
    const [email,setemail]=useState("");
    const [msg,setmsg]=useState("");
    const[alt,setalt]=useState(false);
    const naviprofile= useNavigate();
    const onsubmit=async()=>{
      setuserstate(30);
       if(password!==cpassword){
        setmsg("set password and confirm password must be same");
        setalt(true);
        
       }else{
        const response=await fetch(`${process.env.REACT_APP_API_KEY}/auth/changepassword`,{
         method:'POST',
         headers:{
            'Content-Type':'application/json',
         },
         body :JSON.stringify({
                  "email":email,
                  "password":password
         })
        })
     //   const data=await response.json();
  console.log(response);
    if(response.status==200){
        setalt(false);
      setuserstate(100);
        naviprofile(`/login`, { state:{} });
    }else{
      setuserstate(100);
        setalt(true);
        setmsg("Wrong email")
    }
    }
}
  return (
   <>
    <Routes>
        <Route path="/login" element={<Login />}></Route>
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
          <img src={Photo6} alt="" style={{width:'40%'}}></img>
          <form>
            <h2 class="text-center" style={{fontWeight:'bolder'}}>Change Password</h2>
            <div id="emailHelp" className="text-center" style={{margin:'2%',color:'grey'}}>Your Password Must contain atleat 6 characters and should include a combination of numbers,letters and special characters (!$@%)</div>
            {alt===true? <div class={`alert alert-danger alert-dismissible fade show`} role="alert">
    <strong>{msg}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>:""}
  <div class="input-group mb-3">
  <input type="email" class="form-control" onChange={e=>setemail(e.target.value)} placeholder="Enter Email" aria-label="Username" aria-describedby="basic-addon1"/>
  <span class="input-group-text" id="basic-addon1">.com</span>
</div>  
  <div class="input-group mb-3">
  <input type="password" class="form-control" onChange={e=>setpassword(e.target.value)} placeholder="Set Password" aria-label="Username" aria-describedby="basic-addon1"/>
 
</div>
<div class="input-group mb-3">
  <input type="password" class="form-control" onChange={e=>setcpassword(e.target.value)} placeholder="Confirm Password" aria-label="Username" aria-describedby="basic-addon1"  />
 
</div>



  <button  disabled={email===""||password===""||cpassword==="" ?true:false} type="button" onClick={onsubmit} class="container text-center btn btn-dark rounded-pill">Submit</button>
  
  
</form>
       </div>
    </div>
    </>
  )
}



