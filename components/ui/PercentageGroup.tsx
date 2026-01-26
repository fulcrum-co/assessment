'use client';

import { forwardRef } from 'react';

interface PercentageField {
  id: string;
  label: string;
}

interface PercentageGroupProps {
  fields: PercentageField[];
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  error?: string;
}

const PercentageGroup = forwardRef<HTMLDivElement, PercentageGroupProps>(
  ({ fields, value, onChange, error }, ref) => {
    const total = Object.values(value).reduce((sum, v) => sum + (v || 0), 0);
    const isValid = total === 100;

    const handleChange = (fieldId: string, newValue: string) => {
      const numValue = Math.max(0, Math.min(100, parseInt(newValue) || 0));
      onChange({
        ...value,
        [fieldId]: numValue,
      });
    };

    return (
      <div ref={ref} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center gap-4">
            <label className="flex-1 text-[#1a1a1a]">{field.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={value[field.id] || 0}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={`w-20 px-3 py-2 rounded-lg border text-right transition-all duration-150 ${
                  !isValid
                    ? 'border-[#d97706] focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20'
                    : 'border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                }`}
              />
              <span className="text-[#6b7280]">%</span>
            </div>
          </div>
        ))}
        <div className={`flex items-center justify-between pt-4 border-t border-[#e5e7eb] ${
          isValid ? 'text-[#059669]' : 'text-[#d97706]'
        }`}>
          <span className="font-medium">Total</span>
          <span className="font-medium">{total}%</span>
        </div>
        {!isValid && (
          <p className="text-sm text-[#d97706]">
            Percentages must add up to 100% (currently {total}%)
          </p>
        )}
        {error && (
          <p className="text-sm text-[#dc2626]">{error}</p>
        )}
      </div>
    );
  }
);

PercentageGroup.displayName = 'PercentageGroup';

export default PercentageGroup;
