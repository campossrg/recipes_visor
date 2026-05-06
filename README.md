# Recipes Visor

Recipes Visor is a small `Next.js` app that turns folders of recipe photos into browsable books.

The intended workflow is simple:

1. Upload recipe images from your phone into `Cloudinary`.
2. Put each recipe collection in its own subfolder.
3. Open the site and browse each subfolder as a book.

If `Cloudinary` is not configured, the app automatically falls back to demo books so the interface still works locally.

## Features

1. Homepage with book cards generated from recipe folders.
2. Book detail page that renders each image as a page.
3. Demo fallback mode when `Cloudinary` credentials are missing or unavailable.
4. Static generation with `revalidate = 300` for lightweight caching.

## Tech Stack

1. `Next.js 16`
2. `React 19`
3. `TypeScript`
4. `Cloudinary`

## Project Structure

```text
src/
  app/
    book/[slug]/page.tsx    Dynamic page for a single recipe book
    globals.css             Global styles
    layout.tsx              App layout and metadata
    page.tsx                Homepage listing all books
  lib/
    recipes.ts              Cloudinary fetching and demo fallback logic
```

## Cloudinary Folder Structure

Create one root folder in `Cloudinary`, for example `recipes-visor`.

Inside it, create one subfolder per book:

```text
recipes-visor/
  weeknight-pasta/
    001.jpg
    002.jpg
    003.jpg
  family-desserts/
    001.jpg
    002.jpg
```

Images are sorted by filename, so numeric names such as `001.jpg`, `002.jpg`, and `003.jpg` keep the reading order stable.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_LIBRARY_FOLDER=recipes-visor
```

Variable meanings:

1. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   Your Cloudinary cloud name.
2. `CLOUDINARY_API_KEY`
   Server-side API key used to list folders and images.
3. `CLOUDINARY_API_SECRET`
   Server-side API secret.
4. `CLOUDINARY_LIBRARY_FOLDER`
   Root folder containing your recipe-book subfolders.

Notes:

1. If the `Cloudinary` variables are missing, the app runs in demo mode.
2. If the variables exist but `Cloudinary` cannot be reached, the app also falls back to demo mode.

## Requirements

1. `Node.js` 22 or newer is recommended.
2. `npm` is used as the package manager in this repo.

## Install Dependencies

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Expected behavior:

1. Without `.env.local`, you should see demo books.
2. With valid `Cloudinary` credentials, you should see books loaded from your configured folder.

## Build For Production

Create a production build:

```bash
npm run build
```

This compiles the app and prerenders the routes.

## Launch The Production Build

After building, start the production server with:

```bash
npm run start
```

By default, the production server runs on port `3000`.

## Lint

Run the linter with:

```bash
npm run lint
```

## Deployment

Recommended deployment flow:

1. Push the repository to `GitHub`.
2. Import the repo into `Vercel`.
3. Add the same environment variables in the `Vercel` project settings.
4. Deploy.

## Current Runtime Behavior

1. The homepage shows whether the app is using `Cloudinary` data or demo data.
2. Book pages are statically generated and revalidated every 5 minutes.
3. If `Cloudinary` requests fail, demo books are shown instead of a broken empty state.

## Troubleshooting

1. `Cloudinary connected` does not appear.
   Check that `.env.local` exists and contains valid credentials.

2. No real books appear.
   Confirm that `CLOUDINARY_LIBRARY_FOLDER` points to an existing root folder and that it contains subfolders with images.

3. Images are out of order.
   Rename files with sortable names such as `001.jpg`, `002.jpg`, `003.jpg`.

4. Build works but uses demo books.
   This means the app could not load live `Cloudinary` data and fell back safely.
