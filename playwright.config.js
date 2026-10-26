import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/google-chrome") ? "/usr/bin/google-chrome" : undefined);
const baseURL = process.env.E2E_BASE_URL || "http://127.0.0.1:5178";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath,
      args: ["--no-sandbox"],
    },
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: process.env.E2E_BASE_URL
      ? "npm run preview -- --host 127.0.0.1 --port 5179 --strictPort"
      : "npm run dev -- --host 127.0.0.1 --port 5178 --strictPort",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
