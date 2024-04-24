import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import logo from './numbers.png'
import hourglass from './hourglass.gif';
import CelebrationPage from './CelebrationPage';
import { Link } from 'react-router-dom'
import {Routes,Route} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Solvedpuzzle from './Solvedpuzzle';
import Savedpuzzle from './Savedpuzzle';
import { useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
export default function Dopuzzle() {
    const location = useLocation();
    const { state } = location;
    const [userstate,setuserstate]=useState(0);
  const [puzzle,setpuzzle]=useState([[]]);
  
  const [initial,setinitial]=useState([[]]);
  const [alt,setalt]=useState(false);
  const [solvedpuzzle,setsolvedpuzzle]=useState([[]]);
  const [count,setcount]=useState(5);
  const [showCelebration, setShowCelebration] = useState(false); 
  const [msg,setmsg]=useState("");
  const [overallTime, setOverallTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gm,setgm]=useState("")
  const [agm,setagm]=useState(false);
  const naviprofile= useNavigate();
  const username = localStorage.getItem('username');
  useEffect(() => {
    setpuzzle([...state.puzzle.board]);
    setinitial([...state.puzzle.board]);
   console.log(state.puzzle.board);
    solvesudoko();
   
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(now - startTime);
        // Update localStorage with elapsed time
        localStorage.setItem('time', JSON.stringify(now - startTime));
      }, 10); // Update every 10 milliseconds for smoother display
    } else {
      clearInterval(interval);
    }
   
    return () => clearInterval(interval); // Cleanup function to clear interval on component unmount or re-render
  }, [isRunning, startTime]);

  const handleStartPauseClick = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      const now = Date.now();
      setStartTime(now - elapsedTime);
      setIsRunning(true);
    }
  };

  const handleResetClick = () => {
    setStartTime(0);
    setElapsedTime(0);
    setIsRunning(false);
    // Reset localStorage value
    localStorage.removeItem('time');
  };

  // Format milliseconds into a readable time format (HH:MM:SS)
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const solvesudoko=async()=>{
   setuserstate(30);
try{
   const response2=await fetch(`${process.env.REACT_APP_API_KEY}/solvesudoko`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
   },
   body :JSON.stringify({
    "game":initial
})
     
   })
   const data2=await response2.json();
   setuserstate(100);
   setsolvedpuzzle([...data2.game]);
   console.log(data2.game);
  }catch(err){
    setuserstate(100);
    console.log(err);
  }
}
function isvalidplace(grid,row,col,guess){
  for(let i=0;i<9;i++){
     if(grid[i][col]===guess){
       return false;
     }
  }
  for(let i=0;i<9;i++){
   if(grid[row][i]==guess){
     return false;
   }
}
let localBoxRow=row-(row%3);
let localBoxCol=col-(col%3);
for(let i=localBoxRow;i<localBoxRow+3;i++){
   for(let j=localBoxCol;j<localBoxCol+3;j++){
       if(grid[i][j]===guess){
           return false;
       }
   }
}
return true;
}
function iscompleted(grid){
  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){
      if(grid[i][j]===0){
        return false;
      }
    }
  }
  return true;
}
  
  const onInputChnage=(e,row,col)=>{
    var val=parseInt(e.target.value.trim());
    console.log(val);
    if (isNaN(val)) {
      // If the input is empty, set the cell value to an empty string
      const updatedPuzzle = puzzle.map((r, rIndex) =>
        rIndex === row ? r.map((c, cIndex) => (cIndex === col ? '' : c)) : r
      );
      setpuzzle(updatedPuzzle);
      return;
    }
    console.log(solvedpuzzle[row][col]);
    if(val===''){
      const updatedPuzzle = puzzle.map((r, rIndex) =>
      rIndex === row ? r.map((c, cIndex) => (cIndex === col ? 0 : c)) : r
    );
    setpuzzle(updatedPuzzle);
    return ;
    }
  
     
      if(!isvalidplace(puzzle,row,col,val)){
        setalt(true);
        setmsg(`You have entered the wrong value`);
        setTimeout(() => {
          setalt(false);
        }, 3000);
        const updatedPuzzle = puzzle.map((r, rIndex) =>
         rIndex === row ? r.map((c, cIndex) => (cIndex === col ? val : c)) : r
        
       );
      
       setpuzzle(updatedPuzzle);
       }else{
       
  
    
      setalt(false);
       const updatedPuzzle = puzzle.map((r, rIndex) =>
       rIndex === row ? r.map((c, cIndex) => (cIndex === col ? val : c)) : r
     );
     if (iscompleted(puzzle)) {

      setShowCelebration(true); 
     setTimeout(() => {
        setShowCelebration(true);
        naviprofile(`/Home`, { state:{} });
     }, 10000);
      console.log(overallTime);
      handlePuzzleSolved(elapsedTime);
      solvesave();
     
    }
    setpuzzle(updatedPuzzle);
      // window.location.reload();
  }
 
  }
  const solvesave=async()=>{
   
    const response=await fetch(`${process.env.REACT_APP_API_KEY}/sudoku/${username}/solved`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
     },
     body :JSON.stringify({
      "game":puzzle,
      "timeTaken":localStorage.getItem('runTime')
  })
  })
}
  
  const butreset=async()=>{
    setpuzzle([...initial]);
  }
  const butsol=async()=>{
    setpuzzle([...solvedpuzzle]);
   
  }
 
 
  
  
      
   
    
  const handlePuzzleSolved = (elapsedTime) => {
    // Calculate total seconds
    const totalSeconds = Math.floor(elapsedTime / 1000);
    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    // Format the time as HH:MM:SS
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // Save the formatted time in localStorage
    localStorage.setItem('runTime', formattedTime);
    // Update overall time
    setOverallTime((prevTime) => prevTime + elapsedTime);
  };
  return (

    <div style={{width:'100%',height:'100vw',position:'relative'}}>
     <Routes>
        <Route path="/mysolvedpuzzle" element={<Solvedpuzzle />}></Route>
        <Route path="/mysavedpuzzle" element={<Savedpuzzle />}></Route>
    </Routes>
    <LoadingBar
        color='#f11946'
        progress={userstate}
      />
     {showCelebration && <CelebrationPage onFinish={() => setShowCelebration(false)} />} {/* Show celebration page */}
       <nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#" style={{fontWeight:'bolder'}}>
      <img src={logo} alt="Logo" width="30" height="24" class="d-inline-block align-text-top" />
      Game of Numbers
    </a>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/Home">Home</Link>
        </li>
</ul>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel" style={{fontWeight:'bold'}}>{username}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <Link class="nav-link active" aria-current="page" to="/mysolvedpuzzle">Solved puzzles</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/mysavedpuzzle">Saved</Link>
          </li>
          <li class="nav-item">
            <button class="nav-link" style={{color:'red',fontWeight:'bold'}}>Logout</button>
          </li>
        </ul>
        
      </div>
    </div>
  </div>
</nav>

    
      
      {alt===true? <div class={`alert alert-danger fade show`} role="alert">
    <strong>{msg}</strong>
    
  </div>:""}
  {agm===true? <div class={`alert alert-success fade show`} role="alert">
    <strong>{gm}</strong>
    
  </div>:""}
  
  
  
  <div class="d-flex justify-content-center align-items-center" style={{}}>
            <table  class="tab1"  style={{backgroundColor:'orange',borderStyle:'solid',borderWidth:'2px',borderColor:'orange',borderCollapse:'collapse',marginRight:'10%'}}>
              <tbody>
                {
                  puzzle.map((row,rindex)=>{
                       return <tr key={rindex} className={(rindex+1)%3===0 && rindex!=8?'rborder':''} >
                       { row.map((col,cindex)=>{
                          return <td key={rindex+cindex} style={{padding:0}} className={(cindex+1)%3===0 && cindex!=8?'cborder':''}>
                            <input className="cellInput" value={puzzle[rindex][cindex]===0?"":puzzle[rindex][cindex]} style={{width:'100%',height:'100%',borderStyle:'solid',borderColor:'black',borderWidth:'1px'}} disabled={initial[rindex][cindex]!==0} onChange={(e)=>onInputChnage(e,rindex,cindex)} maxLength="1"/>
                          </td>
                        })}
                       </tr>
                  })
                }

              </tbody>
            </table>
            <div>
      <h1 className="text-center">Timer</h1>
      <h5><img src={hourglass} alt="" style={{ height: '32px' }} /> {formatTime(elapsedTime)}</h5>
      <div className="d-flex">
        <button className="btn btn-dark rounded-pill" style={{ marginRight: '5%' }} onClick={handleStartPauseClick}>{isRunning ? 'Pause' : 'Start'}</button>
        <button className="btn btn-dark rounded-pill" onClick={handleResetClick}>Reset</button>
      </div>
    </div> 
    </div>
    <div class="d-flex justify-content-center" >
    <button  class="btn btn-dark rounded-pill" type='button' onClick={butreset} style={{margin:'2%'}}>Reset</button>
    <button  class="btn btn-dark rounded-pill" style={{margin:'2%'}} onClick={butsol}>Solve</button>
 
    </div>
    </div>
  )
}
