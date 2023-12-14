import { observable } from "mobx"

type Store = {
    isLoggedIn: boolean
}

export const store = observable<Store>({
    isLoggedIn: import.meta.env.VITE_IS_LOGGED_IN
})