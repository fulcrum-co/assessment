'use client';

const valueProps = [
  {
    number: '01',
    title: 'Identify Your Highest-Leverage Constraints',
    description:
      'Pinpoint the few decisions, systems, or ownership gaps that are quietly limiting progress—even if your strategy is sound.',
    bgColor: 'bg-[#eff6ff]', // Pastel Blue
  },
  {
    number: '02',
    title: 'Understand Why Execution Is Stalling',
    description:
      'See where alignment, accountability, or operational structure is breaking down and slowing momentum.',
    bgColor: 'bg-[#f0fdf4]', // Pastel Green
  },
  {
    number: '03',
    title: 'Clarify the Right Next Move',
    description:
      'Leave with a clear picture of what must change in the next 90 days to regain traction and build sustainable momentum.',
    bgColor: 'bg-[#fffbeb]', // Pastel Amber
  },
];

export default function ValueProps() {
  return (
    <section className="py-16 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {valueProps.map((prop) => (
            <div
              key={prop.number}
              className={`${prop.bgColor} rounded-xl p-8 relative`}
            >
              <span className="absolute top-6 right-6 text-sm font-medium text-[#6b7280]/50">
                {prop.number}
              </span>
              <h3 className="text-lg font-semibold text-[#1a1a1a] pr-8 leading-snug">
                {prop.title}
              </h3>
              <p className="mt-4 text-[#6b7280] leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
