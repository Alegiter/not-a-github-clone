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
    })
})
