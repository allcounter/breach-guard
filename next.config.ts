import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const isDev = process.env.NODE_ENV === 'development'

// Build CSP as array of directives then join — trailing whitespace or missing
// semicolons cause silent CSP failures, so structured approach is safer.
const cspDirectives = [
  "default-src 'self'",
  // TRADEOFF: 'unsafe-inline' is required for Next.js inline hydration scripts when using
  // static CSP (no middleware nonce injection). Eliminating it requires nonce-based CSP via
  // middleware, which forces dynamic rendering on every page — unacceptable for a static site.
  // This is a known Next.js limitation: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  // connect-src: explicitly allow both external APIs used by the app.
  // api.pwnedpasswords.com: called directly from the browser (HIBP k-anonymity, client-side).
  // api.xposedornot.com: called from the Route Handler server-side only.
  "connect-src 'self' https://api.pwnedpasswords.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Prevent the page from being embedded in iframes, objects, or embeds.
  "frame-src 'none'",
  // Block all plugin types (Flash, Java, etc.)
  "worker-src 'self'",
  // Restrict where <a ping> and navigator.sendBeacon can send data.
  "manifest-src 'self'",
  // upgrade-insecure-requests breaks localhost in Safari (upgrades HTTP→HTTPS, which fails)
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
]

const cspHeader = cspDirectives.join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            // HSTS: 2 years, include subdomains, enable preload list submission.
            // max-age=63072000 is the minimum for preload list.
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // X-Frame-Options: prevent clickjacking. SAMEORIGIN allows same-origin iframes
            // (used internally by Next.js dev tools). DENY would be stricter.
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Prevents browsers from MIME-sniffing a response away from the declared content-type.
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Referrer-Policy: send origin only when cross-origin (not full URL).
            // Protects user email addresses from appearing in referrer headers.
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            // Permissions-Policy: disable sensors not used by this app.
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            // Cross-Origin-Opener-Policy: isolates the browsing context.
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      // API routes: prevent caching and indexing of sensitive endpoints.
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(withBundleAnalyzer(nextConfig))
