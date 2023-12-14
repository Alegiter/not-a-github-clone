import { FC, memo, useEffect, useState } from "react"
import { Form, useSearchParams } from "react-router-dom"

export const SearchInput: FC = memo(function SearchInput() {
    const [searchParams] = useSearchParams()
    const [query, setQuery] = useState("")

    useEffect(() => {
        const query = searchParams.get("q") || ""
        setQuery(query)
    }, [searchParams])

    return (
        <Form>
            <input
                name="q"
                type="search"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                }}
            />
        </Form>
    )
})