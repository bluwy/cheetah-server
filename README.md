# e-job-server

An overhaul rewrite to Apollo + Prisma Framework server

## Note

The current server implementation is very unstable as Prisma Framework is currently in preview. It's expected to be better in consequent Prisma releases.

Since the database is built ground up, Photon currently cannot infer cascading deletes and would result in `RelationViolation`. It's botched with custom `pg` DROP command.

The time system depends on env var `CLIENT_TIMEZONE` to calculate the job codes and cron jobs. Data are however stored with time zone. So some hacky timezone offsets were perform to work properly in the client's timezone.

## Development

General Prisma commands for Photon (Data model): [Prisma Framework CLI](https://github.com/prisma/prisma2/blob/master/docs/prisma2-cli.md)

Prisma's Lift (Database migration) is not used since it's really unstable. `node-pg-migrate` is used instead: [node-pg-migrate CLI](https://github.com/salsita/node-pg-migrate)

After a fresh download:

```bash
# Apply schema changes to Postgres
$ npm run migrate up
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
