import { createServer } from "vite"
import path from "path"


export default async function () {
    console.log("Vite server | starting")

    const server = await createServer({
        configFile: path.resolve(__dirname, "vite.config.ts"),
    })
    await server.listen()

    console.log("Vite server | started")

    return async () => {
        console.log("Vite server | stopping")
        server.close()
        console.log("Vite server | stopped")
    }
}
