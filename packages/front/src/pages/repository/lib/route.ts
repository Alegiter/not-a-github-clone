import { LoaderFunction } from "react-router-dom"

export const loader: LoaderFunction = async function repositoryPageLoader({params}) {
    return params
}