import React from 'react';
import './App.css';
import Canvas from './canvas';

const App = () => {
  const [size] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  return (
    <div className="App">
      <Canvas size={size} />
    </div>
  );
};

export default App;
