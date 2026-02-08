import React, { createContext, useState, useContext, useEffect } from 'react';
import { parkingApi, vehicleApi } from '../services/api';

const ParkingContext = createContext();

export const useParking = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Show message
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [slotsRes, statsRes] = await Promise.all([
        parkingApi.getAllSlots(),
        parkingApi.getStats()
      ]);
      
      if (slotsRes.data.success) setSlots(slotsRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (error) {
      showMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add parking slot
  const addSlot = async (slotData) => {
    setLoading(true);
    try {
      const response = await parkingApi.addSlot(slotData);
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        await loadData();
        return true;
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to add slot', 'error');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Park vehicle
  const parkVehicle = async (vehicleData) => {
    setLoading(true);
    try {
      const response = await vehicleApi.parkVehicle(vehicleData);
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        await loadData();
        return response.data.data;
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to park vehicle', 'error');
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Remove vehicle
  const removeVehicle = async (slotNo) => {
    setLoading(true);
    try {
      const response = await vehicleApi.removeVehicle(slotNo);
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        await loadData();
        return true;
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to remove vehicle', 'error');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Delete slot
  const deleteSlot = async (slotNo) => {
    setLoading(true);
    try {
      const response = await parkingApi.deleteSlot(slotNo);
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        await loadData();
        return true;
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to delete slot', 'error');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const value = {
    slots,
    vehicles,
    stats,
    loading,
    message,
    addSlot,
    parkVehicle,
    removeVehicle,
    deleteSlot,
    loadData,
    showMessage,
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};