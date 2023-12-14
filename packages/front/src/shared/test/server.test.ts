import { afterEach, describe, expect, it, vi } from "vitest"
import { testInsideViteServer } from "./fixture"
import { store } from "../model"
import { loginWithGithub } from "../api"

function noop() { }

describe("Server", () => {
    afterEach(() => {
        vi.unstubAllEnvs()
    })

    it("should throw error if auth env vars are not provided", () => {
        vi.stubEnv("CLIENT_ID", "")
        vi.stubEnv("CLIENT_SECRET", "")
        vi.stubEnv("CLIENT_REDIRECT_URI", "")
        vi.stubEnv("ACCESS_TOKEN", "")
        try {
            testInsideViteServer(noop)
        } catch (error) {
            expect(error).toBe("Provide env variables either for Github App auth or personal access token")
        }
    })

    it("should throw error if not all github app env vars are not provided", () => {
        vi.stubEnv("CLIENT_ID", "some_id")
        vi.stubEnv("ACCESS_TOKEN", "")
        try {
            testInsideViteServer(noop)
        } catch (error) {
            expect(error).toBe("Env variables 'CLIENT_ID', 'CLIENT_SECRET' and/or 'CLIENT_REDIRECT_URI' for Guthib App auth are not provided")
        }
    })

    testInsideViteServer(() => {
        it("should consider logged in if personal access token provided", () => {
            vi.stubEnv("ACCESS_TOKEN", "some_token")
            expect(store.isLoggedIn).toBeTruthy()
        })

        it("should return 500 if no access token was returned by github", () => {
            expect(async () => await loginWithGithub("test_code"))
                .rejects
                .toThrowError("No access token loaded")
        })
    })
})