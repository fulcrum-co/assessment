'use client';

import { forwardRef } from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, error, disabled }, ref) => {
    return (
      <div ref={ref} className="space-y-3" role="radiogroup" aria-label={name}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
              value === option.value
                ? 'border-[#2563eb] bg-[#2563eb]/5'
                : 'border-[#e5e7eb] hover:border-[#6b7280]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center h-6">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  value === option.value
                    ? 'border-[#2563eb]'
                    : 'border-[#e5e7eb]'
                }`}
              >
                {value === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                )}
              </div>
            </div>
            <span className="text-[#1a1a1a] leading-relaxed">{option.label}</span>
          </label>
        ))}
        {error && (
          <p className="text-sm text-[#dc2626] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
