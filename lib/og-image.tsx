/**
 * Shared OG image layout for dynamic social preview images.
 *
 * Uses next/og ImageResponse (Satori-based JSX → SVG → PNG).
 * Only flexbox is supported — no grid, no box-shadow.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Branded OG image layout with shield icon, title, description, and URL.
 * Dark gradient background with blue-500 accent — matches the app's security theme.
 */
export function OgImageLayout({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #0a0a0f, #1a1a2e)',
        padding: '60px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Brand mark: Shield icon + name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span
          style={{
            fontSize: '32px',
            color: '#3b82f6',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          Breach Guard
        </span>
      </div>

      {/* Page title */}
      <h1
        style={{
          fontSize: '52px',
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          marginTop: '32px',
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
        }}
      >
        {title}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: '24px',
          color: '#a1a1aa',
          textAlign: 'center',
          marginTop: '16px',
          lineHeight: 1.5,
          maxWidth: '800px',
        }}
      >
        {description}
      </p>

      {/* URL footer */}
      <span
        style={{
          fontSize: '20px',
          color: '#3b82f6',
          marginTop: 'auto',
          fontWeight: 500,
        }}
      >
        breachguard.dk
      </span>
    </div>
  )
}
