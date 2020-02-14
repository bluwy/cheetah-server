import { Model } from 'objection'
import uuidv4 from 'uuid/v4'

/** Add basic `id`, `createdAt` and `updatedAt` */
export class BaseModel extends Model {
  id!: string
  createdAt!: Date
  updatedAt!: Date

  $beforeInsert() {
    this.id = uuidv4()
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}
