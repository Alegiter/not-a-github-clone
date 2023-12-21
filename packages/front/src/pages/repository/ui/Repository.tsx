import { Box } from "@mui/material"
import { FC, memo } from "react"
import { FileViewerUi } from "~/entities/file"
import { RepositoryFilesTreeUi } from "~/entities/repository"
import { useAppLayout } from "~/widgets/layout"

type Props = {
    file?: boolean
}

export const RepositoryPage: FC<Props> = memo(function RepositoryPage(props) {
    const { file } = props
    const { Sidebar, Main } = useAppLayout()
    return (<>
        <Sidebar>
            <RepositoryFilesTreeUi />
        </Sidebar>
        <Main>
            {file && (
                <Box sx={{ flex: 1, overflow: "auto" }}>
                    <FileViewerUi />
                </Box>
            )}
        </Main>
    </>)
})