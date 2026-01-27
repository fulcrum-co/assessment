'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e7eb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="https://www.fulcrumcollective.io" className="flex items-center">
            <Image
              src="/fulcrum-logo.png"
              alt="Fulcrum Collective"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* CTA */}
          <a
            href="https://cal.com/fulcrumcollective/discovery-call"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
          >
            Schedule a Strategy Call
          </a>
        </div>
      </div>
    </header>
  );
}
