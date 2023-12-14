import { describe, expect, it } from "vitest"
import { getGithubRepositories, getGithubRepositoryTree, getGithubWhoAmI } from "../api"
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

        it("should load repository tree", async () => {
            const { repository } = await getGithubRepositoryTree("Alegiter", "not-a-github-clone")
            const tree = repository?.object
            if (tree?.__typename !== "Tree") {
                throw new Error("Expected Tree type")
            }
            if (!tree.entries) {
                throw new Error("Expected tree to have entries")
            }
            // Assuming that root directory has at least 2 "package"-like files and more
            const files = tree.entries.filter((entry) => entry.name.includes("package"))
            expect(files.length).toBeGreaterThanOrEqual(2)
        })

        it("should load repository tree by branch and folder path", async () => {
            const { repository } = await getGithubRepositoryTree("Alegiter", "not-a-github-clone", "main", "packages")
            const tree = repository?.object
            if (tree?.__typename !== "Tree") {
                throw new Error("Expected Tree type")
            }
            if (!tree.entries) {
                throw new Error("Expected tree to have entries")
            }
            // Assuming that packages directory has at least "front" folder or more
            expect(tree.entries.length).toBeGreaterThanOrEqual(1)
            const folder = tree.entries.find((entry) => entry.name === "front")
            expect(folder?.name).toBe("front")
        })
    })
})
