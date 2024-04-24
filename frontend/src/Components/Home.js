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
import LoadingBar from 'react-top-loading-bar';
export default function Home() {
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
  const username = localStorage.getItem('username');
  useEffect(() => {
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
  const newsudoko=async()=>{
    setuserstate(30);
   
   // setIsRunning(false);
    try {
  //console.log("hi")
  const response=await fetch(`${process.env.REACT_APP_API_KEY}/newsudoko`,{
    method:'GET',
    headers:{
      'Content-Type':'application/json',
   }
   
    
   })
   //console.log("bye");
   const data = await response.json();
  // const puzzle = data.game; // Adjust this based on your response structure
  // console.log(puzzle);
   setpuzzle(data.game);
   setinitial(data.game);
setuserstate(70);
   const response2=await fetch(`${process.env.REACT_APP_API_KEY}/solvesudoko`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
   },
   body :JSON.stringify({
    "game":data.game
})
     
   })
   const data2=await response2.json();
   
   setsolvedpuzzle([...data2.game]);
   setuserstate(100);
   console.log(data2.game);
   
   setIsRunning(false);
   setStartTime(0);
   setElapsedTime(0);
   //setIsRunning(true);
   const now = Date.now();
   setStartTime(now - 0);
   setIsRunning(true);

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
     
      const updatedPuzzle = puzzle.map((r, rIndex) =>
       rIndex === row ? r.map((c, cIndex) => (cIndex === col ? val : c)) : r
      
     );
    
     setpuzzle(updatedPuzzle);
     }else{
     

  
      setalt(false);
       const updatedPuzzle = puzzle.map((r, rIndex) =>
       rIndex === row ? r.map((c, cIndex) => (cIndex === col ? val : c)) : r
     );
  //   if (JSON.stringify(updatedPuzzle) === JSON.stringify(solvedpuzzle)) {
if(iscompleted(puzzle)){
      setShowCelebration(true); // Show celebration if puzzle is solved
      // Inside your component or function
// 10000 milliseconds = 10 seconds
// Hide celebration after 10 seconds
     
      console.log(overallTime);
      handlePuzzleSolved(elapsedTime);
      solvesave();
  
    }
     setpuzzle(updatedPuzzle);
      // window.location.reload();
     
  }
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
  const butnew=async()=>{
   // console.log("done");
    await newsudoko();
   // console.log("su");
    
  }
  const butreset=async()=>{
    setpuzzle([...initial]);
  }
  const butsol=async()=>{
    setpuzzle([...solvedpuzzle]);
   
  }
  const navilog=useNavigate();
  const onclog=()=>{
    // Clear all items from localStorage
localStorage.clear();

    navilog(`/login`, { state:{} });
  }
 
  const butdo=async()=>{
    setuserstate(30);
    const response=await fetch(`${process.env.REACT_APP_API_KEY}/${username}/todo`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
     },
     body :JSON.stringify({
      "game":initial
  })
  
  
      
     })
     if(response.status==200){
      setuserstate(100);
      setgm("Puzzle saved");
      setagm(true);
      const timer = setTimeout(() => {
       setagm(false);
      }, 3000); 
     }else{
      setuserstate(100);
      setmsg("Puzzle not saved due to internal error")
      setalt(true);
      const timer = setTimeout(() => {
        setalt(false);
       }, 3000); 
     }
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
            <button class="nav-link" onClick={onclog} style={{color:'red',fontWeight:'bold'}}>Logout</button>
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
            <table class="tab1"  style={{backgroundColor:'orange',borderStyle:'solid',borderWidth:'2px',borderColor:'orange',borderCollapse:'collapse',marginRight:'10%'}}>
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
      <div className="d-flex ">
        <button className="btn btn-dark rounded-pill" style={{ marginRight: '5%' }} onClick={handleStartPauseClick}>{isRunning ? 'Pause' : 'Start'}</button>
        <button className="btn btn-dark rounded-pill" onClick={handleResetClick}>Reset</button>
      </div>
    </div> 
    </div>
    <div class="d-flex justify-content-around align-items-center" >
    <button  class="btn btn-dark rounded-pill" type='button' onClick={butreset} style={{margin:'2%'}}>Reset</button>
    <button  class="btn btn-dark rounded-pill" style={{margin:'2%'}} onClick={butnew}>new Puzzle</button>
    <button  class="btn btn-dark rounded-pill" style={{margin:'2%'}} onClick={butsol}>Solve</button>
    <button  class="btn btn-dark rounded-pill" type="reset" style={{margin:'2%'}} onClick={butdo}>Do Later</button>
    </div>
    </div>
  )
}

