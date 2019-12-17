import mailgun from 'mailgun-js'

const apiKey = process.env.MAILGUN_API_KEY ?? ''
export const domain = process.env.MAILGUN_DOMAIN ?? ''
export const companyEmail = process.env.COMPANY_EMAIL ?? ''

export const mg = mailgun({ apiKey, domain })
