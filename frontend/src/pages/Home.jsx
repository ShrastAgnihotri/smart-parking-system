import React from 'react';
import AddSlotForm from '../components/AddSlotForm/AddSlotForm';
import SlotList from '../components/SlotList/SlotList';
import ParkRemoveVehicle from '../components/ParkRemoveVehicle/ParkRemoveVehicle';
import OutputPanel from '../components/OutputPanel/OutputPanel';

const Home = () => {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>🅿️ Smart Parking Lot System</h1>
        <p>Automated parking slot management and allocation system</p>
      </header>

      {/* Main Content */}
      <div className="dashboard">
        {/* Left Column - Forms */}
        <div className="left-column">
          <AddSlotForm />
          <ParkRemoveVehicle />
        </div>

        {/* Right Column - Display */}
        <div className="right-column">
          <SlotList />
          <OutputPanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Smart Parking System v1.0 • Automated Slot Allocation • Built with MERN Stack</p>
        <p className="footer-note">Note: Data persists in your browser's local storage</p>
      </footer>
    </div>
  );
};

export default Home;