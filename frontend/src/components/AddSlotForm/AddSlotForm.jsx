import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';

const AddSlotForm = () => {
  const { addSlot, loading } = useParking();
  const [formData, setFormData] = useState({
    slotNo: '',
    isCovered: false,
    isEVCharging: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.slotNo.trim()) {
      alert('Please enter a slot number');
      return;
    }

    const slotNumber = parseInt(formData.slotNo);
    if (isNaN(slotNumber) || slotNumber <= 0) {
      alert('Please enter a valid positive slot number');
      return;
    }

    const success = await addSlot({
      slotNo: slotNumber,
      isCovered: formData.isCovered,
      isEVCharging: formData.isEVCharging,
    });

    if (success) {
      setFormData({
        slotNo: '',
        isCovered: false,
        isEVCharging: false,
      });
    }
  };

  return (
    <div className="card">
      <h2>➕ Add Parking Slot</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Slot Number</label>
          <input
            type="number"
            name="slotNo"
            value={formData.slotNo}
            onChange={handleChange}
            placeholder="Enter slot number (e.g., 101)"
            required
            disabled={loading}
          />
        </div>

        <div className="checkbox-container">
          <p className="checkbox-label">Slot Features</p>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isCovered"
              name="isCovered"
              checked={formData.isCovered}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="isCovered">☂️ Covered Parking</label>
          </div>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isEVCharging"
              name="isEVCharging"
              checked={formData.isEVCharging}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="isEVCharging">⚡ EV Charging Available</label>
          </div>
        </div>

        <button 
          type="submit" 
          className="button"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Parking Slot'}
        </button>
      </form>

      <div className="info-box">
        <h4>ℹ️ About Features</h4>
        <ul>
          <li><span className="feature-icon">☂️</span> Covered Parking: Protected from weather</li>
          <li><span className="feature-icon">⚡</span> EV Charging: Electric vehicle charging available</li>
          <li><span className="feature-icon">🔢</span> Slot numbers should be unique and positive</li>
        </ul>
      </div>
    </div>
  );
};

export default AddSlotForm;