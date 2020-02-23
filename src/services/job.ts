import { getEnvVar } from '../utils/common'
import { Customer } from '../models/Customer'
import { UserInputError } from 'apollo-server-express'
import { Job } from '../models/Job'

export const CLIENT_TIMEZONE = +getEnvVar('CLIENT_TIMEZONE')
export const JOB_CODE_COUNT_PAD = +getEnvVar('JOB_CODE_COUNT_PAD')

export class JobService {
  async genJobCode(customerId: string): Promise<string> {
    const alias = await this.getCustomerCompanyAlias(customerId)
    const ddmmyy = this.getDDMMYY()
    const todayJobCount = await this.getTodayJobCount()
    const currentJobCount = (todayJobCount + 1)
      .toString()
      .padStart(JOB_CODE_COUNT_PAD, '0')

    return `${alias}-${ddmmyy}-${currentJobCount}`
  }

  private async getCustomerCompanyAlias(customerId: string): Promise<string> {
    const company = await Customer.relatedQuery('companyBelong')
      .for(customerId)
      .select('alias')
      .first()

    if (company == null) {
      throw new UserInputError(`Customer not found with id: ${customerId}`)
    }

    return company.alias
  }

  private getDDMMYY(): string {
    const clientDate = this.getClientDate()

    const dd = clientDate
      .getDate()
      .toString()
      .padStart(2, '0')
    const mm = (clientDate.getMonth() + 1).toString().padStart(2, '0')
    const yy = clientDate
      .getFullYear()
      .toString()
      .substr(-2)

    return dd + mm + yy
  }

  private async getTodayJobCount(): Promise<number> {
    const clientDawnDate = new Date(this.getClientDate().setHours(0, 0, 0, 0))

    const result: any = await Job.query()
      .where('createdAt', '>=', clientDawnDate)
      .countDistinct('code as count')
      .first()

    return result.count
  }

  private getClientDate(): Date {
    return new Date(
      Date.now() +
        new Date().getTimezoneOffset() * 1000 +
        CLIENT_TIMEZONE * 60 * 1000
    )
  }
}
