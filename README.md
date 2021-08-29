# さくら通り

## Execution

Run app locally and reload on file change.

```bash
# Install dependencies.
npm install

# Needs to install this first.
npm install -g nodemon

# This variable is needed.
export DATABASE_URL=postgres://myuser:myuser@localhost:5432/youtube_chat_logger

# Then run with automatic reload.
npm run watch # nodemon --exec npm start
```

**Note:** If `nodemon` starts to fail, clone the repo and install again (working solution to the `Port 3000 is already in use` issue). Rebooting the computer seems to solve this issue as well.

## Environment variables

It uses dotenv, so create a `.env` file with the following data:

```
# Database to use. Heroku adds it automatically using the Postgres addon attached.
DATABASE_URL=postgres://myuser:myuser@localhost:5432/youtube_chat_logger

# For getting currently active users. Messages within this time frame will be considered.
ACTIVE_USERS_WITHIN_SECONDS=600

# Update the active user data every X seconds.
ACTIVE_USERS_INTERVAL_SECONDS=5

# Secret API KEY for accessing the scraper endpoints.
API_KEY=xxxxxxxxyyyyyyyyyyyzzzzzzzz

# Key for Google Analytics (leave empty or don't define in order to turn off GA).
GOOGLE_ANALYTICS_KEY=G-XXXXXXXXXX
```
