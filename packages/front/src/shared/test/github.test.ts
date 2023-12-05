import { describe, it, expect, beforeAll } from "vitest"
import { graphql } from "../api"
import { request } from "graphql-request"

const ACCESS_TOKEN = import.meta.env.TEST_GITHUB_ACCESS_TOKEN

const whoAmIDocument = graphql(`query WhoAmI {
  viewer {
    login
  }
}`)

describe("Github graphql integration", () => {
    beforeAll(() => {
        expect(ACCESS_TOKEN).toBeDefined()
    })

    it("should get login", async () => {
        const login = import.meta.env.TEST_GITHUB_LOGIN
        expect(login).toBeDefined()
        
        const result = await request({
            url: "https://api.github.com/graphql",
            document: whoAmIDocument,
            requestHeaders: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        })
        expect(result.viewer.login).toBe(login)
    })
})
