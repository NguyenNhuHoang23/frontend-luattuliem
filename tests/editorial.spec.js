import { test, expect } from "@playwright/test";
import { sortByPublicationOrder } from "../src/utils/publicationOrder.js";
import { cases } from "../src/data/cases.js";
import { aboutArticles } from "../src/data/about.js";

test("Thứ tự đăng độc lập với năm án lệ, giữ dữ liệu gốc và thứ tự bài cùng mức", () => {
  const entries = [
    {
      id: "old",
      title: "Án lệ năm 2025",
      publicationOrder: 1,
      updatedAt: "2030-01-01",
    },
    {
      id: "new",
      title: "Án lệ năm 2016",
      publicationOrder: 3,
      updatedAt: "2026-01-01",
    },
    { id: "middle", title: "Án lệ năm 2020", publicationOrder: 2 },
  ];
  expect(sortByPublicationOrder(entries).map((item) => item.id)).toEqual([
    "new",
    "middle",
    "old",
  ]);
  expect(
    sortByPublicationOrder(entries, "oldest").map((item) => item.id),
  ).toEqual(["old", "middle", "new"]);
  expect(entries.map((item) => item.id)).toEqual(["old", "new", "middle"]);
  expect(
    sortByPublicationOrder([
      { id: 1, publicationOrder: 2 },
      { id: 2, publicationOrder: 2 },
    ]).map((item) => item.id),
  ).toEqual([1, 2]);
});

test("Án lệ không hiện thời gian đăng và giữ bố cục ba trích yếu", async ({
  page,
}) => {
  await page.goto("/an-le");
  await expect(page.locator(".case-news-title")).toHaveText(
    sortByPublicationOrder(cases).map((item) => item.title),
  );
  await expect(page.locator(".case-news-date, time")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("Cập nhật:");
  await expect(page.locator(".case-news-summary")).toHaveCount(3);
  await expect(page.locator(".case-news-list li")).toHaveCount(
    cases.length - 3,
  );
  await expect(page.locator(".case-news-summary").first()).toContainText(
    "Một email khiến nữ kế toán",
  );
  await page.locator(".case-news-more").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).not.toContainText("Cập nhật:");
  await expect(page.getByRole("dialog")).toContainText("Tác giả: Nguyễn Lê");
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "Đọc toàn văn trên VietNamNet" }),
  ).toHaveAttribute("href", cases[0].source.url);
});

test("Giới thiệu giữ nguyên bài hiện có và đổi tiêu đề Tin tức", async ({
  page,
}) => {
  await page.goto("/gioi-thieu");
  await expect(page.locator(".about-post")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    sortByPublicationOrder(aboutArticles, "oldest")[0].title,
  );
  await expect(page.locator(".about-post")).toContainText(
    "Công ty Luật TNHH MTV Từ Liêm",
  );
  await expect(page.locator(".article-body > h2")).toHaveText([
    "Để mỗi người đóng góp đúng sở trường",
    "Thêm cơ hội từ kiến thức, kinh nghiệm và sự tin cậy",
    "Cùng góp sức hoàn thiện cách làm",
  ]);
  await expect(page.locator(".about-post")).toContainText(
    "Luật sư Vũ Văn Dũng, số thẻ 8035",
  );
  await expect(page.locator(".about-post")).toContainText("ngày 23/7/2026");
  await expect(
    page.getByRole("link", {
      name: "Tìm hiểu cơ hội hợp tác cùng Luật Từ Liêm →",
      exact: true,
    }),
  ).toHaveAttribute("href", "/tuyen-dung");
  await expect(page).toHaveTitle(
    "Giới thiệu Luật Từ Liêm | Kết nối luật sư và cộng tác viên",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Tìm hiểu mô hình Luật Từ Liêm: kết nối luật sư và cộng tác viên địa phương, phát huy kinh nghiệm, mở cơ hội hợp tác và đồng hành cùng khách hàng.",
  );
  await expect(page.locator(".sidebar-title")).toHaveText("TIN TỨC");
  await expect(page.locator("main")).not.toContainText("MỚI NHẤT");
});

test("Tuyển dụng mở nội dung theo mục quan tâm", async ({ page }) => {
  await page.goto("/tuyen-dung");
  const menu = page.getByRole("navigation", { name: "Mục tuyển dụng" });
  await expect(menu.getByRole("button")).toHaveCount(4);
  await expect(page.locator(".role-card")).toHaveCount(0);
  await expect(page.locator("#applySection")).not.toBeVisible();
  await menu
    .getByRole("button", { name: "Luật sư cộng tác", exact: true })
    .click();
  await expect(page.locator(".role-card")).toHaveCount(1);
  await expect(page.locator("#recruitment-requirements h3")).toHaveText(
    "Điều kiện chung & nguyên tắc hợp tác",
  );
  for (const width of [375, 430, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

for (const route of [
  "/gioi-thieu",
  "/an-le",
  "/tuyen-dung",
  "/lien-he",
  "/thanh-vien",
  "/dien-dan",
]) {
  test(`Không khôi phục cụm đầu trang đã bỏ tại ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(
      page.locator(
        "main .breadcrumb, main .post-meta, main .page-subtitle, main .forum-desc",
      ),
    ).toHaveCount(0);
    await expect(
      page.locator("main .page-title, main .article-title, main .portalbar"),
    ).toHaveCount(0);
    const heading = page.locator("main h1");
    if (route === "/gioi-thieu" || route === "/tuyen-dung") {
      // H1 là tên bài trong bản nội dung được người dùng cung cấp, không phải khối metadata.
      await expect(heading).toHaveClass(
        route === "/gioi-thieu"
          ? "article-content-heading"
          : "recruitment-content-heading",
      );
      await expect(heading).toBeVisible();
      await expect(heading).toHaveCount(1);
    } else {
      await expect(heading).toHaveClass(/page-heading-sr-only/);
      const box = await heading.boundingBox();
      expect(box.width).toBeLessThanOrEqual(1);
      expect(box.height).toBeLessThanOrEqual(1);
    }
    const mainText = await page.locator("main").innerText();
    expect(mainText.trim().length).toBeGreaterThan(50);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
