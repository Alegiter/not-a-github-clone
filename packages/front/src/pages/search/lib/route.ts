import { LoaderFunction } from "react-router-dom"
import { loadInitialRepositoryList, resetRepositoryList } from "~/entities/repository"

export const loader: LoaderFunction = async function searchPageLoader({ request }) {
    const url = new URL(request.url)
    const query = url.searchParams.get("q")
    if (!query) {
        resetRepositoryList()
        return null
    }
    await loadInitialRepositoryList(query)
    return null
}