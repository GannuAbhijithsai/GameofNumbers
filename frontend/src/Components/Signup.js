import React,{useState,useEffect} from 'react'
import Photo2 from './photo2.jpg'
import logo from './numbers.png'
import { Link } from 'react-router-dom'
import {Routes,Route} from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
export default function Signup() {
  const [userstate,setuserstate]=useState(0);
    const [name,setname]=useState("");
    const [password,setpassword]=useState("");
    const [email,setemail]=useState("");
    const[alt,setalt]=useState(false);
    const[username,setusername]=useState("");
    const [usersemail,setusersemail]=useState([]);
const [usersusername,setusersusername]=useState([]);
    const fetchuserdata=async ()=>{
      
        try{
        const response =await fetch(`${process.env.REACT_APP_API_KEY}/users`,{
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
            
          },
         
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        const data = await response.json();
        const usernames = data.map(user => user.username);
        const emails = data.map(user => user.email);
    
        setusersemail(emails);
        setusersusername(usernames);
    
        console.log(usernames);
        console.log(emails);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    const naviprofile= useNavigate();
      const onsubmit=async ()=>{
       setuserstate(30);
        if(!(usersusername.includes(username) || usersemail.includes(email))){
     
        const response=await fetch(`${process.env.REACT_APP_API_KEY}/auth/signup`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ "name":name,
            "email":email,
            "username":username,
            "password":password,
        
        })
        })
      
       setuserstate(70);
        setalt(false);
        console.log(alt);
    setuserstate(100);
        naviprofile(`/login`, { state:{} });

    }else{
      setuserstate(100);
        setalt(true);
        console.log(alt);
       
    }

};
useEffect(() => {
    
    const fetchData = async () => {
        await fetchuserdata();
   
      };
  
      fetchData();
  
    
  }, []);
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
          <img src={Photo2} alt=""></img>
          <form>
            <h2 class="text-center" style={{fontWeight:'bolder'}}>Register</h2>
            {alt===true? <div class={`alert alert-danger alert-dismissible fade show`} role="alert">
    <strong>Username or Email already exists</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>:""}
          <div class="input-group mb-3">
  <input type="text" class="form-control"onChange={e=>setname(e.target.value)} placeholder="Enter Full Name" aria-label="Username" aria-describedby="basic-addon1"/>
</div>
  <div class="input-group mb-3">
  <input type="email" class="form-control" onChange={e=>setemail(e.target.value)} placeholder="Enter Email" aria-label="Username" aria-describedby="basic-addon1"/>
  <span class="input-group-text" id="basic-addon1">.com</span>
</div>
  <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">@</span>
  <input type="text" class="form-control"onChange={e=>setusername(e.target.value)} placeholder="Enter Username" aria-label="Username" aria-describedby="basic-addon1"/>
</div>

<div class="input-group mb-3">
 
  <input type="password" class="form-control" onChange={e=>setpassword(e.target.value)} placeholder="Set Password" aria-label="Username" aria-describedby="basic-addon1"/>
</div>

  <button  disabled={password==="" || email==="" || name===""|| username===""?true:false} type="button" onClick={onsubmit} class="container text-center btn btn-dark rounded-pill">Submit</button>
  <p style={{color:'grey',marginTop:'3%'}} class="text-center">Already registered? <Link to="/login" style={{color:'black',textDecoration:'underline'}}>Login in</Link></p>
 
</form>
       </div>
    </div>
    </>
  )
}
