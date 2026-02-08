import React, { useState, useEffect } from 'react';
import { useParking } from '../../context/ParkingContext';
import { vehicleApi } from '../../services/api';

const ParkRemoveVehicle = () => {
  const { parkVehicle, removeVehicle, slots, loading } = useParking();
  const [parkForm, setParkForm] = useState({
    vehicleNumber: '',
    needsEV: false,
    needsCover: false,
  });
  const [removeForm, setRemoveForm] = useState({
    slotNo: '',
  });
  const [demoVehicle, setDemoVehicle] = useState('');

  useEffect(() => {
    generateDemoVehicleNumber();
  }, []);

  const generateDemoVehicleNumber = async () => {
    try {
      const response = await vehicleApi.generateDemoVehicle();
      if (response.data.success) {
        setDemoVehicle(response.data.data.vehicleNumber);
      }
    } catch (error) {
      console.error('Failed to generate demo vehicle:', error);
    }
  };

  const handleParkChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParkForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRemoveChange = (e) => {
    setRemoveForm({
      slotNo: e.target.value
    });
  };

  const handleParkSubmit = async (e) => {
    e.preventDefault();
    
    if (!parkForm.vehicleNumber.trim()) {
      alert('Please enter a vehicle number');
      return;
    }

    await parkVehicle(parkForm);
    setParkForm({
      vehicleNumber: '',
      needsEV: false,
      needsCover: false,
    });
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    
    if (!removeForm.slotNo.trim()) {
      alert('Please enter a slot number');
      return;
    }

    const slotNumber = parseInt(removeForm.slotNo);
    if (isNaN(slotNumber)) {
      alert('Please enter a valid slot number');
      return;
    }

    await removeVehicle(slotNumber);
    setRemoveForm({ slotNo: '' });
  };

  const useDemoVehicle = () => {
    setParkForm(prev => ({
      ...prev,
      vehicleNumber: demoVehicle
    }));
    generateDemoVehicleNumber();
  };

  const occupiedSlots = slots.filter(slot => slot.status && slot.status.includes('Occupied'));

  return (
    <div className="card">
      <h2>🚗 Park / Remove Vehicle</h2>
      
      {/* Park Vehicle Section */}
      <div className="section-divider"></div>
      <h3>🅿️ Park Vehicle</h3>
      
      <form onSubmit={handleParkSubmit}>
        <div className="form-group">
          <label>Vehicle Number</label>
          <div className="vehicle-input-container">
            <input
              type="text"
              name="vehicleNumber"
              value={parkForm.vehicleNumber}
              onChange={handleParkChange}
              placeholder="Enter vehicle number (e.g., MH12AB1234)"
              disabled={loading}
            />
            <button 
              type="button" 
              className="button-secondary"
              onClick={useDemoVehicle}
              style={{marginTop: '10px', padding: '10px'}}
            >
              Use Demo: {demoVehicle}
            </button>
          </div>
        </div>

        <div className="checkbox-container">
          <p className="checkbox-label">Vehicle Requirements</p>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="needsEV"
              name="needsEV"
              checked={parkForm.needsEV}
              onChange={handleParkChange}
              disabled={loading}
            />
            <label htmlFor="needsEV">🔋 Needs EV Charging</label>
          </div>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="needsCover"
              name="needsCover"
              checked={parkForm.needsCover}
              onChange={handleParkChange}
              disabled={loading}
            />
            <label htmlFor="needsCover">☂️ Needs Covered Parking</label>
          </div>
        </div>

        <div className="info-box">
          <p><strong>Note:</strong> System will find the nearest available slot matching your requirements. If no matching slot found, you'll see "No slot available".</p>
        </div>

        <button 
          type="submit" 
          className="button button-success"
          disabled={loading}
        >
          {loading ? 'Finding Slot...' : 'Find & Park Vehicle'}
        </button>
      </form>

      {/* Remove Vehicle Section */}
      <div className="section-divider"></div>
      <h3>🚪 Remove Vehicle</h3>
      
      <form onSubmit={handleRemoveSubmit}>
        <div className="form-group">
          <label>Select Occupied Slot</label>
          <select
            value={removeForm.slotNo}
            onChange={handleRemoveChange}
            disabled={loading || occupiedSlots.length === 0}
          >
            <option value="">Select a slot...</option>
            {occupiedSlots.map(slot => (
              <option key={slot.slotNo} value={slot.slotNo}>
                Slot {slot.slotNo} - {slot.vehicleNumber}
              </option>
            ))}
          </select>
          
          {occupiedSlots.length === 0 && (
            <p className="empty-message">No occupied slots available</p>
          )}
        </div>

        <div className="or-divider">
          <span>or</span>
        </div>

        <div className="form-group">
          <label>Enter Slot Number</label>
          <input
            type="number"
            name="slotNo"
            value={removeForm.slotNo}
            onChange={handleRemoveChange}
            placeholder="Enter slot number to free"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="button button-danger"
          disabled={loading || !removeForm.slotNo}
        >
          {loading ? 'Removing...' : 'Remove Vehicle & Free Slot'}
        </button>
      </form>

      <div className="info-box">
        <h4>ℹ️ How it works</h4>
        <ul>
          <li>• Park: Finds nearest slot matching your vehicle's needs</li>
          <li>• Remove: Frees the slot for other vehicles</li>
          <li>• EV slots only for electric vehicles</li>
          <li>• Covered slots protect from weather</li>
        </ul>
      </div>
    </div>
  );
};

export default ParkRemoveVehicle;