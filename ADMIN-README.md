# FutureFast.AI Admin Interface

This is the admin interface for managing news submissions on FutureFast.AI.

## Setup

1. Copy the example environment file and update with your values:
   ```bash
   cp .env.local.example .env.local
   ```

2. Install dependencies:
   ```bash
   npm install jose openai
   # or
   yarn add jose openai
   ```

3. Configure environment variables in `.env.local`:
   - `ADMIN_PASSWORD`: Password for admin access
   - `JWT_SECRET`: Secret key for JWT tokens
   - `OPENAI_API_KEY`: Your OpenAI API key

## Usage

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Access the admin interface at: `http://localhost:3000/admin`
   - Login page: `/admin/login`
   - News submission: `/admin/news-submit`

## Features

- Secure authentication with JWT
- Protected admin routes
- News article submission with URL processing
- Automatic content generation using OpenAI
- Responsive design

## Security Notes

- Always use strong, unique passwords
- Keep your `.env.local` file secure and never commit it to version control
- Rotate your JWT_SECRET periodically in production
- Consider implementing rate limiting in production
