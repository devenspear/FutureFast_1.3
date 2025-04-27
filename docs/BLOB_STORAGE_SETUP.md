# Setting Up Vercel Blob Storage for Newsletter Subscriptions

This document provides instructions for configuring Vercel Blob Storage to work with the newsletter subscription system.

## Environment Variables

When deploying to Vercel, you need to set up the following environment variables:

1. `BLOB_READ_WRITE_TOKEN` - A token with read and write permissions for your Blob Storage

## Configuration Steps

### 1. From the Vercel Dashboard

1. Go to your project in the Vercel dashboard
2. Navigate to the "Storage" tab
3. Select "Blob" from the storage options
4. If you've already created a Blob Store (as shown in your screenshot), you're good to go!
5. Vercel will automatically add the required environment variables to your project

### 2. Verify Environment Variables

1. In your Vercel project dashboard, go to "Settings" > "Environment Variables"
2. Ensure that `BLOB_READ_WRITE_TOKEN` is set
3. If not, you can manually add it from the "Storage" > "Blob" section

## Testing the Integration

After deployment, you can test the newsletter subscription by:

1. Filling out the subscription form on your website
2. Checking the admin panel at `/admin/subscribers` to see if the subscriber was added
3. Verifying in the Vercel dashboard under "Storage" > "Blob" that new files are being created in the `subscribers/` folder

## Local Development

For local development, you need to set up a `.env.local` file with the required environment variables:

```
BLOB_READ_WRITE_TOKEN=your_token_here
```

You can get this token from your Vercel dashboard under "Storage" > "Blob" > "Connect".

## Troubleshooting

If you encounter issues with the Blob Storage:

1. Check that the environment variables are correctly set
2. Ensure that the Blob Store is created and active in your Vercel project
3. Verify that your account has the necessary permissions to use Blob Storage
4. Check the Vercel logs for any error messages related to Blob Storage operations

## Additional Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob API Reference](https://vercel.com/docs/storage/vercel-blob/api-reference)
