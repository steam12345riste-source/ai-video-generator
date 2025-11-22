# YOUWARE.md

# NanoGen - AI Image & Video Generator

This project is a React-based AI creative studio using Nano Banana for images and Sora-2 for videos. It features a modern, responsive UI built with Tailwind CSS and Framer Motion, integrating with the Youware AI SDK.

## Project Overview

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Design System**: Premium Dark Mode (Zinc/Amber palette, Noise textures, Glassmorphism)
- **AI Models**: 
  - Images: Nano Banana
  - Videos: Sora-2 (Configurable Duration, Audio, Aspect Ratio)
- **Key Features**:
  - Text-to-image generation (Real-time)
  - Text-to-video generation (Async polling)
  - Configurable video duration (4s, 8s, 12s)
  - Audio generation toggle
  - Aspect Ratio selector (16:9, 9:16)
  - Watermarked downloads ("by ExploitZ3r0")
  - Responsive design with fluid animations

## Architecture

### Directory Structure

- `src/api/`: Contains API integration logic (`image.ts`, `video.ts`).
- `src/components/`: Reusable UI components (`Header`, `PromptInput`, `ImageCard`, `VideoCard`).
- `src/pages/`: Main page views (`GeneratorPage`).
- `src/App.tsx`: Main application entry and routing.

### Key Components

- **GeneratorPage**: Manages application state, layout, and grid animations.
- **ImageCard/VideoCard**: Displays generated content with hover effects and watermarking.
- **PromptInput**: "Hero" input component with mode switching, duration selection, audio toggle, aspect ratio selector, and focus animations.
- **Header**: Floating, minimalist navigation.

## Development

### Commands

- **Install Dependencies**: `npm install`
- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`
- **Lint**: `npm run lint` (if available)

### AI Configuration

The AI model configuration is located in `yw_manifest.json`.
- **Image Model**: `nano-banana` (`b64_json`)
- **Video Model**: `sora-2` (1280x720, default 4s, default no audio)

### Error Handling

- **API Errors**: API errors are caught in the service layer (`src/api/`) and re-thrown with user-friendly messages where possible.
- **User Cancellation**: Specific handling for `USER_CANCELLED_HIGH_COST_REQUEST` prevents unnecessary error logging and provides a clean UI state.

## Database

*No database integration is currently implemented. Items are stored in local component state.*

## Future Improvements

- Implement persistent storage (localStorage or Backend).
- Add history persistence.
- Add more advanced settings (negative prompts).
