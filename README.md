# Is it buses?

A hub for train disruption information in Melbourne and Victoria.

Very much still a work-in-progress!

✅ Beta deployment at https://beta.isitbuses.com.

## Getting started

Requires [NodeJS](https://nodejs.org/en), and [MongoDB](https://www.mongodb.com/) is recommended (but optional).

1. Clone the repo:

   ```
   git clone https://github.com/dan-schel/is-it-buses.git
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set environment variables (optional) by creating a `.env` file with:

   ```dotenv
   # Change username, password, and 27017 (the port) as required to connect to your
   # locally running MongoDB server.
   DATABASE_URL = "mongodb://username:password@localhost:27017/?authMechanism=DEFAULT"

   # Secret value.
   RELAY_KEY = "..."
   ```

   **Note:** If you skip this step, the server will use an in-memory database and simulate (empty) responses from the PTV API relay.

4. Start the server:

   ```
   npm run dev
   ```

5. Navigate to http://localhost:3000.

## Production deployment

When deploying to DigitalOcean, configure the environment variables like so:

```dotenv
# Use this template string to have DigitalOcean automatically create database
# URL from the attached database in App Platform.
DATABASE_URL = ${trainquery-db.DATABASE_URL}

# Secret value.
RELAY_KEY = "..."

# A bit counterintuitive, but required to ensure DigitalOcean will also install
# `devDependencies`, so `cross-env` for example will work.
NPM_CONFIG_PRODUCTION = false

# Use this template string to have DigitalOcean automatically fill this value.
COMMIT_HASH = ${_self.COMMIT_HASH}

# Secret superadmin credentials.
SUPERADMIN_USERNAME = "admin"
SUPERADMIN_PASSWORD = "..."

# Discord setup.
DISCORD_TOKEN = "..."
DISCORD_CHANNEL = "..."
```

**Note:** `NODE_ENV=production` and `TZ="Etc/UTC"` are set automatically when `npm run start` is run, so no need to set those.
