'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange: (value: string) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, onChange, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            {label}
            {props.required && <span className="text-[#dc2626] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-150 text-[#1a1a1a] placeholder:text-[#6b7280] ${
            error
              ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/20'
              : 'border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#dc2626] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
