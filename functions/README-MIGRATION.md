# Fauna to Neon Migration Guide

The database has been migrated from Fauna to Neon serverless PostgreSQL.

## Setup

### 1. Create a Neon database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

### 2. Run the schema

In the Neon SQL Editor, run the contents of `functions/db/schema.sql` to create all tables and indexes.

### 3. Configure environment variables

**Local development** (add to `.env`):
```
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

**Netlify** (Site settings → Environment variables):
- Add `DATABASE_URL` with your Neon connection string
- Remove `FAUNADB_SERVER_SECRET` (no longer needed)

### 4. Install dependencies

```bash
yarn install
```

### 5. Data migration (optional)

If you have existing data in Fauna, you'll need to export it and import into Neon. The schema uses JSONB `data` columns to store document data, matching the Fauna structure. You can write a script to:

1. Export documents from each Fauna collection
2. Transform to match the Neon schema (id, data columns)
3. Insert into the corresponding Neon tables

## Response format

The functions return responses in Fauna-compatible format for frontend compatibility:

```json
{
  "ref": { "@ref": { "id": "uuid", "collection": { "@ref": { "id": "collectionName" } } } },
  "data": { ...document data... }
}
```

No frontend changes are required.
