import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import logo from './numbers.png'
import LoadingBar from 'react-top-loading-bar';
const SolvedPuzzle = () => {
  const [userstate,setuserstate]=useState(0);
  const [solPuzzle, setSolPuzzle] = useState([]);
  const username = localStorage.getItem('username');

  const fetchData = async () => {
    setuserstate(30);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/${username}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSolPuzzle([...data.solvedBoards]);
      setuserstate(100);
    } catch (error) {
      setuserstate(100);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderSudokuRows = () => {
    
    return solPuzzle.map((puzzle, index) => (
    
      <div className="col-md-4 mb-3" key={index}>
         <table  style={{width:'80%',height:'80%',backgroundColor:'orange',borderStyle:'solid',borderWidth:'2px',borderColor:'orange',borderCollapse:'collapse',marginRight:'10%'}}>
              <tbody>
                {
                  puzzle.board.map((row,rindex)=>{
                       return <tr key={rindex} className={(rindex+1)%3===0 && rindex!=8?'rborder':''} >
                       { row.map((col,cindex)=>{
                          return <td key={rindex+cindex} style={{padding:0}} className={(cindex+1)%3===0 && cindex!=8?'cborder':''}>
                            <input className="cellInput" value={col}style={{width:'100%',height:'100%',borderStyle:'solid',borderColor:'black',borderWidth:'1px'}}  maxLength="1"/>
                          </td>
                        })}
                       </tr>
                  })
                }

              </tbody>
            </table>
        {/* Display Sudoku board */}
       
        {/* Display time taken */}
        <div className="" style={{width:'80%'}}><p class="text-center" style={{color:'#939B22',fontWeight:'bold'}}>Time taken to solve: {puzzle.timeTaken}</p></div>
      </div>
    
    ));
    
  };

  return (
    <div className="" style={{width:'100%',height:'100%',position:'fixed',overflowY:'auto'}}>
        <LoadingBar
        color='#f11946'
        progress={userstate}
      />
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
  </div>
</nav>
      <h2 class="text-center" style={{marginTop:'1%',marginBottom:'2%',fontWeight:'bold',fontStyle:'oblique',color:'green'}}>Solved Puzzles</h2>
      {solPuzzle.length > 0 ? (
        <div className="container" style={{width:'100%',height:'100%'}}>
          <div class="row">{renderSudokuRows()}</div>
          </div>
      ) : (
        <p>No solved puzzles available.</p>
      )}
    </div>
  );
};

export default SolvedPuzzle;
