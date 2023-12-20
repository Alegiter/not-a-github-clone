import { describe, expect, it } from "vitest"
import { ROUTES, linkBuild } from "../config"

describe("Routes", () => {
    it("should build link to Login page", () => {
        const link = linkBuild(ROUTES.LOGIN)
        expect(link).toBe("/")
    })

    it("should build link to Repository page", () => {
        const link = linkBuild(ROUTES.REPOSITORY, "owner", "name")
        expect(link).toBe("/repository/owner/name")
        const linkWithPath = linkBuild(ROUTES.REPOSITORY, "owner", "name", "path")
        expect(linkWithPath).toBe("/repository/owner/name/path")
    })
})