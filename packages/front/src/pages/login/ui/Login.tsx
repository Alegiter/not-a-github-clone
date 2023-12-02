import { FunctionComponent, memo, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loadGithubUserAccessToken, redirectToGithubAppAuthorizationUrl } from "~/shared/api"
import { ROUTES } from "~/shared/config"

const code = new URLSearchParams(window.location.search).get("code")

export const LoginPage: FunctionComponent = memo(function LoginPage() {
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (code) {
            loadGithubUserAccessToken(code)
                .then(() => {
                    navigate(ROUTES.SEARCH)
                })
                .catch(() => {
                    // TODO: handle error
                })
        }
    }, [navigate])

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