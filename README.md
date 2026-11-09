# Portfolio

Personal portfolio built with Vite, React, TypeScript and Tailwind. Deploys to Vercel.

## Develop
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Update content
- **Everything personal** (bio, skills, experience, projects, socials, GitHub and LeetCode usernames): `src/data/profile.ts`
- **Coding Activity section** pulls live data. GitHub is read in the browser. LeetCode is read through `api/leetcode.ts`, a serverless function that Vercel runs and `vite.config.ts` mirrors during `npm run dev`, because LeetCode blocks browser requests.
- **Resume**: drop your PDF at `public/resume.pdf`
- **Project screenshots**: `public/projects/*.png`, then set `image: '/projects/name.png'` in `profile.ts`
- **Headshot** (optional): `public/avatar.jpg`, then set `avatar: '/avatar.jpg'`
- **Page title / SEO**: `index.html`

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. On vercel.com, go to **Add New → Project**, import the repo, keep the "Vite" preset, and click **Deploy**.
3. Every push to `main` redeploys automatically. `vercel.json` rewrites all paths to the app, so the 404 page works on direct URLs.
