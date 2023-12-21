import { FC, memo } from "react"
import { createHashRouter, redirect, RouterProvider } from "react-router-dom"
import { LoginPageUi, loginPageLoader } from "~/pages/login"
import { ROUTES } from "~/shared/config"
import { store } from "~/shared/model"
import { AppLayout } from "~/widgets/layout"

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
        path: ROUTES.ROOT,
        element: <AppLayout/>,
        loader: authGuard,
        children: [
            {
                index: true,
                lazy: () => import("~/pages/search").then(module => {
                    console.log("Router | lazy | search page")
                    return {
                        element: <module.SearchPageUi />,
                        loader: module.searchPageLoader
                    }
                }),
            },
            {
                path: ROUTES.REPOSITORY,
                children: [
                    {
                        index: true,
                        lazy: () => import("~/pages/repository").then(module => {
                            console.log("Router | lazy | repository page")
                            return {
                                element: <module.RepositoryPageUi />,
                                loader: module.repositoryPageLoader
                            }
                        }),
                    },
                    {
                        path: ROUTES.REPOSITORY_FILE,
                        lazy: () => import("~/pages/repository").then(module => {
                            console.log("Router | lazy | repository page | file")
                            return {
                                element: <module.RepositoryPageUi file />,
                                loader: module.repositoryPageLoader
                            }
                        }),
                    }
                ]
            },
        ]
    },
    {
        path: "*",
        loader: () => redirect(ROUTES.ROOT)
    }
])

export const Router: FC = memo(function Router() {
    return (
        <RouterProvider router={router} />
    )
})
