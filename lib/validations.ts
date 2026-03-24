import { z } from 'zod'

// Factory function for locale-aware email validation messages.
// Components call this with translated strings from useTranslations('validation').
export function createEmailSchema(messages: {
  required: string
  invalid: string
  tooLong: string
}) {
  return z.object({
    email: z
      .string()
      .min(1, messages.required)
      .email(messages.invalid)
      .max(254, messages.tooLong), // RFC 5321 maximum total length
  })
}

// Default English schema for API route (no locale context)
export const emailSchema = createEmailSchema({
  required: 'Email is required',
  invalid: 'Please enter a valid email address',
  tooLong: 'Email address too long',
})

export type EmailInput = z.infer<typeof emailSchema>
