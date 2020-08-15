import { Model } from 'objection'
import { v4 as uuidv4 } from 'uuid'

/** Add basic `id`, `createdAt` and `updatedAt` */
export class BaseModel extends Model {
  id!: string
  createdAt!: Date
  updatedAt!: Date

  $beforeInsert() {
    this.id = uuidv4()
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}
