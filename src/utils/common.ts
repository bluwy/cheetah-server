/** Get environment variable by name, throws error if undefined */
export function getEnvVar(name: string): string {
  const value = process.env[name]

  if (value == null) {
    throw new Error(`${name} env var is not defined`)
  }

  return value
}
