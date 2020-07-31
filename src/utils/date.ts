import { getEnvVar } from './common'

const CLIENT_TIMEZONE = +getEnvVar('CLIENT_TIMEZONE')

export function getClientDate() {
  const serverOffset = new Date().getTimezoneOffset() * 1000
  const clientOffset = CLIENT_TIMEZONE * 60 * 1000
  return new Date(Date.now() + serverOffset + clientOffset)
}

export function formatDDMMYY(date: Date) {
  const dd = date
    .getDate()
    .toString()
    .padStart(2, '0')
  const mm = (date.getMonth() + 1).toString().padStart(2, '0')
  const yy = date
    .getFullYear()
    .toString()
    .substr(-2)

  return dd + mm + yy
}
