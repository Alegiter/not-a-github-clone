import { useLoaderData } from "react-router-dom"

type PageData = {
    owner: string
    name: string
}

export function usePageLoaderData(): PageData {
    const data = useLoaderData() as PageData
    
    return data
}
