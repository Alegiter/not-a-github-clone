import { observer } from "mobx-react-lite"
import { FC, useRef } from "react"
import { useNavigation } from "react-router-dom"
import { RepositoryListUi } from "~/entities/repository"
import { SearchInputUi } from "~/features/search"

export const SearchPage: FC = observer(function SearchPage() {
    const containerRef = useRef(null)
    const navigation = useNavigation()
    const isLoading = navigation.state === "loading"

    return (<>
        Search page
        <br />
        <SearchInputUi />
        <br />
        {isLoading && (<>Loading...</>)}
        {!isLoading && (
            <div
                ref={containerRef}
                style={{ maxHeight: "300px", overflow: "auto" }}
            >
                <RepositoryListUi containerRef={containerRef} />
            </div>
        )}
    </>)
})