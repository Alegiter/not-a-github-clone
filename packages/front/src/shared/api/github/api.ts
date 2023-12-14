import { store } from "~/shared/model"
import { graphql } from "@github-graphql-documents"
import { RequestOptions, Variables, request } from "graphql-request"

const baseUrl = import.meta.env.BASE_URL

export const redirectToAppAuthorizationUrl = `/login/oauth/authorize`

export async function loadUserAccessToken(code: string): Promise<void> {
    const url = `${baseUrl}login/oauth/access_token?code=${code}`
    const res = await fetch(url, {
        method: "POST"
    })
    const result = await res.text()
    const accessToken = new URLSearchParams(result).get("access_token")
    if (!accessToken) {
        throw new Error("No access token loaded")
    }
    console.log("loadUserAccessToken | consider logged in");
    store.githubAccessToken = accessToken
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
        requestHeaders: {
            Authorization: `Bearer ${store.githubAccessToken}`
        },
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