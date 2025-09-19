import React, { useState } from 'react';

interface ToggleOption {
  label: string;
  value: string;
}

interface DynamicToggleProps {
  options: ToggleOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const DynamicToggle: React.FC<DynamicToggleProps> = ({
  options,
  defaultValue,
  onChange,
  className = ""
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value);

  const handleToggle = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  const selectedIndex = options.findIndex(option => option.value === selectedValue);

  return (
    <div className={`relative inline-flex items-center p-1 bg-gray-100 rounded-full border border-gray-200 ${className}`}>
      {/* Background slider */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-full shadow-md border border-gray-200 transition-all duration-300 ease-out"
        style={{
          left: `${(selectedIndex / options.length) * 100}%`,
          width: `${100 / options.length}%`,
          transform: 'translateX(4px)',
        }}
      />

      {/* Options */}
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => handleToggle(option.value)}
          className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out ${
            selectedValue === option.value
              ? 'text-gray-900'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{ minWidth: `${100 / options.length}%` }}
        >
          {option.label}
        </button>
      ))}

      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300"
        style={{
          opacity: selectedIndex >= 0 ? 0.5 : 0,
        }}
      />
    </div>
  );
};

export default DynamicToggle;