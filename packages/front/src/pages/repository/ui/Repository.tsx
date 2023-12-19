import { FC, memo } from "react"
import { RepositoryFilesTreeUi } from "~/entities/repository"

export const RepositoryPage: FC = memo(function RepositoryPage() {
    return (<>
        <RepositoryFilesTreeUi/>
    </>)
})