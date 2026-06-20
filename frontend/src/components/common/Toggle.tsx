import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors" style={{ backgroundColor: checked ? '#14b8a6' : '#d1d5db' }}>
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  );
};
