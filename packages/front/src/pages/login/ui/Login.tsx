import { FC, memo } from "react"
import { redirectToGithubAppAuthorizationUrl } from "~/shared/api"

export const LoginPage: FC = memo(function LoginPage() {
    return (
        <a
            href={redirectToGithubAppAuthorizationUrl}
        >
            Continue with Github
        </a>
    )
})