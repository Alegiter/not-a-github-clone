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
                <div
                    ref={containerRef}
                    style={{ maxHeight: "300px", overflow: "auto" }}
                >
                    <RepositoryListUi containerRef={containerRef} />
                </div>
            )}
        </Main>
    </>)
})