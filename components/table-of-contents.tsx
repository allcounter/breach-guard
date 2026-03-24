'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type Section = { id: string; title: string }

export function TableOfContents({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sections])

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <ul className="space-y-2 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block border-l-2 py-1 pl-3 transition-colors ${
                activeId === s.id
                  ? 'border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function MobileToc({ sections }: { sections: Section[] }) {
  const t = useTranslations('guideLayout')

  return (
    <details className="mb-8 rounded-lg border border-zinc-200 dark:border-zinc-800 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
        {t('toc')}
        <svg
          className="h-4 w-4 transition-transform [[open]>&]:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <nav className="space-y-2 px-4 pb-4">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="block text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
          >
            {s.title}
          </a>
        ))}
      </nav>
    </details>
  )
}
