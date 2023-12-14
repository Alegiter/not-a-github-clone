import { describe, expect, it } from "vitest"
import { getGithubRepositories, getGithubWhoAmI } from "../api"
import { testInsideViteServer } from "./fixture"

describe("Github graphql integration", () => {
    testInsideViteServer(() => {
        it("should get login", async () => {
            const login = import.meta.env.TEST_GITHUB_LOGIN
            expect(login).toBeDefined()


            const resultLogin = await getGithubWhoAmI()
            expect(resultLogin).toBe(login)
        })  

        it("should get this repo", async () => {
            const result = await getGithubRepositories("alegiter/not-a-github-clone", 1)
            expect(result.search.repositoryCount).toBe(1)
        })

        it("should paginate repos", async () => {
            const query = "react"
            const limit = 5
            const { search: initialSearch } = await getGithubRepositories(query, limit)
            expect(initialSearch.pageInfo.hasNextPage).toBeTruthy()
            if (!initialSearch.pageInfo.endCursor) {
                throw new Error("initialSearch.pageInfo.endCursor expected")
            }

            const { search: nextSearch } = await getGithubRepositories(query, limit, initialSearch.pageInfo.endCursor)
            expect(nextSearch.pageInfo.startCursor).not.toBe(initialSearch.pageInfo.endCursor)
            expect(nextSearch.pageInfo.hasPreviousPage).toBeTruthy()
            if (!nextSearch.pageInfo.startCursor) {
                throw new Error("nextSearch.pageInfo.startCursor expected")
            }

            const { search: previousSearch } = await getGithubRepositories(query, limit, nextSearch.pageInfo.startCursor, "desc")
            expect(previousSearch.pageInfo.endCursor).toBe(initialSearch.pageInfo.endCursor)
        })
    })
})
