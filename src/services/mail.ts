import { send, setApiKey } from '@sendgrid/mail'
import { getEnvVar } from '../utils/common'

const sendgridApiKey = getEnvVar('SENDGRID_API_KEY')
const fromAddress = getEnvVar('EMAIL_FROM_ADDRESS')
const toAddress = getEnvVar('EMAIL_TO_ADDRESS')

setApiKey(sendgridApiKey)

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
