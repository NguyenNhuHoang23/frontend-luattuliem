import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1366, 1920, 2560]) {
  test(`Bố cục dùng chung không tràn ngang ở ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1080 });
    for (const route of [
      "/",
      "/gioi-thieu",
      "/an-le",
      "/tuyen-dung",
      "/lien-he",
    ]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      const layout = await page.evaluate(() => {
        const rect = (el) => {
          const r = el.getBoundingClientRect();
          return { x: r.x, width: r.width };
        };
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          header: rect(document.querySelector("header .brandrow")),
          content: rect(document.querySelector("main .wrap")),
        };
      });
      expect(layout.overflow, route).toBe(false);
      if (route !== "/" || width > 900) {
        expect(
          Math.abs(layout.header.x - layout.content.x),
          route,
        ).toBeLessThan(2);
      }
      if (width >= 1920 && route !== "/") {
        expect(layout.content.width, route).toBeGreaterThan(1400);
        expect(layout.content.width, route).toBeLessThanOrEqual(1601);
      }
      if (
        (width === 2560 &&
          ["/", "/gioi-thieu", "/tuyen-dung"].includes(route)) ||
        (width === 375 && route === "/")
      ) {
        await page.screenshot({
          path: `test-results/responsive-${width}-${route === "/" ? "home" : route.slice(1)}.png`,
        });
      }
    }
  });
}
