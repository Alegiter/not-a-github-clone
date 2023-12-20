import { observable, runInAction } from "mobx"
import { getGithubRepositoryTree } from "~/shared/api"
import { arrayToTree } from "../lib"

type FlatNode = {
    id: string
    parentId: string | null
    label: string
    isLeaf: boolean
    path: string
}

type NestedNode = FlatNode & {
    children: Array<NestedNode>
}

type RootNode = { root: true, children: Array<NestedNode> }

export type TreeNode = RootNode | NestedNode

type Store = {
    nodes: RootNode
    flatNodes: Array<FlatNode>
        owner: string
    name: string
    branch: string | undefined
}

export const store = observable<Store>({
    nodes: {
        root: true,
        children: []
    },
    flatNodes: [],
        owner: "",
    name: "",
    branch: undefined
})

export function reset() {
    runInAction(() => {
        store.nodes = {
            root: true,
            children: []
        }
        store.flatNodes = []
        store.owner = ""
        store.name = ""
        store.branch = undefined
    })
}

function rebuildTree() {
    runInAction(() => {
        store.nodes.children = arrayToTree(store.flatNodes) as Array<NestedNode>
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
        store.flatNodes = tree.entries.map<FlatNode>((entry) => ({
            id: `${entry.oid}-${entry.name}`,
            parentId: null,
            label: entry.name,
            isLeaf: entry.type !== "tree",
            path: entry.name
        }))
        rebuildTree()
    })
}

export async function loadSubTree(parentNodeId: string, path: string) {
    const result = await getGithubRepositoryTree(store.owner, store.name, store.branch, path)
    runInAction(() => {
        const tree = result.repository?.object
        if (tree?.__typename !== "Tree" || !tree.entries) {
            return
        }
        const nodes = tree.entries.map<FlatNode>((entry) => {
            return {
                id: `${entry.oid}-${entry.name}`,
                parentId: parentNodeId,
                label: entry.name,
                isLeaf: entry.type !== "tree",
                path: `${path}/${entry.name}`
            }
        })
        store.flatNodes.push(...nodes)
        rebuildTree()
    })
}