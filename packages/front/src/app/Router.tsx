import { FC, memo } from "react"
import { createHashRouter, redirect, RouterProvider, LoaderFunction } from "react-router-dom"
import { LoginPageUi, loginPageLoader } from "~/pages/login"
import { repositoryPageLoader } from "~/pages/repository"
import { searchPageLoader } from "~/pages/search"
import { ROUTES } from "~/shared/config"
import { store } from "~/shared/model"

function loaderFlow(...fns: Array<LoaderFunction>): LoaderFunction {
    return async (args) => {
        for (const loader of fns) {
            const response = await loader(args)
            if (response === null) {
                continue
            }
            return response
        }
        return null
    }
}

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
        loader: loaderFlow(
            authGuard,
            searchPageLoader
        )
    },
    {
        path: ROUTES.REPOSITORY,
        lazy: () => import("~/pages/repository").then(module => {
            console.log("Router | lazy | repository page")
            return {
                element: <module.RepositoryPageUi />
            }
        }),
        loader: loaderFlow(
            authGuard,
            repositoryPageLoader
        )
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
