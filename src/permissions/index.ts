import { shield } from 'graphql-shield'
import { merge } from 'lodash'
import * as admin from './admin'
import * as company from './company'
import * as customer from './customer'
import * as job from './job'
import * as staff from './staff'

export const permissions = shield(merge({}, admin, company, customer, job, staff))
