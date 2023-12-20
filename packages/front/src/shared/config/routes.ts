export enum ROUTES {
    LOGIN = "/",
    SEARCH = "/search",
    REPOSITORY = "/repository/:owner/:name",
    REPOSITORY_FILE = "*"
}

type RouteParams = {
    [ROUTES.LOGIN]: [],
    [ROUTES.SEARCH]: [],
    [ROUTES.REPOSITORY]: [owner: string, name: string, path?: string],
    [ROUTES.REPOSITORY_FILE]: [],
}

export function linkBuild<To extends ROUTES, Params extends RouteParams[To]>(to: To, ...args: Params): string {
    if (!to.includes(":")) {
        return to
    }
    let result = to as string
    const matches = to.match(new RegExp(":([^/]+)", "g"))
    matches?.forEach((match, index) => {
        const variable = args[index] as string || ""
        result = result.replace(match, variable)
    })
    if (result.endsWith("/")) {
        return result.slice(0, -1)
    }
    return result
}