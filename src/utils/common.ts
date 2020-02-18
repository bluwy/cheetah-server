/** Get environment variable by name, throws error if undefined */
export function getEnvVar(name: string): string {
  const value = process.env[name]

  if (value == null) {
    throw new Error(`${name} env var is not defined`)
  }

  return value
}

export type ValidateNonNullPropsOptions<T> = {
  /** Specify specific props to be asserted */
  props?: (keyof T)[]
  /** Deletes the null property instead of throwing an error */
  mutate?: boolean
}

/**
 * Validate if object has non null properties.
 * Defaults to checking all properties unless specified in `options.props`.
 */
export function validateNonNullProps<T extends object>(
  obj: T,
  options?: ValidateNonNullPropsOptions<T>
) {
  const { props = Object.keys(obj) as (keyof T)[], mutate = false } =
    options ?? {}

  props.forEach(prop => {
    if (mutate && obj[prop] === null) {
      delete obj[prop]
    } else {
      throw new Error(`Object with property '${prop}' should not be null`)
    }
  })
}
