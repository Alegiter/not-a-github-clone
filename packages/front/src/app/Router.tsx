import { FC, memo } from "react"
import { createHashRouter, redirect, RouterProvider } from "react-router-dom"
import { LoginPageUi } from "~/pages/login"
import { SearchPageUi } from "~/pages/search"
import { loadGithubUserAccessToken } from "~/shared/api"
import { ROUTES } from "~/shared/config"
import { store } from "~/shared/model"

function authGuard() {
    if (store.isLoggedIn) {
        return null
    }

    return redirect(ROUTES.LOGIN)
}

const router = createHashRouter([
    {
        path: ROUTES.LOGIN,
        element: <LoginPageUi />,
        loader: async () => {
            if (store.isLoggedIn) {
                // ideally block navigation to login
                // or redirect to page from which was navigated
                return redirect(ROUTES.SEARCH)
            }

            const code = new URLSearchParams(window.location.search).get("code")
            if (code) {
                try {
                    await loadGithubUserAccessToken(code)
                } catch (e) {
                    // TODO: handle error
                    return null
                }
                return redirect(ROUTES.SEARCH)
            }

            return null
        }
    },
    {
        path: ROUTES.SEARCH,
        element: <SearchPageUi />,
        loader: authGuard
    }
])

export const Router: FC = memo(function Router() {
    return (
        <RouterProvider router={router} />
    )
})
