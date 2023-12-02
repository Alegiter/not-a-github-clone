import { FunctionComponent, memo } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { LoginPageUi } from "~/pages/login"
import { SearchPageUi } from "~/pages/search"
import { ROUTES } from "~/shared/config"

const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: <LoginPageUi />
    },
    {
        path: ROUTES.SEARCH,
        element: <SearchPageUi />
    }
])

export const Router: FunctionComponent = memo(function Router() {
    return (
        <RouterProvider router={router} />
    )
})