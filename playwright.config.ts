import { defineConfig, devices } from "@playwright/test"

/**
 * End-to-end tests. Runs against the Next dev server started by Playwright
 * (webServer config) so the suite is self-contained in CI.
 *
 * The dev server reuses the same DATABASE_URL the job already provisioned
 * (postgres service + `bun run db:setup`), so E2E exercises the real
 * full stack — Prisma, server components, API routes, client state.
 */

const PORT = process.env.PORT ?? "3000"
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "es-ES",
    // framer-motion respects prefers-reduced-motion, so this disables the
    // card enter/exit animations that otherwise keep elements "unstable" and
    // make Playwright time out waiting to click.
    reducedMotion: "reduce",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "bun run dev",
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      // Inherit the current env (DATABASE_URL, AUTH_SECRET) but force PORT so
      // the dev server binds where Playwright expects it.
      PORT,
    },
  },
})
