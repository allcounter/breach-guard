import type { Thing, WithContext } from 'schema-dts';

/**
 * Renders a JSON-LD script tag for structured data.
 *
 * Server component — uses dangerouslySetInnerHTML with XSS sanitization
 * (replaces `<` with unicode escape to prevent script injection).
 *
 * @see https://nextjs.org/docs/app/guides/json-ld
 */
export function JsonLd({ data }: { data: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
