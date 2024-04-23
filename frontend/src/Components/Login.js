import React,{useState,useEffect} from 'react'
import Photo3 from './photo3.jpeg'
import logo from './numbers.png'
import { Link } from 'react-router-dom'
import {Routes,Route} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Signup from './Signup';
export default function Login() {
  const [userstate,setuserstate]=useState(0);
    const [password,setpassword]=useState("");
    const [email,setemail]=useState("");
    const[alt,setalt]=useState(false);
    const naviprofile= useNavigate();
    const onsubmit=async()=>{
       setuserstate(30);
        const response=await fetch(`${process.env.REACT_APP_API_KEY}/auth/login`,{
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
     setuserstate(50);
  console.log(response.status);
    if(response.status==200){
        setalt(false);
      
        const responses =await fetch(`${process.env.REACT_APP_API_KEY}/users`,{
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
          
        },
       
      });
      setuserstate(70);
      const datas=await responses.json();
      const findUserIdByUsername = (email) => {
        const user = datas.find((user) => user.email === email);
        return user ? user._id : null;
      };
      const findUserusernameByUsername = (email) => {
        const user = datas.find((user) => user.email === email);
        return user ? user.username : null;
      };
      

      const userid = findUserIdByUsername(email);
      const username = findUserusernameByUsername(email);
 
      localStorage.setItem("myid",`${userid}`)
      localStorage.setItem("username",`${username}`)
      console.log(userid);
      setalt(false);
      setuserstate(100);
      naviprofile(`/Home`, { state:{} });
    }else{
      setuserstate(100);
        setalt(true);
    }
    }
  return (
   <>
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
          <img src={Photo3} alt=""></img>
          <form>
            <h2 class="text-center" style={{fontWeight:'bolder'}}>Login</h2>
            {alt===true? <div class={`alert alert-danger alert-dismissible fade show`} role="alert">
    <strong>Incorrect  Email or Password </strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>:""}
         
  <div class="input-group mb-3">
  <input type="email" class="form-control" onChange={e=>setemail(e.target.value)} placeholder="Enter Email" aria-label="Username" aria-describedby="basic-addon1"/>
  <span class="input-group-text" id="basic-addon1">.com</span>
</div>


<div class="input-group mb-3">
 
  <input type="password" class="form-control" onChange={e=>setpassword(e.target.value)} placeholder="Set Password" aria-label="Username" aria-describedby="basic-addon1"/>
</div>

  <button  disabled={password==="" || email==="" ?true:false} type="button" onClick={onsubmit} class="container text-center btn btn-dark rounded-pill">Submit</button>
  <p style={{color:'grey',marginTop:'3%'}} class="text-center"> Don't have an account? <Link to="/" style={{color:'black',textDecoration:'underline'}}>Register</Link></p>
  <p style={{color:'grey',marginTop:'3%'}} class="text-center"> <Link to="/forgotpassword" style={{color:'black',textDecoration:'underline'}}>Forgot Password?</Link></p>
</form>
       </div>
    </div>
    </>
  )
}
