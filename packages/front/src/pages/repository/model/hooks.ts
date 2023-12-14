import { useLoaderData } from "react-router-dom"

type PageData = {
    id: string
}

export function usePageLoaderData(): PageData {
    const id = useLoaderData()
    
    return {
        id: String(id)
    }
}