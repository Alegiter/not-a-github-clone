import { Stack } from "@mui/material"
import { FC, memo } from "react"
import { FileViewerUi } from "~/entities/file"
import { RepositoryFilesTreeUi } from "~/entities/repository"

type Props = {
    file?: boolean
}

export const RepositoryPage: FC<Props> = memo(function RepositoryPage(props) {
    const { file } = props
    return (<>
        <Stack direction="row">
            <RepositoryFilesTreeUi />
            {file && <FileViewerUi />}
        </Stack>
    </>)
})