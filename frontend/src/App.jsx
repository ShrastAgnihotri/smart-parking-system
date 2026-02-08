import React from 'react';
import { ParkingProvider } from './context/ParkingContext';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <ParkingProvider>
      <div className="App">
        <Home />
      </div>
    </ParkingProvider>
  );
}

export default App;