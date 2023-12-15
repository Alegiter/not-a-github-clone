import { FC, memo } from "react"
import { usePageLoaderData } from "../model"

export const RepositoryPage: FC = memo(function RepositoryPage() {
    const { owner, name } = usePageLoaderData()
    return (<>
        {owner}/{name}
    </>)
})