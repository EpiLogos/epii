# Epi-Logos Frontend

## Project Overview

This is the frontend for the Epi-Logos system, a knowledge graph visualization and interaction platform. The codebase is organized according to the Bimba tech architecture, with each subsystem corresponding to a specific module in the #5-3 -Shakti lens.

## Bimba-Aligned Directory Structure

The codebase has been reorganized to align with the Bimba tech architecture. See the [Migration Guide](./MIGRATION_GUIDE.md) for details on the new directory structure and how to work with it.

## Project Info

**URL**: https://lovable.dev/projects/31fb6485-20e7-476b-bc99-183b041bf2ba

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/31fb6485-20e7-476b-bc99-183b041bf2ba) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- D3.js
- Three.js
- ForceGraph2D/3D
- React Query
- React Router

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/31fb6485-20e7-476b-bc99-183b041bf2ba) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
