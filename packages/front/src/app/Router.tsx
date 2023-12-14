import { FC, memo } from "react"
import { createHashRouter, redirect, RouterProvider } from "react-router-dom"
import { LoginPageUi, loginPageLoader } from "~/pages/login"
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
        loader: loginPageLoader
    },
    {
        path: ROUTES.SEARCH,
        lazy: () => import("~/pages/search").then(module => {
            console.log("Router | lazy | search page")
            return {
                element: <module.SearchPageUi />
            }
        }),
        loader: authGuard
    },
    {
        path: "*",
        loader: () => redirect(ROUTES.LOGIN)
    }
])

export const Router: FC = memo(function Router() {
    return (
        <RouterProvider router={router} />
    )
})
