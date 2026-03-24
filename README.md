# Breach Guard

[![Live](https://img.shields.io/badge/live-breach--guard-blue?style=flat-square)](https://breach-guard-theta.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org)

Free, open-source identity protection tool. Check if your email or password has been exposed in known data breaches — no accounts, no tracking, no cost.

**[breach-guard-theta.vercel.app](https://breach-guard-theta.vercel.app)**

---

## Security architecture

### Password check — zero-knowledge design

Passwords never leave the browser. The check uses the [HIBP k-Anonymity model](https://haveibeenpwned.com/API/v3#PwnedPasswords):

```
User types password
    → SHA-1 hash in browser (SubtleCrypto)
    → Send only first 5 hex chars to api.pwnedpasswords.com
    → Receive ~500 matching suffixes
    → Compare locally — full hash never transmitted
```

**Key file:** [`lib/hibp.ts`](lib/hibp.ts) — client-side only, no server involvement.

Padding is enabled (`Add-Padding: true`) to prevent response-length analysis.

### Email breach check — server-side proxy

Email checks go through a server-side API route to prevent exposing user IPs to third parties:

```
Browser → POST /api/breach/email (email in body)
    → Server validates with Zod (RFC 5321 length check)
    → Rate limit check (dual: per-IP burst + global daily quota)
    → Check SHA-256 response cache (hashed keys, never raw email)
    → Proxy to api.xposedornot.com
    → Enrich with curated breach metadata
    → Return to browser
```

**Key files:**
- [`app/api/breach/email/route.ts`](app/api/breach/email/route.ts) — API route with rate limiting, caching, input validation
- [`lib/rate-limiter.ts`](lib/rate-limiter.ts) — dual-constraint rate limiter (2 req/s burst + 90 req/day global)
- [`lib/hash.ts`](lib/hash.ts) — SHA-256 cache key derivation (emails never stored in plaintext)
- [`lib/breach-metadata.ts`](lib/breach-metadata.ts) — severity scoring and enrichment for breach results

### HTTP security headers

All responses include hardened headers configured in [`next.config.ts`](next.config.ts):

| Header | Value | Purpose |
|--------|-------|---------|
| CSP | Strict allowlist | Prevents XSS, limits resource origins |
| HSTS | 2 years + preload | Forces HTTPS |
| X-Frame-Options | SAMEORIGIN | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Referrer-Policy | origin-when-cross-origin | Protects email addresses in referrer headers |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Disables unused sensors |

### Rate limiting

The rate limiter in [`lib/rate-limiter.ts`](lib/rate-limiter.ts) enforces two constraints:

- **Burst:** 2 requests/second per IP (matches XposedOrNot API limit)
- **Daily:** 90 requests/day globally (upstream quota is 100 — 10% safety buffer)

In-memory Map resets on cold start (Vercel serverless). This is a known tradeoff documented in the code — best-effort protection at zero infrastructure cost.

### Authentication

Optional site-wide password gate via `SITE_PASSWORD` env var. Uses `crypto.timingSafeEqual` for comparison to prevent timing attacks. See [`app/api/auth/login/route.ts`](app/api/auth/login/route.ts).

### What is NOT stored

- No database
- No user accounts
- No cookies (except optional site auth)
- No analytics or tracking scripts
- No server-side logs containing user data
- Error responses never echo user input back (prevents PII leakage in logs)

---

## Project structure

```
app/
  [locale]/
    page.tsx              # Home — feature cards, trust badges
    email/                # Email breach check
    password/             # Password strength check
    brokers/              # Data broker opt-out guides
    rights/               # GDPR rights, wizard, complaint guide
    privacy/              # Privacy policy
    guides/               # Educational content pages
  api/
    breach/email/route.ts # Email check API (rate limited, cached)
    auth/login/route.ts   # Optional password gate

components/
  breach-results.tsx      # Breach list with severity table
  breach-timeline.tsx     # SVG timeline visualization
  broker-guide.tsx        # Filterable broker directory
  gdpr-rights-guide.tsx   # GDPR accordion with copy-to-clipboard templates
  gdpr-wizard.tsx         # Step-by-step GDPR request wizard
  password-form.tsx       # Password input with breach check
  password-strength.tsx   # zxcvbn strength meter

lib/
  hibp.ts                 # HIBP k-Anonymity (client-side)
  rate-limiter.ts         # Dual-constraint rate limiter
  breach-metadata.ts      # Breach severity scoring + enrichment
  broker-data.ts          # 32 data brokers with opt-out steps
  gdpr-data.ts            # GDPR rights + template data
  hash.ts                 # SHA-256 cache key derivation
  validations.ts          # Zod schemas (RFC 5321 email validation)
  structured-data.ts      # JSON-LD schema.org markup
```

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Validation | Zod v4 |
| Password analysis | zxcvbn-ts (client-side) |
| Hosting | Vercel (Hobby tier, $0/month) |
| i18n | next-intl (Danish + English) |

## Running locally

```bash
npm install
npm run dev
```

Optional: set `SITE_PASSWORD` in `.env.local` to enable the password gate.

## License

[MIT](LICENSE)
