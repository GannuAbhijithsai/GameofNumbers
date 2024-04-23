import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const CelebrationPage = ({ onFinish }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
      onFinish(); // Callback function to handle completion
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [onFinish]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'black', zIndex: 9999 }}>
      {showConfetti && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: 'white' }}>
          <h1>You have won the game!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </div>
  );
};

export default CelebrationPage;
