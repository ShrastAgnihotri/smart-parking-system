import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://smart-parking-system-b9jy.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Parking API calls
export const parkingApi = {
  // Add parking slot
  addSlot: (slotData) => api.post('/parking/add', slotData),
  
  // Get all slots
  getAllSlots: () => api.get('/parking/all'),
  
  // Get statistics
  getStats: () => api.get('/parking/stats'),
  
  // Delete slot
  deleteSlot: (slotNo) => api.delete(`/parking/delete/${slotNo}`),
};

// Vehicle API calls
export const vehicleApi = {
  // Park vehicle
  parkVehicle: (vehicleData) => api.post('/vehicle/park', vehicleData),
  
  // Remove vehicle
  removeVehicle: (slotNo) => api.post('/vehicle/remove', { slotNo }),
  
  // Get all vehicles
  getAllVehicles: () => api.get('/vehicle/all'),
  
  // Generate demo vehicle number
  generateDemoVehicle: () => api.get('/vehicle/generate-demo'),
};

export default api;