import React from 'react';
import { useParking } from '../../context/ParkingContext';

const OutputPanel = () => {
  const { message, stats, loading } = useParking();

  const getMessageClass = (type) => {
    switch (type) {
      case 'success': return 'message-success';
      case 'error': return 'message-error';
      case 'warning': return 'message-warning';
      default: return 'message-info';
    }
  };

  return (
    <div className="card">
      <h2>📊 System Output</h2>
      
      {/* Message Display */}
      {message.text && (
        <div className="message-container">
          <div className={`message ${getMessageClass(message.type)}`}>
            <span className="message-icon">
              {message.type === 'success' ? '✅' : 
               message.type === 'error' ? '❌' : 
               message.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <p className="message-text">{message.text}</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="stats-section">
          <h3>Parking Statistics</h3>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{stats.totalSlots || 0}</div>
              <div className="stat-label">Total Slots</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.availableSlots || 0}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.occupiedSlots || 0}</div>
              <div className="stat-label">Occupied</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.occupancyRate || 0}%</div>
              <div className="stat-label">Occupancy Rate</div>
            </div>
          </div>
          
          <div className="detail-stats">
            <div className="detail-stat">
              <div className="detail-label">Covered Slots</div>
              <div className="detail-value">{stats.coveredSlots || 0}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-label">EV Charging Slots</div>
              <div className="detail-value">{stats.evSlots || 0}</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Processing...</p>
        </div>
      )}

      {/* System Status */}
      <div className="system-status">
        <h4>System Status</h4>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span className="status-text">System is operational</span>
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;