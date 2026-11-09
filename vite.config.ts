import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Serves the Vercel serverless function in /api during `npm run dev`, so the site
// behaves the same locally as it does once deployed.
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/leetcode', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/leetcode.ts')
          await mod.default(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApi()],
})
