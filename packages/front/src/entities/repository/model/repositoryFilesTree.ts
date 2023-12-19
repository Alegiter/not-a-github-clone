import { observable, runInAction } from "mobx"
import { getGithubRepositoryTree } from "~/shared/api"

type BaseNode = {
    id: string
    label: string
    children?: Array<BaseNode>
    isLeaf: boolean
}

type RootNode = { root: true, children: Array<BaseNode> }

export type TreeNode = RootNode | BaseNode

type Store = {
    nodes: RootNode
    owner: string
    name: string
}

export const store = observable<Store>({
    nodes: {
        root: true,
        children: []
    },
    owner: "",
    name: ""
})

export function reset() {
    runInAction(() => {
        store.nodes = {
            root: true,
            children: []
        }
        store.owner = ""
        store.name = ""
    })
}

export async function loadInitialTree(owner: string, name: string) {
    runInAction(() => {
        reset()
        store.owner = owner
        store.name = name
    })
    const result = await getGithubRepositoryTree(owner, name)
    runInAction(() => {
        const tree = result.repository?.object
        if (tree?.__typename !== "Tree" || !tree.entries) {
            return
        }
        store.nodes.children = tree.entries.map<BaseNode>((entry) => {
            return {
                id: entry.oid,
                label: entry.name,
                isLeaf: entry.type !== "tree"
            }
        })
    })
}