'use client'

type FaqItem = { question: string; answer: string }

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {items.map((item, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
            {item.question}
            <svg
              className="ml-4 h-4 w-4 flex-shrink-0 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
