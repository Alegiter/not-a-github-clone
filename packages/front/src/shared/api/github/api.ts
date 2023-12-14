import { store } from "~/shared/model"
import { graphql } from "@github-graphql-documents"
import { RequestOptions, Variables, request } from "graphql-request"

const baseUrl = import.meta.env.BASE_URL

export const redirectToAppAuthorizationUrl = `/login/oauth/authorize`

export async function login(code: string): Promise<void> {
    const url = `${baseUrl}login/oauth/access_token?code=${code}`
    const res = await fetch(url, {
        method: "POST"
    })
    const isLoggedIn = res.status === 200
    if (!isLoggedIn) {
        throw new Error("No access token loaded")
    }
    console.log("login | consider logged in");
    store.isLoggedIn = true
}

async function fetchGraphql<T = unknown, V extends Variables = Variables>(
    options: RequestOptions<V, T>
): Promise<T> {
    // @ts-expect-error type of options.document is correct
    return request({
        url: `${baseUrl}graphql`,
        document: options.document,
        variables: options.variables,
    })
}

const whoAmIDocument = graphql(`
    query whoAmI {
        viewer {
            login
        }
    }
`)

export async function getWhoAmI(): Promise<string> {
    const result = await fetchGraphql({
        document: whoAmIDocument
    })
    return result.viewer.login
}

const searchReposDocument = graphql(`
    query searchRepos($query:String!, $first:Int, $last:Int $after:String, $before:String) {
        search(type: REPOSITORY, query: $query, first: $first, last: $last after: $after, before: $before) {
            nodes {
                ... on Repository {
                    __typename,
                    id,
                    nameWithOwner
                }
            },
            repositoryCount,
            pageInfo {
                startCursor,
                endCursor,
                hasPreviousPage,
                hasNextPage
            }
        }
    }
`)

export async function getRepositories(query: string, limit: number, cursor?: string, order: "asc" | "desc" = "asc") {
    return fetchGraphql({
        document: searchReposDocument,
        variables: {
            query,
            first: null,
            last: null,
            after: null,
            before: null,
            ...(order === "asc" && { first: limit, after: cursor }),
            ...(order === "desc" && { last: limit, before: cursor })
        }
    })
}