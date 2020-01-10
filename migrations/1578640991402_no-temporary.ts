/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export function up (pgm: MigrationBuilder): void {
  pgm.dropColumn('customer', 'temporary')
}

export function down (pgm: MigrationBuilder): void {
  pgm.addColumn('customer', {
    temporary: 'boolFalse'
  })
}
