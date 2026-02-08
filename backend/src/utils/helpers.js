class Helpers {
  /**
   * Format API response
   */
  static formatResponse(success, data, message = '') {
    return {
      success,
      data: data || null,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate unique vehicle number (for demo)
   */
  static generateVehicleNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = () => numbers[Math.floor(Math.random() * numbers.length)];
    
    return `MH${randomLetter()}${randomLetter()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`;
  }

  /**
   * Calculate distance between slots (simple numeric difference)
   */
  static calculateDistance(slotNo1, slotNo2) {
    return Math.abs(slotNo1 - slotNo2);
  }

  /**
   * Format slot status for display
   */
  static formatSlotStatus(slot) {
    const status = slot.isOccupied ? '🟥 Occupied' : '🟩 Available';
    const features = [];
    
    if (slot.isCovered) features.push('☂️ Covered');
    if (slot.isEVCharging) features.push('⚡ EV');
    
    return {
      slotNo: slot.slotNo,
      status,
      features: features.join(' | '),
      vehicleNumber: slot.vehicleNumber || 'None'
    };
  }
}

module.exports = Helpers;