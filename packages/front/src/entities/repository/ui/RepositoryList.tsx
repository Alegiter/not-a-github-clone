import { FC, RefObject, memo, useCallback, useEffect } from "react"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { ViewportList } from "react-viewport-list"
import { repositoryListStore, loadNextRepositoryList, Repository } from "../model"
import { ROUTES, linkBuild } from "~/shared/config"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material"

type Props = {
    containerRef: RefObject<HTMLElement | null>
}

export const RepositoryList: FC<Props> = observer(function RepoList(props) {
    const { containerRef } = props

    const loading = repositoryListStore.loading
    const items = repositoryListStore.items
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
            count={items.length + 3}
            overscan={10}
        >
            {(index) => {
                const ind = index as number
                const item = items[ind]
                if (item) {
                    return (
                        <RepositoryListItem
                            key={item.id}
                            item={item}
                        />
                    )
                }
                if (loading || hasNextPage) {
                    const isSentry = ind - items.length === 0
                    return (
                        <ListItem key={ind} ref={isSentry ? sentryRef : null}>
                            <Skeleton component="div" variant="rectangular" width="100%" />
                        </ListItem>
                    )
                }

            }}
        </ViewportList>
    )
})

type RepositoryListItemProps = {
    item: Repository
}
const RepositoryListItem: FC<RepositoryListItemProps> = memo(function RepositoryListItem(props) {
    const { item } = props
    const link = linkBuild(ROUTES.REPOSITORY, item.owner, item.name)
    const navigate = useNavigate()

    const onClick = useCallback(() => {
        navigate(link)
    }, [navigate, link])

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
                <ListItemText primary={item.nameWithOwner} />
            </ListItemButton>
        </ListItem>
    )
})