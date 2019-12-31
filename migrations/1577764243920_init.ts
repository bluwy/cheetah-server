/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions, PgLiteral } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = {
  cuid: {
    type: 'text',
    primaryKey: true
  },
  notNullText: {
    type: 'text',
    notNull: true
  },
  uniqueText: {
    type: 'text',
    notNull: true,
    unique: true
  },
  boolFalse: {
    type: 'boolean',
    notNull: true,
    default: false
  },
  boolTrue: {
    type: 'boolean',
    notNull: true,
    default: true
  }
}

export function up (pgm: MigrationBuilder): void {
  // Photon.js limitation
  //
  // 1. No enums support: use text
  // admin_privilege: ['BASIC', 'FULL']
  // task_type: ['SERVICE', 'COMPLAINT', 'DELIVERY', 'TRANSPORT', 'OTHERS']
  //
  // 2. DateTime only timestamp(3), no timestamptz

  pgm.createTable('admin', {
    id: 'cuid',
    username: 'uniqueText',
    privilege: {
      type: 'text',
      notNull: true,
      default: 'BASIC'
    },
    hash: 'notNullText'
  })

  pgm.createTable('staff', {
    id: 'cuid',
    username: 'uniqueText',
    full_name: 'notNullText',
    hash: 'notNullText',
    password_forgotten: 'boolFalse'
  })

  pgm.createTable('company', {
    id: 'cuid',
    name: 'uniqueText',
    alias: 'uniqueText'
  })

  pgm.createTable('customer', {
    id: 'cuid',
    code: 'uniqueText',
    name: 'uniqueText',
    email: 'text',
    addresses: 'text[]',
    phone_number: 'text',
    company_belong: {
      type: 'text',
      notNull: true,
      references: 'company(id)',
      referencesConstraintName: 'customer_company_belong_fkey',
      onDelete: 'RESTRICT'
    },
    temporary: 'boolFalse',
    active: 'boolTrue',
    staff_primary: {
      type: 'text',
      notNull: true,
      references: 'staff(id)',
      referencesConstraintName: 'customer_staff_primary_fkey',
      onDelete: 'RESTRICT',
      check: 'staff_primary != staff_secondary'
    },
    staff_secondary: {
      type: 'text',
      references: 'staff(id)',
      referencesConstraintName: 'customer_staff_secondary_fkey',
      onDelete: 'RESTRICT',
      check: 'staff_secondary != staff_primary'
    }
  })

  pgm.createTable('job', {
    id: 'cuid',
    code: 'uniqueText',
    date_issued: {
      type: 'timestamp(3)',
      notNull: true,
      default: new PgLiteral('now()')
    },
    customer: {
      type: 'text',
      notNull: true,
      references: 'customer(id)',
      referencesConstraintName: 'job_customer_fkey',
      onDelete: 'RESTRICT'
    },
    needs_follow_up: 'boolFalse'
  })

  pgm.createTable('assignment', {
    id: 'cuid',
    address: 'notNullText',
    prefer_time: 'timestamp(3)',
    check_in: 'timestamp(3)',
    check_out: 'timestamp(3)',
    expired: 'boolFalse',
    staff_primary: {
      type: 'text',
      notNull: true,
      references: 'staff(id)',
      referencesConstraintName: 'assignment_staff_primary_fkey',
      onDelete: 'RESTRICT'
    },
    staff_secondary: {
      type: 'text',
      references: 'staff(id)',
      referencesConstraintName: 'assignment_staff_secondary_fkey',
      onDelete: 'RESTRICT'
    },
    job: {
      type: 'text',
      notNull: true,
      references: 'job(id)',
      referencesConstraintName: 'assignment_job_fkey',
      onDelete: 'CASCADE'
    }
  })

  pgm.createTable('task', {
    id: 'cuid',
    type: {
      type: 'text',
      notNull: true
    },
    remarks: 'notNullText',
    done: 'boolFalse',
    assignment: {
      type: 'text',
      notNull: true,
      references: 'assignment(id)',
      referencesConstraintName: 'task_assignment_fkey',
      onDelete: 'CASCADE'
    }
  })

  pgm.createTable('action', {
    id: 'cuid',
    remarks: 'notNullText',
    assignment: {
      type: 'text',
      notNull: true,
      references: 'assignment(id)',
      referencesConstraintName: 'action_assignment_fkey',
      onDelete: 'CASCADE'
    }
  })
}
