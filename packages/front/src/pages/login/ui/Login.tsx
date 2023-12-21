import { Box, Link } from "@mui/material"
import { FC, memo } from "react"
import { redirectToGithubAppAuthorizationUrl } from "~/shared/api"

export const LoginPage: FC = memo(function LoginPage() {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Link
                sx={{ margin: "auto" }}
                href={redirectToGithubAppAuthorizationUrl}
            >
                Continue with Github
            </Link>
        </Box>
    )
})