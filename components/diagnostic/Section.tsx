'use client';

import { Section as SectionType } from '@/lib/types/diagnostic';
import Question from './Question';

interface SectionProps {
  section: SectionType;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (questionId: string, value: unknown) => void;
  startingQuestionNumber?: number;
}

export default function Section({
  section,
  values,
  errors,
  onChange,
  startingQuestionNumber,
}: SectionProps) {
  return (
    <div className="py-8">
      <div className="mb-8 pb-6 border-b border-[#e5e7eb]">
        <h2 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">
          {section.title}
        </h2>
        {section.description && (
          <p className="mt-2 text-[#6b7280] leading-relaxed">
            {section.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {section.questions.map((question, index) => (
          <Question
            key={question.id}
            question={question}
            value={values[question.id]}
            onChange={(value) => onChange(question.id, value)}
            error={errors[question.id]}
            questionNumber={
              startingQuestionNumber !== undefined
                ? startingQuestionNumber + index
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
