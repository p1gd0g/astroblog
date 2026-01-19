# EdgeOne Pages KV Setup for View Counter

This project uses Tencent Cloud EdgeOne Pages KV storage to track page views.

## Setup Instructions

### 1. Enable KV Storage in EdgeOne Pages Console

1. Log in to [EdgeOne Pages Console](https://pages.edgeone.ai/)
2. Navigate to "KV Storage" section
3. Click "Apply now" and submit the application form
4. Wait for approval

### 2. Create KV Namespace

1. After approval, go to "KV Storage" > "Create Namespace"
2. Create a namespace with a meaningful name (e.g., `blog-storage`)
3. Optionally, initialize key-value pairs via "Data Management"

### 3. Bind KV Namespace to Your Project

1. In your EdgeOne Pages project dashboard, select your project
2. Go to "KV Storage" > "Bind Namespace"
3. Select the namespace you created
4. **Important:** Set the variable name to `BLOG_KV` (this must match the variable name used in the edge function)

### 4. Deploy

Once the KV namespace is bound with the variable name `BLOG_KV`, deploy your project to EdgeOne Pages. The edge function will automatically have access to the KV storage.

## How It Works

### Edge Function

The edge function at `/functions/api/views.js` handles view counting with security features:

- **GET `/api/views?slug=<slug>`**: Retrieve the view count for a specific page
- **POST `/api/views?slug=<slug>`**: Increment the view count for a specific page

**Security Features:**
- Input validation: Slugs are validated to only allow alphanumeric characters, hyphens, underscores, and forward slashes
- Retry logic: POST requests include retry logic (up to 3 attempts) to handle race conditions
- Verification: After incrementing, the function verifies the write was successful

The function uses the `BLOG_KV` namespace bound in the EdgeOne Pages console.

### Client-Side Component

The `ViewCounter.astro` component:

1. Displays a view counter with an eye icon
2. On page load, sends a POST request to increment the view count
3. Updates the displayed count with the response

### Storage Format

Views are stored in KV with the key format: `views:<slug>`

For example:
- Key: `views:first-post`
- Value: `123` (view count as string)

## API Reference

### GET /api/views

**Query Parameters:**
- `slug` (required): The slug of the blog post

**Response:**
```json
{
  "slug": "first-post",
  "views": 123
}
```

### POST /api/views

**Query Parameters:**
- `slug` (required): The slug of the blog post

**Response:**
```json
{
  "slug": "first-post",
  "views": 124
}
```

## Troubleshooting

### KV storage not configured error

If you see "KV storage not configured" error:
1. Make sure you've created a KV namespace in EdgeOne Pages console
2. Verify the namespace is bound to your project
3. **Ensure the variable name is exactly `BLOG_KV`**
4. Redeploy your project after binding

### View count shows "N/A"

If the view count shows "N/A":
1. Check browser console for error messages
2. Verify the edge function is deployed correctly
3. Check that the KV namespace has the correct permissions

## Local Development

For local development, the edge functions won't work without the EdgeOne Pages environment. The view counter will show "N/A" but won't break the site functionality.

To test locally, you can mock the KV API or deploy to EdgeOne Pages for testing.
