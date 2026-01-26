'use client';

import { forwardRef } from 'react';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  error?: string;
  disabled?: boolean;
}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ name, options, value = [], onChange, maxSelections, error, disabled }, ref) => {
    const handleChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        if (maxSelections && value.length >= maxSelections) {
          return;
        }
        onChange([...value, optionValue]);
      } else {
        onChange(value.filter((v) => v !== optionValue));
      }
    };

    const isMaxReached = maxSelections ? value.length >= maxSelections : false;

    return (
      <div ref={ref} className="space-y-3" role="group" aria-label={name}>
        {maxSelections && (
          <p className="text-sm text-[#6b7280] mb-2">
            Select up to {maxSelections} option{maxSelections > 1 ? 's' : ''}
            {value.length > 0 && ` (${value.length} selected)`}
          </p>
        )}
        {options.map((option) => {
          const isChecked = value.includes(option.value);
          const isDisabled = disabled || (!isChecked && isMaxReached);

          return (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                isChecked
                  ? 'border-[#2563eb] bg-[#2563eb]/5'
                  : 'border-[#e5e7eb] hover:border-[#6b7280]'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                  disabled={isDisabled}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'border-[#2563eb] bg-[#2563eb]'
                      : 'border-[#e5e7eb]'
                  }`}
                >
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[#1a1a1a] leading-relaxed">{option.label}</span>
            </label>
          );
        })}
        {error && (
          <p className="text-sm text-[#dc2626] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
