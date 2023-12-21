import { Box } from "@mui/material"
import { observer } from "mobx-react-lite"
import { FC, useRef } from "react"
import { useNavigation } from "react-router-dom"
import { RepositoryListUi } from "~/entities/repository"
import { useAppLayout } from "~/widgets/layout"

export const SearchPage: FC = observer(function SearchPage() {
    const { Main } = useAppLayout()
    const containerRef = useRef(null)
    const navigation = useNavigation()
    const isLoading = navigation.state === "loading"

    return (<>
        <Main>
            {isLoading && (<>Loading...</>)}
            {!isLoading && (
                <Box
                    ref={containerRef}
                    sx={{ height: "100%", overflow: "auto" }}
                >
                    <RepositoryListUi containerRef={containerRef} />
                </Box>
            )}
        </Main>
    </>)
})