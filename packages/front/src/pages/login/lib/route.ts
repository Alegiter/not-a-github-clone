import { LoaderFunction, redirect } from "react-router-dom"
import { loginWithGithub } from "~/shared/api"
import { ROUTES } from "~/shared/config"
import { store } from "~/shared/model"

export const loader: LoaderFunction = async function loginPageLoader() {
    if (store.isLoggedIn) {
        // ideally block navigation to login
        // or redirect to page from which was navigated
        return redirect(ROUTES.ROOT)
    }

    const code = new URLSearchParams(window.location.search).get("code")
    if (!code) {
        return null
    }

    try {
        await loginWithGithub(code)
    } catch (e) {
        // TODO: handle error
        return null
    }
    return redirect(ROUTES.ROOT)
}