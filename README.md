# Hono + Supabase

## Install server dependencies

```bash
npm run install
--
make dev/install
```

## Run server

```bash
npm run dev
--
make dev/run
```

## Start database

More info:

- https://supabase.com/docs/guides/api/rest/generating-types
- https://supabase.com/docs/guides/cli/local-development?access-method=kong#why-develop-locally

```bash
make db/start
```

## Deploy on docker

### Build image

```bash
make dev/build
```

### Run container

```bash
make docker/up
```

### Stop container

```bash
make docker/down
```
