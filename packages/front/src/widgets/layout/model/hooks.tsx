import { FC, PropsWithChildren, useMemo } from "react"
import { useOutletContext } from "react-router-dom"

export function useAppLayout() {
    const outlet = useOutletContext<"sidebar" | "main">()

    const Sidebar = useMemo<FC<PropsWithChildren>>(() => {
        return ({ children }) => {
            return (<>
                {outlet === "sidebar" && children}
            </>)
        }
    }, [outlet])

    const Main = useMemo<FC<PropsWithChildren>>(() => {
        return ({ children }) => {
            return (<>
                {outlet === "main" && children}
            </>)
        }
    }, [outlet])

    return {
        Sidebar,
        Main
    }
}