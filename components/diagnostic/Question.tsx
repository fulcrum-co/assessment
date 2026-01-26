'use client';

import { Question as QuestionType } from '@/lib/types/diagnostic';
import { RadioGroup, CheckboxGroup, TextInput, TextArea, PercentageGroup } from '@/components/ui';

interface QuestionProps {
  question: QuestionType;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  questionNumber?: number;
}

export default function Question({
  question,
  value,
  onChange,
  error,
  questionNumber,
}: QuestionProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup
            name={question.id}
            options={question.options || []}
            value={value as string}
            onChange={onChange}
            error={error}
          />
        );

      case 'checkbox':
        return (
          <CheckboxGroup
            name={question.id}
            options={question.options || []}
            value={(value as string[]) || []}
            onChange={onChange}
            maxSelections={question.maxSelections}
            error={error}
          />
        );

      case 'text':
        return (
          <TextInput
            name={question.id}
            value={(value as string) || ''}
            onChange={onChange}
            placeholder={question.placeholder}
            required={question.required}
            error={error}
            type={question.id === 'email' ? 'email' : 'text'}
          />
        );

      case 'textarea':
        return (
          <TextArea
            name={question.id}
            value={(value as string) || ''}
            onChange={onChange}
            placeholder={question.placeholder}
            required={question.required}
            minLength={question.minLength}
            maxLength={question.maxLength}
            error={error}
          />
        );

      case 'percentage_group':
        return (
          <PercentageGroup
            fields={(question.options || []).map((opt) => ({
              id: opt.value,
              label: opt.label,
            }))}
            value={(value as Record<string, number>) || {
              fullTime: 0,
              partTime: 0,
              external: 0,
              leadership: 0,
            }}
            onChange={onChange}
            error={error}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-[#1a1a1a]">
          {questionNumber !== undefined && (
            <span className="text-[#6b7280] mr-2">{questionNumber}.</span>
          )}
          {question.text}
          {question.required && <span className="text-[#dc2626] ml-1">*</span>}
        </h3>
      </div>
      {renderInput()}
    </div>
  );
}
