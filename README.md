# Vox Librorum

This project hosts the Vox Librorum website along with a lightweight Node.js backend that powers dynamic content and form submissions.

## Getting started

```bash
npm install
npm start
```

The server listens on [http://localhost:3000](http://localhost:3000) and serves both the static site and JSON APIs used by the front end.

## Available endpoints

| Method | Endpoint           | Description |
| ------ | ------------------ | ----------- |
| GET    | `/api/archive`     | Returns the featured archive cards displayed on the landing page. |
| GET    | `/api/voices`      | Returns the community voice highlights grid. |
| GET    | `/api/spotlight`   | Provides the curated spotlight features rendered in the footer section. |
| POST   | `/api/newsletter`  | Accepts `{ name, email }` payloads and stores newsletter sign-ups. |
| POST   | `/api/contact`     | Accepts `{ name, email, message }` payloads and stores contact messages. |

### Data persistence

Submitted newsletter sign-ups and contact messages are stored as JSON arrays in `data/submissions/`. These files are created automatically if they do not yet exist.

## Development notes

* Client-side JavaScript progressively enhances the static markup: the page still renders meaningful placeholders if the API is unreachable.
* Each form exposes descriptive `name` attributes so data is included when serialized by the browser or a form service.
* No automated tests are configured for this project; running `npm test` prints a placeholder message.
