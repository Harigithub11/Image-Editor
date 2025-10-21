# AI Passport Photo Creator

An intelligent application that automatically transforms photos into passport-ready images with proper lighting, background, and composition.

## Features

- Automatic passport photo formatting (35mm x 35mm equivalent)
- Background conversion to solid white
- Intelligent lighting correction and exposure balancing
- Face-centered composition with proper headroom
- Professional portrait enhancement
- Download as JPEG format

## Run Locally

**Prerequisites:** Node.js 16+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file and add your Gemini API key:
   ```
   API_KEY=your-gemini-api-key-here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Harigithub11/Image-Editor)

### Manual Deployment Steps:

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your GitHub repository

5. Configure environment variables:
   - Add `API_KEY` with your Gemini API key

6. Click "Deploy"

Your app will be live in minutes at `https://your-app-name.vercel.app`
