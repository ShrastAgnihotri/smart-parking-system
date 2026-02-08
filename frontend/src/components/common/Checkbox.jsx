import React from 'react';

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;