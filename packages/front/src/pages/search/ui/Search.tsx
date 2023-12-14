import { observer } from "mobx-react-lite"
import { FC, useCallback, useRef } from "react"
import { loadInitialRepositoryList, loadNextRepositoryList, repositoryListStore, RepositoryListUi } from "~/entities/repository"

const query = "react"
loadInitialRepositoryList(query)

export const SearchPage: FC = observer(function SearchPage() {
    const loading = repositoryListStore.loading
    const items = repositoryListStore.items
    const total = repositoryListStore.total
    const hasNextPage = repositoryListStore.hasNextPage
    const containerRef = useRef(null)

    const fetchMore = useCallback(() => {
        loadNextRepositoryList(query)
    }, [])

    return (<>
        Search page
        <br />
        <div ref={containerRef} style={{ maxHeight: "300px", overflow: "auto" }}>
            <RepositoryListUi
                containerRef={containerRef}
                total={total}
                items={items}
                fetchMore={fetchMore}
                hasNextPage={hasNextPage}
                isFetching={loading}
            />
        </div>
    </>)
})