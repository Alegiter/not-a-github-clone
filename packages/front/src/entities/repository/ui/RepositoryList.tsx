import { FC, RefObject, memo, useEffect } from "react"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { ViewportList } from "react-viewport-list"
import type { Repository } from "../model"

type Props = {
    containerRef: RefObject<HTMLElement | null>
    items: Array<Repository>
    total: number
    fetchMore: () => void
    isFetching: boolean
    hasNextPage: boolean
}

export const RepositoryList: FC<Props> = memo(function RepoList(props) {
    const { containerRef, items, total, fetchMore, isFetching, hasNextPage } = props

    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading: isFetching,
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
                    return (
                        <div key={item.id} className="item">
                            {item.nameWithOwner}
                        </div>
                    )
                }
                if (isFetching || hasNextPage) {
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