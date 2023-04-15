# ai.antonio-da.dev

A Nuxt 3 SSR website hosted on Vercel complementing the newsletter.

## Nuxt 3

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

### Environment variables

Some environment variables are expected to be set. Not having them set will result in a runtime 500 error.

| Environment Variable        | Description                                                                                   |
|-----------------------------|-----------------------------------------------------------------------------------------------|
| NUXT_PUBLIC_GOOGLE_CLIENT_ID| The Client ID for your Google OAuth 2.0 application, used for authenticating with Google APIs. |
| NUXT_GOOGLE_CLIENT_SECRET   | The Client Secret for your Google OAuth 2.0 application, used for authenticating with Google APIs. |
| NUXT_SENDGRID_API_KEY       | The API key for your SendGrid account, used for sending emails via the SendGrid API.             |
| NUXT_JWT_SECRET             | The secret key for signing and verifying JSON Web Tokens (JWT) in your application.             |
| NUXT_PUBLIC_API_URL         | The base URL for your API, used to make API requests from your application.                     |


### Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
