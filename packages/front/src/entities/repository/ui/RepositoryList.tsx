import { FC, RefObject, memo, useCallback, useEffect } from "react"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { ViewportList } from "react-viewport-list"
import { repositoryListStore, loadNextRepositoryList } from "../model"
import { ROUTES, linkBuild } from "~/shared/config"
import { Link } from "react-router-dom"

type Props = {
    containerRef: RefObject<HTMLElement | null>
}

export const RepositoryList: FC<Props> = memo(function RepoList(props) {
    const { containerRef } = props

    const loading = repositoryListStore.loading
    const items = repositoryListStore.items
    const total = repositoryListStore.total
    const hasNextPage = repositoryListStore.hasNextPage

    const fetchMore = useCallback(() => {
        loadNextRepositoryList()
    }, [])

    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: fetchMore,
        rootMargin: "0px 0px 300px 0px",
    })

    useEffect(() => {
        rootRef(containerRef.current)
    }, [rootRef, containerRef])

    return (
        <ViewportList
            viewportRef={containerRef}
            count={total}
            overscan={10}
        >
            {(index) => {
                const ind = index as number
                const item = items[ind]
                if (item) {
                    const link = linkBuild(ROUTES.REPOSITORY, item.owner, item.name)
                    return (
                        <div key={item.id} className="item">
                            <Link
                                to={link}
                            >
                                {item.nameWithOwner}
                            </Link>
                        </div>
                    )
                }
                if (loading || hasNextPage) {
                    return (
                        <div key={ind} ref={sentryRef}>
                            Loading...
                        </div>
                    )
                }

            }}
        </ViewportList>
    )
})