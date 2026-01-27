import { Header, Hero, ValueProps, AssessmentPreview } from '@/components/landing';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ValueProps />
        <AssessmentPreview />
      </main>
      <footer className="py-12 border-t border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6b7280]">
              Fulcrum Collective &middot; Strategy-to-Execution Partnership
            </p>
            <a
              href="https://www.fulcrumcollective.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
            >
              fulcrumcollective.io
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
