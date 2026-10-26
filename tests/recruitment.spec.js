import { test, expect } from "@playwright/test";
import {
  recruitmentArticle,
  recruitmentRoles,
} from "../src/data/recruitment.js";

test("Nội dung tuyển dụng, cấp heading và metadata đúng bản cung cấp", async ({
  page,
}) => {
  await page.goto("/tuyen-dung");
  await expect(page).toHaveTitle(
    "Tuyển luật sư và cộng tác viên | Công ty Luật Từ Liêm",
  );
  const article = page.locator(".recruitment-article");
  await expect(article.locator("h1")).toHaveText(recruitmentArticle.title);
  const menu = page.getByRole("navigation", { name: "Mục tuyển dụng" });
  await expect(menu.getByRole("button")).toHaveCount(4);
  await expect(article.locator(".role-card")).toHaveCount(0);
  await expect(page.locator("#applySection")).not.toBeVisible();
  for (const role of recruitmentRoles) {
    await menu.getByRole("button", { name: role.name, exact: true }).click();
    const card = page.locator(`#${role.id}`);
    await expect(card).toBeVisible();
    await expect(article.locator(".role-card")).toHaveCount(1);
    await expect(card.locator("h2")).not.toHaveText(/^\d+\./);
    for (const section of role.sections) {
      for (const text of [
        ...(section.items || []),
        ...(section.paragraphs || []),
      ]) {
        await expect(card).toContainText(text);
      }
    }
    for (const text of recruitmentArticle.requirements)
      await expect(card).toContainText(text);
    await expect(card).toContainText(recruitmentArticle.policy);
    await card
      .getByRole("button", { name: role.applyLabel, exact: true })
      .click();
    await expect(page.locator("#applySection")).toBeVisible();
    await expect(page.locator("#selectedRole")).toHaveValue(role.name);
  }
  await expect(article).not.toContainText(
    "Thông tin SEO dành cho đơn vị thiết kế",
  );
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );
  for (const width of [375, 430, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("CV phải là PDF và bản local không gửi hoặc mất dữ liệu ứng viên", async ({
  page,
}) => {
  const writes = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method())) writes.push(request.url());
  });
  await page.goto("/tuyen-dung");
  await page
    .getByRole("navigation", { name: "Mục tuyển dụng" })
    .getByRole("button", { name: "Cách gửi hồ sơ & biểu mẫu", exact: true })
    .click();
  const input = page.locator("#cvAttachment");
  for (const [name, content] of [
    ["cv.doc", "document"],
    ["cv.pdf", "not a PDF"],
  ]) {
    await input.setInputFiles({
      name,
      mimeType: "application/octet-stream",
      buffer: Buffer.from(content),
    });
    await expect(page.locator("#cv-error")).not.toBeEmpty();
  }
  await input.setInputFiles({
    name: "cv.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(25 * 1024 * 1024 + 1),
  });
  await expect(page.locator("#cv-error")).toContainText("25 MB");
  await page.locator("#selectedRole").selectOption("Luật sư cộng tác");
  await page.locator("#applicantName").fill("Nguyễn Văn Bình");
  await page.locator("#applicantPhone").fill("0912345678");
  await page.locator("#applicantEmail").fill("ungvien@example.com");
  await page.locator("#workArea").fill("Hà Nội");
  await page.locator("#bioText").fill("Có kinh nghiệm nghiên cứu hồ sơ.");
  await input.setInputFiles({
    name: "CV.PDF",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7\nCV"),
  });
  await expect(page.locator("#cv-error")).toBeEmpty();
  await page.locator("#recruitmentForm button").click();
  await expect(page.getByRole("status")).toContainText(
    "Hồ sơ chưa được gửi hoặc lưu",
  );
  await expect(page.locator("#applicantName")).toHaveValue("Nguyễn Văn Bình");
  await expect(page.locator("#cvFileList")).toContainText("CV.PDF");
  expect(writes).toEqual([]);
});

test("Đổi mục không làm mất dữ liệu và CV đã chọn; tài liệu vẫn tải được", async ({
  page,
}) => {
  await page.goto("/tuyen-dung");
  const menu = page.getByRole("navigation", { name: "Mục tuyển dụng" });
  await menu
    .getByRole("button", { name: "Cách gửi hồ sơ & biểu mẫu", exact: true })
    .click();
  await page.locator("#applicantName").fill("Nguyễn Văn Bình");
  await page.locator("#bioText").fill("Tôi muốn hợp tác theo vụ việc.");
  await page
    .locator("#cvAttachment")
    .setInputFiles({
      name: "ho-so.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.7\nCV"),
    });
  await expect(page.locator("#cv-error")).toBeEmpty();
  await menu
    .getByRole("button", { name: "Luật sư cộng tác", exact: true })
    .click();
  await expect(page.locator("#applySection")).not.toBeVisible();
  await expect(page.locator("#role-luat-su")).toBeVisible();
  await page.locator("#role-luat-su").getByRole("button").click();
  await expect(page.locator("#applicantName")).toHaveValue("Nguyễn Văn Bình");
  await expect(page.locator("#bioText")).toHaveValue(
    "Tôi muốn hợp tác theo vụ việc.",
  );
  await expect(page.locator("#cvFileList")).toContainText("ho-so.pdf");
  await expect(page.locator("#selectedRole")).toHaveValue("Luật sư cộng tác");
  const links = await page
    .locator(".recruitment-doc-actions a")
    .evaluateAll((items) => items.map((item) => item.href));
  expect(links.length).toBeGreaterThanOrEqual(3);
  for (const link of links) {
    const response = await page.request.get(link);
    expect(response.ok()).toBe(true);
  }
  await menu
    .getByRole("button", { name: "Luật sư cộng tác", exact: true })
    .click();
  await expect(page.locator(".role-card")).toHaveCount(0);
  await expect(page.locator("#applySection")).not.toBeVisible();
});

test("Liên kết trực tiếp mở đúng vị trí tuyển dụng", async ({ page }) => {
  await page.goto("/tuyen-dung#role-ctv-phap-ly");
  await expect(page.locator("#role-ctv-phap-ly")).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Mục tuyển dụng" })
      .getByRole("button", { name: "Cộng tác viên pháp lý", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/tuyen-dung#applySection");
  await expect(page.locator("#recruitmentForm")).toBeVisible();
});

test("Click lần 1 mở và cuộn xuống, click lần 2 thu lại", async ({ page }) => {
  await page.goto("/tuyen-dung");
  const menu = page.getByRole("navigation", { name: "Mục tuyển dụng" });
  const lawyerBtn = menu.getByRole("button", {
    name: "Luật sư cộng tác",
    exact: true,
  });

  // Click lần 1: Mở nội dung
  await lawyerBtn.click();
  await expect(page.locator("#role-luat-su")).toBeVisible();
  await expect(lawyerBtn).toHaveAttribute("aria-pressed", "true");

  // Click lần 2 vào chính nút đó: Thu lại
  await lawyerBtn.click();
  await expect(page.locator(".role-card")).toHaveCount(0);
  await expect(lawyerBtn).toHaveAttribute("aria-pressed", "false");
});
