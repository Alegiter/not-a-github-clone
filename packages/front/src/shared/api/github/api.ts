export const redirectToAppAuthorizationUrl = `/login/oauth/authorize`

let token: string | undefined

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
    token = accessToken
}
