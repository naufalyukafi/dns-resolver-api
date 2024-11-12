# RESTful API Node Server Boilerplate

A boilerplate project for quickly building RESTful APIs using MongoDB (Mongoose), Express and NodeJS.

By running a single command, you will get a production-ready NodeJS app installed and fully configured on your machine. The app comes with many built-in features, such as authentication using JWT, request validation, unit and integration tests, docker support, API documentation with Swagger JSDoc, pagination, etc.

## Quick Start

1. Install all dependencies from the package.
   ```sh
   npm install
   ```

2. Setup `.env` in root directory. Use `.env.example` as the template.

3. [Optional] Run the seed command.
   ```
   npm run seed:dev
   ```

4. Run the app.
   ```
   npm run dev
   ```

5. Open [URL](http://localhost:3000/v1/docs/) in the browser.

## Project Structure

```
src\
 |--config\           # Environment variables and configuration related things
 |--controllers\      # Route controllers (controller layer)
 |--docs\             # Swagger files
 |--interfaces\       # Pre-defined data structure (TS specific requirement)
 |--middlewares\      # Custom express middlewares
 |--models\           # Mongoose models (data layer)
    |--plugins\       # Mongoose schema related plugins
    |--seeds\         # Populating initial data with database seed
 |--routes\           # Routes
    |--v1\            # Version 1 routes (useful for migrating endpoints)
 |--services\         # Business logic (service layer)
 |--tests\            # Tests by API and it's expected behaviour
    |--fixtures\      # Set of data used for tests
    |--integrations\  # Test cases that not limited to logic test
    |--loads\         # Test cases that only to load test endpoints
    |--units\         # Test cases that limited to logic test
    |--utils\         # Set of utility code used for tests
 |--utils\            # Utility classes and functions
 |--validations\      # Request data validation schemas
 |--app.ts            # Express app
 |--index.ts          # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user

## Logging

Import the logger from `src/config/logger.ts`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```typescript
import logger from '@config/logger';

logger.error('message');    // level 0
logger.warn('message');     // level 1
logger.info('message');     // level 2
logger.http('message');     // level 3
logger.verbose('message');  // level 4
logger.debug('message');    // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).
