# さくら通り

Frontend for viewing data scraped by [Youtube Chat Logger](https://github.com/ChrisVilches/youtube-chat-logger).

See a [live demo](http://cloud.chrisvilches.com/sakura-dori/).

## Execution

Make sure to create `.env` file (use the sample file as a reference).

Run app locally and reload on file change.

```bash
# Install dependencies.
npm install

# Needs to install this first.
npm install -g nodemon

# Then run with automatic reload (individual reloaders for both Express and Webpack).
npm run dev

# Run in production.
npm run build
NODE_ENV=production npm start
```

## Tools used

Made with:

* Express.js (Node)
* Pug (templating engine)
* Webpack
* Bootstrap 5
* SASS
* PostgreSQL
* Puppeteer

Also, unlike most of my other projects, almost no Javascript was used in the frontend (pages are server rendered), as it was originally meant to be an old school looking website (but I decided to improve the design later on).
