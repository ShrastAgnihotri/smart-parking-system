import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';

const SlotList = () => {
  const { slots, removeVehicle, deleteSlot, loading } = useParking();
  const [filters, setFilters] = useState({
    showAvailable: false,
    showOccupied: false,
    showCovered: false,
    showEV: false,
  });

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // const filteredSlots = slots.filter(slot => {
    const filteredSlots = (slots || []).filter(slot => {
    if (filters.showAvailable && slot.status && !slot.status.includes('Available')) return false;
    if (filters.showOccupied && slot.status && !slot.status.includes('Occupied')) return false;
    if (filters.showCovered && slot.features && !slot.features.includes('Covered')) return false;
    if (filters.showEV && slot.features && !slot.features.includes('EV')) return false;
    return true;
  });

  const handleRemoveVehicle = async (slotNo) => {
    if (window.confirm(`Are you sure you want to remove vehicle from Slot ${slotNo}?`)) {
      await removeVehicle(slotNo);
    }
  };

  const handleDeleteSlot = async (slotNo) => {
    if (window.confirm(`Are you sure you want to delete Slot ${slotNo}? This cannot be undone.`)) {
      await deleteSlot(slotNo);
    }
  };

  return (
    <div className="card">
      <div className="slot-list-header">
        {/* <h2>🅿️ All Parking Slots ({slots.length})</h2> */}
        <h2>🅿️ All Parking Slots ({slots?.length || 0})</h2>
        
        <div className="filters-container">
          <button
            className={`filter-btn ${filters.showAvailable ? 'active' : ''}`}
            onClick={() => toggleFilter('showAvailable')}
          >
            🟩 Available
          </button>
          <button
            className={`filter-btn ${filters.showOccupied ? 'active' : ''}`}
            onClick={() => toggleFilter('showOccupied')}
          >
            🟥 Occupied
          </button>
          <button
            className={`filter-btn ${filters.showCovered ? 'active' : ''}`}
            onClick={() => toggleFilter('showCovered')}
          >
            ☂️ Covered
          </button>
          <button
            className={`filter-btn ${filters.showEV ? 'active' : ''}`}
            onClick={() => toggleFilter('showEV')}
          >
            ⚡ EV
          </button>
        </div>
      </div>

      {/* {loading && slots.length === 0 ? ( */}
      {loading && (slots?.length || 0) === 0 ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading slots...</p>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🅿️</div>
          <p>No slots found matching your filters</p>
        </div>
      ) : (
        <div className="slots-container">
          {filteredSlots.map((slot) => (
            <div
              key={slot.slotNo}
              className={`slot-card ${slot.status && slot.status.includes('Occupied') ? 'occupied' : 'available'}`}
            >
              <div className="slot-header">
                <div>
                  <div className="slot-number">Slot {slot.slotNo}</div>
                  <div className={`status-badge ${slot.status && slot.status.includes('Occupied') ? 'occupied-badge' : 'available-badge'}`}>
                    {slot.status || 'Unknown'}
                  </div>
                </div>
                <div className="slot-info">
                  {slot.vehicleNumber && slot.vehicleNumber !== 'None' && (
                    <p className="vehicle-info">Vehicle: {slot.vehicleNumber}</p>
                  )}
                </div>
              </div>

              <div className="features-section">
                <p className="features-label">Features:</p>
                <div className="features">
                  {slot.features && slot.features.split(' | ').map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                  {(!slot.features || slot.features === '') && (
                    <span className="feature-tag">No special features</span>
                  )}
                </div>
              </div>

              <div className="slot-actions">
                {slot.status && slot.status.includes('Occupied') ? (
                  <button
                    className="button button-danger"
                    onClick={() => handleRemoveVehicle(slot.slotNo)}
                    disabled={loading}
                  >
                    Remove Vehicle
                  </button>
                ) : (
                  <button
                    className="button button-success"
                    disabled
                  >
                    Available
                  </button>
                )}
                <button
                  className="button button-secondary"
                  onClick={() => handleDeleteSlot(slot.slotNo)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* {slots.length > 0 && ( */}
      {(slots?.length || 0) > 0 && (
        <div className="summary-bar">
          <div>
            <span className="summary-label">Available:</span>{' '}
            <span className="summary-value">{(slots || []).filter(s => s.status && s.status.includes('Available')).length}</span>
          </div>
          <div>
            <span className="summary-label">Occupied:</span>{' '}
            <span className="summary-value">{(slots || []).filter(s => s.status && s.status.includes('Occupied')).length}</span>
          </div>
          <div>
            <span className="summary-label">Showing:</span>{' '}
            <span className="summary-value">{filteredSlots.length}/{slots?.length || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotList;