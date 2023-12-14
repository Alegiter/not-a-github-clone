import { FC, memo } from "react"
import { usePageLoaderData } from "../model"

export const RepositoryPage: FC = memo(function RepositoryPage() {
    const { id } = usePageLoaderData()
    return (
        id
    )
})