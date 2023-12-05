import { store } from "~/shared/model"

export const redirectToAppAuthorizationUrl = `/login/oauth/authorize`

export async function loadUserAccessToken(code: string): Promise<void> {
    const url = `/login/oauth/access_token?code=${code}`
    const res = await fetch(url, {
        method: "POST"
    })
    const result = await res.text()
    const accessToken = new URLSearchParams(result).get("access_token")
    if (!accessToken) {
        throw "No access token loaded"
    }
    console.log("loadUserAccessToken | consider logged in");
    store.githubAccessToken = accessToken
    store.isLoggedIn = true
}
