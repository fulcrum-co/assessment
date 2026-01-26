'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange: (value: string) => void;
  minLength?: number;
  maxLength?: number;
  showCount?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, onChange, minLength, maxLength, showCount = true, value = '', className = '', ...props }, ref) => {
    const currentLength = String(value).length;
    const isUnderMin = minLength ? currentLength < minLength : false;
    const isOverMax = maxLength ? currentLength > maxLength : false;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            {label}
            {props.required && <span className="text-[#dc2626] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-150 text-[#1a1a1a] placeholder:text-[#6b7280] resize-y min-h-[120px] ${
            error || isOverMax
              ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/20'
              : 'border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
          } ${className}`}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          {error ? (
            <p className="text-sm text-[#dc2626]">{error}</p>
          ) : (
            <span />
          )}
          {showCount && (maxLength || minLength) && (
            <p className={`text-sm ${
              isOverMax ? 'text-[#dc2626]' : isUnderMin ? 'text-[#d97706]' : 'text-[#6b7280]'
            }`}>
              {currentLength}
              {minLength && !maxLength && ` / ${minLength} min`}
              {maxLength && !minLength && ` / ${maxLength}`}
              {minLength && maxLength && ` (${minLength}-${maxLength})`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
