'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';

function CompleteContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!id) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/report/${id}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Diagnostic_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#059669]/10 mb-4">
            <svg className="w-8 h-8 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a] tracking-tight">
            Diagnostic Complete
          </h1>
          <p className="mt-2 text-[#6b7280] text-lg">
            Your personalized report is ready
          </p>
        </div>

        {/* Main Card */}
        <Card variant="bordered" className="mb-8">
          <div className="text-center py-4">
            <div className="w-16 h-20 mx-auto mb-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
              Your Organizational Leverage Report
            </h2>
            <p className="text-[#6b7280] mb-6">
              5-page personalized diagnostic report
            </p>
            <Button
              onClick={handleDownload}
              isLoading={isDownloading}
              className="min-w-[200px]"
            >
              {isDownloading ? 'Downloading...' : 'Download Report'}
            </Button>
          </div>
        </Card>

        {/* What's Next */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">What happens next?</h3>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] font-semibold text-sm">
              1
            </div>
            <div>
              <h4 className="font-medium text-[#1a1a1a]">Check your email</h4>
              <p className="text-[#6b7280] text-sm mt-1">
                We&apos;ve sent a copy of your report to your email address.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] font-semibold text-sm">
              2
            </div>
            <div>
              <h4 className="font-medium text-[#1a1a1a]">Review your findings</h4>
              <p className="text-[#6b7280] text-sm mt-1">
                Your report includes detailed analysis across six dimensions, pattern identification, and prioritized recommendations.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] font-semibold text-sm">
              3
            </div>
            <div>
              <h4 className="font-medium text-[#1a1a1a]">Schedule a conversation (optional)</h4>
              <p className="text-[#6b7280] text-sm mt-1">
                If you&apos;re interested in discussing your findings, we&apos;ll reach out to schedule a diagnostic review call.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#e5e7eb] text-center">
          <p className="text-[#6b7280] text-sm mb-4">
            Questions about your report?
          </p>
          <a
            href="mailto:joe@fulcrumcollective.io"
            className="text-[#2563eb] hover:underline"
          >
            joe@fulcrumcollective.io
          </a>
          <div className="mt-8">
            <Link href="/" className="text-[#6b7280] hover:text-[#1a1a1a] text-sm">
              ← Back to Fulcrum Collective
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
        <p className="text-[#6b7280]">Loading...</p>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompleteContent />
    </Suspense>
  );
}
