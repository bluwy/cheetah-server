# cheetah-server

A server built by yours truly.

## Development

Make sure environment variables are set before doing anything. See [`.env.example`](./.env.example) for example setup.

### Setting up database

The development and testing database are created with Docker. Both environments use the same `docker-compose.yml` file, which you can start with `docker-compose up`, and exit with `docker-compose down`.

By default, database data is not mounted to any named volume. Meaning that once `docker-compose down` is called, the volume will be disposed. This is to prevent potential database side-effects during development.

> NOTE: The database name should not be "postgres" since the database needs to be dropped and created during seeding.

### Development workflow

Once the database is set up, the project have some scripts to facilitate manipulating the database:

```bash
# Setup the database. Make sure there's no connection to it.
# Process: drop -> create -> migrate -> seed
$ yarn db:setup

# Cleans the database. Make sure there's no connection to it.
# Process: drop -> create
$ yarn db:clean

# Clears all Redis keys
$ yarn rd:clean
```

### Testing workflow

The same Docker instance and database url can be shared from development when testing. Here's how it works when executing tests:

1. Connect to database (same development connection).
2. Create new database with a random-generated name and assign the app to use the new connection.
3. Once the test suite ends, drop the new database.

From the steps above, the development database was never touched but only used to create/drop the random-generated database. This is to allow running test suites in parallel.

### Production workflow

No shenanigans. Just connect to `DATABASE_URL`.

## License

MIT
