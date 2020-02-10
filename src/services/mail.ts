import { send, setApiKey } from '@sendgrid/mail'

const fromAddress = process.env.MAIL_FROM_ADDRESS ?? 'bjorn@bjornlu.com'
const toAddress = process.env.MAIL_TO_ADDRESS ?? fromAddress

// Setup SendGrid API key
setApiKey(process.env.SENDGRID_API_KEY ?? '')

export class MailService {
  async sendResetPasswordEmail(username: string, resetLink: string) {
    return send({
      from: fromAddress,
      to: toAddress,
      templateId: process.env.SENDGRID_TEMPLATE_RESET_PASSWORD,
      dynamicTemplateData: {
        username,
        resetLink
      }
    })
  }
}
