import { LoaderFunction } from "react-router-dom"
import { loadInitialViewerFile } from "~/entities/file/model"
import { loadInitialRepositoryFilesTree } from "~/entities/repository"

type RouteData = {
    owner: string
    name: string
    "*": string
}

export const loader: LoaderFunction = async function repositoryPageLoader({params}) {
    const { owner, name, "*": path } = params as RouteData
    if (path) {
        await loadInitialViewerFile(owner, name, undefined, path)
        return null
    } 
    await loadInitialRepositoryFilesTree(owner, name)
    return null
}