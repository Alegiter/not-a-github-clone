// TODO: add some fancy store to use "computed" for example

type Store = {
    githubAccessToken: string | undefined
    isLoggedIn: boolean
}

export const store: Store = {
    githubAccessToken: undefined,
    // could be "computed" from githubAccessToken
    isLoggedIn: false
}