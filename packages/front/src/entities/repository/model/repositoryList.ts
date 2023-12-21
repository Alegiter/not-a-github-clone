import { observable, runInAction } from "mobx"
import { Repository } from "./types"
import { getGithubRepositories } from "~/shared/api"

type Store = {
    items: Array<Repository>
    total: number
    loading: boolean
    hasNextPage: boolean
    endCursor: string | null
    limit: number
    q: string
}

export const store = observable<Store>({
    items: [],
    total: 0,
    loading: false,
    hasNextPage: false,
    endCursor: null,
    limit: 50,
    q: ""
})

export function reset() {
    runInAction(() => {
        store.items = []
        store.total = 0
        store.loading = false
        store.hasNextPage = false
        store.endCursor = null
        store.limit = 50
        store.q = ""
    })
}

export async function loadInitial(query: string) {
    reset()
    await load(query, 10)
}

export async function loadNext() {
    if (!store.endCursor) {
        throw new Error("Can't load next | endCursor required");
    }

    await load(store.q, store.limit, store.endCursor)
}

async function load(query: string, limit: number, cursor?: string, order: "asc" | "desc" = "asc") {
    runInAction(() => {
        store.loading = true
        store.q = query
    })
    const result = await getGithubRepositories(query, limit, cursor, order)
    runInAction(() => {
        store.total = result.search.repositoryCount
        store.hasNextPage = result.search.pageInfo.hasNextPage
        store.endCursor = result.search.pageInfo.endCursor

        if (!result.search.nodes) {
            return
        }

        const newItems = result.search.nodes.reduce<Array<Repository>>((acc, item) => {
            if (item?.__typename === "Repository") {
                const {owner, ...restItem} = item
                acc.push({
                    ...restItem,
                    owner: owner.login
                })
            }
            return acc
        }, [])
        store.items = store.items.concat(newItems)
        store.loading = false
    })
}