import { defineConfig, loadEnv } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

const root = path.resolve(process.cwd(), "..", "..")

const github = {
  target: "https://github.com",
  api: {
    target: "https://api.github.com"
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '')
  Object.assign(process.env, env)

  if (!env.CLIENT_ID || !env.CLIENT_SECRET) {
    throw new Error("Env variables 'CLIENT_ID' and 'CLIENT_SECRET' for Guthib App are not provided")
  }

  if (!env.CLIENT_REDIRECT_URI) {
    throw new Error("Env variable CLIENT_REDIRECT_URI for Github App is not provided")
  }

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        "/login/oauth/authorize": {
          target: github.target,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("proxyReq", (_, req, res) => {
              console.log("proxy | configure | redirect authorize to github app")
              const path = req.url
              res.writeHead(301, { Location: `${github.target}${path}?client_id=${env.CLIENT_ID}&redirect_uri=${env.CLIENT_REDIRECT_URI}` })
            })
          },
        },
        "/login/oauth/access_token?code": {
          target: github.target,
          changeOrigin: true,
          rewrite(path) {
            console.log("proxy | rewrite | add client secret")

            return `${path}&client_id=${env.CLIENT_ID}&client_secret=${env.CLIENT_SECRET}`
          },
        },
        "/graphql": {
          target: github.api.target,
          changeOrigin: true
        }
      }
    }
  }
})
