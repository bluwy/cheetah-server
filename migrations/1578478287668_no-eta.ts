/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export function up (pgm: MigrationBuilder): void {
  pgm.dropColumn('assignment', 'eta')

  pgm.addColumn('staff', {
    active: 'boolTrue'
  })
}

export function down (pgm: MigrationBuilder): void {
  pgm.addColumn('assignment', {
    eta: 'boolFalse'
  })

  pgm.dropColumn('staff', 'active')
}
