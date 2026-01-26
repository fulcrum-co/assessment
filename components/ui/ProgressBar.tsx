'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({ current, total, showLabel = true }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#6b7280]">
            Section {current} of {total}
          </span>
          <span className="text-sm text-[#6b7280]">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-1 bg-[#e5e7eb] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2563eb] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
