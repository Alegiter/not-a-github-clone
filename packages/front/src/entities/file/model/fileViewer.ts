import { observable, runInAction } from "mobx"
import { getGithubRepositoryFileInfo, getGithubRepositoryFileText } from "~/shared/api"

const BITE_SIZE_OVERFLOW = 500000

type Store = {
    text: string
    isTooBig: boolean
    language: string
    isSupported: boolean
    owner: string
    repositoryName: string
    branch: string | undefined
    path: string
}

export const store = observable<Store>({
    text: "",
    isTooBig: false,
    language: "text",
    isSupported: true,
    owner: "",
    repositoryName: "",
    branch: undefined,
    path: ""
})

function reset() {
    runInAction(() => {
        store.text = ""
        store.isTooBig = false
        store.language = "text"
        store.isSupported = true
        store.owner = ""
        store.repositoryName = ""
        store.branch = undefined
        store.path = ""
    })
}

export async function loadFileInitially(owner: string, repositoryName: string, branch: string = "HEAD", path: string) {
    runInAction(() => {
        store.owner = owner
        store.repositoryName = repositoryName
        store.branch = branch
        store.path = path
    })
    const result = await getGithubRepositoryFileInfo(owner, repositoryName, branch, path)
    const info = result.repository?.object
    if (info?.__typename !== "Blob") {
        return
    }
    if (info.isBinary) {
        runInAction(() => {
            store.isSupported = false
        })
        return
    }
    if (info.byteSize > BITE_SIZE_OVERFLOW) {
        runInAction(() => {
            store.isTooBig = true
        })
        return
    }
    loadFileExplicitly()
}

export async function loadFileExplicitly() { 
    const owner = store.owner
    const repositoryName = store.repositoryName
    const branch = store.branch
    const path = store.path
    if (!owner || !repositoryName || !path) {
        throw new Error("To explicitly load file make initial load")
    }

    const result = await getGithubRepositoryFileText(owner, repositoryName, branch, path)
    const file = result.repository?.object
    if (file?.__typename !== "Blob") {
        return
    }
    runInAction(() => {
        reset()
        store.text = file.text || ""
    })

    // could make lazy file language detection
}