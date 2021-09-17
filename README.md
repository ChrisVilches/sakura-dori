# さくら通り

## Execution

Run app locally and reload on file change.

```bash
# Install dependencies.
npm install

# Needs to install this first.
npm install -g nodemon

# Then run with automatic reload (individual reloaders for both Express and Webpack).
npm run dev

# Deploy in production mode (build + start server).
npm run deploy
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

# How many messages per page.
PER_PAGE=100

# Deploy URL base.
BASE_URL=http://deploy-base-url.com

# In the main page (i.e. not /archive), limit the dateFrom to X days ago.
LIMIT_DATE_FROM_DAYS_AGO=3
```
