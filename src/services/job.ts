import { UserInputError } from 'apollo-server-express'
import { Customer } from '../models/Customer'
import { Job } from '../models/Job'
import { getEnvVar } from '../utils/common'
import { getClientDate, formatDDMMYY } from '../utils/date'

const JOB_CODE_COUNT_PAD = +getEnvVar('JOB_CODE_COUNT_PAD')

export class JobService {
  async genJobCode(customerId: string): Promise<string> {
    const alias = await this.getCustomerCompanyAlias(customerId)
    const ddmmyy = formatDDMMYY(getClientDate())
    const nextJobCount = await this.getNextJobCountString()

    return `${alias}-${ddmmyy}-${nextJobCount}`
  }

  private async getCustomerCompanyAlias(customerId: string) {
    const company = await Customer.relatedQuery('companyBelong')
      .for(customerId)
      .select('alias')
      .first()

    if (company == null) {
      throw new UserInputError(`Customer not found with id: ${customerId}`)
    }

    return company.alias
  }

  private async getNextJobCountString() {
    const todayJobCount = await this.getTodayJobCount()
    return (todayJobCount + 1).toString().padStart(JOB_CODE_COUNT_PAD, '0')
  }

  private async getTodayJobCount() {
    const clientDawnDate = new Date(getClientDate().setHours(0, 0, 0, 0))

    const result: any = await Job.query()
      .where('createdAt', '>=', clientDawnDate)
      .countDistinct('code as count')
      .first()

    return result.count as number
  }
}
