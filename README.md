# e-job-server

An overhaul rewrite to Apollo + Prisma Framework server

## Note

The current server implementation is very unstable as Prisma Framework is currently in preview. It's expected to be better in consequent Prisma releases.

## Development

General Prisma commands for Photon (Data model) and Lift (Database migration): [Prisma Framework CLI](https://github.com/prisma/prisma2/blob/master/docs/prisma2-cli.md)

After a fresh download:

```bash
# Apply schema changes to Postgres
$ npx prisma2 lift up
# Generate Photon and Nexus typings
$ npm run generate
```

Subsequent `prisma/schema.prisma` changes:

```bash
# Generate Photon and Nexus typings
$ npm run generate
```

Other commands:

```bash
# Start dev server (live-reload)
$ npm run dev

# Start temporary server (With ts-node)
$ npm run start

# Build and start prod server (Compiled)
$ npm run build

# Lint
$ npm run lint

# Lint + fix
$ npm run lintfix
```

## License

MIT
