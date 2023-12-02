import { FunctionComponent, memo } from "react"
import { loadGithubUserAccessToken, redirectToGithubAppAuthorizationUrl } from "~/shared/api"

const code = new URLSearchParams(window.location.search).get("code")

if (code) {
    loadGithubUserAccessToken(code)
        .then(() => {
            // TODO: navigate to search page
        })
        .catch(() => {
            // TODO: handle error
        })
}

export const LoginPage: FunctionComponent = memo(function LoginPage() {

    if (!code) {
        return (
            <a
                href={redirectToGithubAppAuthorizationUrl}
            >
                Continue with Github
            </a>
        )
    }

    return (<>
        Loading...
    </>)
})