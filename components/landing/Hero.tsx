'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-[#1a1a1a] tracking-tight leading-tight">
          Fulcrum Leverage Assessment
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-[#6b7280] leading-relaxed max-w-3xl mx-auto">
          Identify where momentum is breaking down in your organization—and where
          focused action can create outsized impact across strategy, operations,
          and execution.
        </p>
        <div className="mt-10">
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
