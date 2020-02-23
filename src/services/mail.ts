import { send, setApiKey } from '@sendgrid/mail'
import { getEnvVar } from '../utils/common'

const SENDGRID_API_KEY = getEnvVar('SENDGRID_API_KEY')
const FROM_ADDRESS = getEnvVar('EMAIL_FROM_ADDRESS')
const TO_ADDRESS = getEnvVar('EMAIL_TO_ADDRESS')

setApiKey(SENDGRID_API_KEY)

export class MailService {
  async sendResetPasswordEmail(username: string, resetLink: string) {
    return send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      templateId: process.env.SENDGRID_TEMPLATE_RESET_PASSWORD,
      dynamicTemplateData: {
        username,
        resetLink
      }
    })
  }
}
