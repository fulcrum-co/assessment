'use client';

import Link from 'next/link';

export default function AssessmentPreview() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">
          What to Expect
        </h2>
        <p className="mt-6 text-[#6b7280] leading-relaxed">
          This assessment takes approximately 20-25 minutes to complete. You&apos;ll
          receive a comprehensive diagnostic report analyzing your organization
          across six dimensions, with specific recommendations based on your
          responses.
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-8 text-left">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f9fafb] mb-4">
              <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1a1a1a]">38 Questions</h3>
            <p className="mt-2 text-sm text-[#6b7280]">
              Across 8 strategic dimensions
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f9fafb] mb-4">
              <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1a1a1a]">Detailed Scoring</h3>
            <p className="mt-2 text-sm text-[#6b7280]">
              6 dimensions with pattern detection
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f9fafb] mb-4">
              <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1a1a1a]">PDF Report</h3>
            <p className="mt-2 text-sm text-[#6b7280]">
              5-page personalized diagnostic
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#2563eb] rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm"
          >
            Begin Assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
