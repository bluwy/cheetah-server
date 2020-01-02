/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export function up (pgm: MigrationBuilder): void {
  pgm.alterColumn('job', 'needs_follow_up', {
    allowNull: true,
    default: null
  })

  pgm.addColumn('assignment', {
    eta: 'boolFalse'
  })
}

export function down (pgm: MigrationBuilder): void {
  pgm.alterColumn('job', 'needs_follow_up', {
    notNull: true,
    default: false
  })

  pgm.dropColumn('assignment', 'eta')
}
