import { ViteDevServer, createServer } from "vite"
import { afterAll, beforeAll, expect } from "vitest"
import { store } from "~/shared/model"
import path from "path"

const ACCESS_TOKEN = import.meta.env.TEST_GITHUB_ACCESS_TOKEN

export function testInsideServer(fn: () => void): void {
    let server: ViteDevServer
    beforeAll(async () => {
        expect(ACCESS_TOKEN).toBeDefined()
        store.githubAccessToken = ACCESS_TOKEN

        console.log("Vite server | starting");
        
        server = await createServer({
            configFile: path.resolve(__dirname, "..", "..", "..", "..", "vite.config.ts"),
        })
        await server.listen()
        
        console.log("Vite server | started");
    })
    
    afterAll(() => {
        console.log("Vite server | stopping");
        server?.close()
        console.log("Vite server | stopped");
    })

    fn()
}