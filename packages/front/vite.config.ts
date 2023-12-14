import { defineConfig, loadEnv } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import codegen from 'vite-plugin-graphql-codegen'

const root = path.resolve(process.cwd(), "..", "..")

const github = {
  target: "https://github.com",
  api: {
    target: "https://api.github.com"
  },
  accessToken: ""
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '')
  Object.assign(process.env, env)

  const isAppAuth = !!env.CLIENT_ID && !!env.CLIENT_SECRET && !!env.CLIENT_REDIRECT_URI
  const isTokenAuth = !!env.ACCESS_TOKEN

  if (!isAppAuth && !isTokenAuth) {
    throw new Error("Provide env variables either for Github App auth or personal access token")
  }
  
  if (!isTokenAuth && (!env.CLIENT_ID || !env.CLIENT_SECRET || !env.CLIENT_REDIRECT_URI)) {
    throw new Error("Env variables 'CLIENT_ID', 'CLIENT_SECRET' and/or 'CLIENT_REDIRECT_URI' for Guthib App auth are not provided")
  }

  if (isTokenAuth) {
    console.log(
      "\n",
      "Personal access token is provided.",
      "\n",
      "App will use it instead of log in Github App",
      "\n" 
    );
    github.accessToken = env.ACCESS_TOKEN
    env.VITE_IS_LOGGED_IN = "true"
  }

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      codegen()
    ],
    base: env.BASE_URL,
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
          selfHandleResponse: true,
          configure(proxy) {
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("proxy | configure | store access token")
              const bodyChunks = []
              proxyRes.on('data', function (chunk) {
                bodyChunks.push(chunk)
              })
              proxyRes.on('end', function () {
                const body = Buffer.concat(bodyChunks).toString()
                const accessToken = new URLSearchParams(body).get("access_token")
                if (!accessToken) {
                  res.writeHead(500, "Did not accept access token")
                } else {
                  github.accessToken = accessToken
                }
                res.end()
              })
            })
          }
        },
        "/graphql": {
          target: github.api.target,
          changeOrigin: true,
          configure(proxy) {
            console.log("proxy | configure | add authorization token")

            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Authorization", `Bearer ${github.accessToken}`)
            })
          },
        }
      }
    }
  }
})
