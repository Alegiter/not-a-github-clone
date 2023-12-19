import { LoaderFunction } from "react-router-dom"
import { loadInitialRepositoryFilesTree } from "~/entities/repository"

type RouteData = {
    owner: string
    name: string
}

export const loader: LoaderFunction = async function repositoryPageLoader({params}) {
    const { owner, name } = params as RouteData
    await loadInitialRepositoryFilesTree(owner, name)
    return null
}