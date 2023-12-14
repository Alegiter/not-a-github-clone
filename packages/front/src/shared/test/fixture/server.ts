import { ViteDevServer, createServer } from "vite"
import { afterAll, beforeAll } from "vitest"
import path from "path"

export function testInsideServer(fn: () => void): void {
    let server: ViteDevServer
    beforeAll(async () => {
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