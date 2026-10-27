import { test, expect } from "@playwright/test";

const routes = [
  ["/", "ĐỒNG HÀNH CÙNG"],
  ["/index.html", "ĐỒNG HÀNH CÙNG"],
  ["/gioi-thieu", "Về chúng tôi"],
  ["/an-le", "Án lệ Án hay"],
  ["/dien-dan", "Đăng nhập thành viên"],
  ["/tuyen-dung", "Tuyển luật sư và cộng tác viên"],
  ["/lien-he", "Liên hệ & đặt lịch tư vấn"],
];
let errors;

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});
test.afterEach(async () => {
  expect(errors, "Không có lỗi JavaScript hoặc tài nguyên").toEqual([]);
});

for (const [path, heading] of routes) {
  test(`Đi thẳng và tải lại ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toContainText(heading);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await page.reload();
    await expect(page.locator("h1")).toContainText(heading);
    await page.evaluate(() => document.fonts.ready);
    const rendered = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      fontLoaded: document.fonts.check(
        '700 24px "Liberation Sans Web"',
        "Tiếng Việt có dấu",
      ),
      imagesLoaded: [...document.images].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    }));
    expect(rendered.scroll).toBeLessThanOrEqual(rendered.width);
    expect(rendered.fontLoaded).toBe(true);
    expect(rendered.imagesLoaded).toBe(true);
  });
}

async function openMenu(page) {
  const menu = page.getByRole("button", { name: "Mở menu", exact: true });
  if (await menu.isVisible()) await menu.click();
}

test("Điều hướng React và nút quay lại không tải lại document", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.navigationMarker = "react-app";
  });
  await openMenu(page);
  await page
    .locator("header nav")
    .getByRole("link", { name: "Giới thiệu công ty", exact: true })
    .click();
  await expect(page).toHaveURL(/gioi-thieu$/);
  await expect(page.locator("h1")).toContainText("Về chúng tôi");
  expect(await page.evaluate(() => window.navigationMarker)).toBe("react-app");
  await page.goBack();
  await expect(page.locator("h1")).toContainText("ĐỒNG HÀNH CÙNG");
});

test("Menu mobile mở, đóng bằng Escape và đóng khi đổi trang", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("header nav")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .locator("header nav")
    .getByText("Liên hệ", { exact: true })
    .click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("header nav")).not.toBeVisible();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.locator("header nav")).toBeVisible();
});

test("Slider tự chạy và chọn đúng ảnh mới ở slide thứ ba", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Ảnh 1", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Ảnh 2", exact: true }),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 5000 });
  await page.getByRole("button", { name: "Ảnh 3", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ảnh 3", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator(".hero-slide").nth(2).locator("img"),
  ).toHaveAttribute("src", /toa-an-nhan-dan-toi-cao/);
  await expect(page.locator("#sliderCaption")).toHaveText(
    "Ảnh: Tòa án nhân dân tối cao",
  );
});

test("Hộp thoại hợp tác ở trang chủ mở và đóng được", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Gửi hồ sơ luật sư", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveText("Luật sư cộng tác");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole("button", {
      name: "Gửi hồ sơ cộng tác viên pháp lý",
      exact: true,
    })
    .click();
  await expect(dialog.getByRole("heading")).toHaveText("Cộng tác viên pháp lý");
  await dialog.getByRole("button", { name: "Đóng", exact: true }).click();
  await expect(dialog).not.toBeVisible();
});

test("Danh sách tin án lệ đơn giản và xem chi tiết", async ({ page }) => {
  await page.goto("/an-le");
  await expect(page.locator(".case-news-summary")).toHaveCount(3);
  await expect(page.locator(".case-news-list li")).toHaveCount(2);
  await expect(
    page.locator(".filter-tabs, .page-cases .sidebar, .search-input"),
  ).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Phân trang tin tức" }),
  ).toHaveCount(0);
  await page
    .locator(".case-news-summary")
    .nth(2)
    .getByRole("button", { name: "Đọc tiếp" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "Án lệ số 02/2021/AL",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.locator(".case-news-list li").first().getByRole("button").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Tư vấn vụ việc tương tự ↗", exact: true })
    .click();
  await expect(page).toHaveURL(/lien-he$/);
});

test("Chọn vị trí, đính kèm CV và gửi hồ sơ minh họa", async ({ page }) => {
  await page.goto("/tuyen-dung");
  await page
    .getByRole("navigation", { name: "Mục tuyển dụng" })
    .getByRole("button", { name: "Cộng tác viên pháp lý", exact: true })
    .click();
  await page.locator("#role-ctv-phap-ly").getByRole("button").click();
  await expect(page.locator("#selectedRole")).toHaveValue(
    "Cộng tác viên pháp lý",
  );
  await page.locator("#applicantName").fill("Nguyễn Văn Bình");
  await page.locator("#applicantPhone").fill("0916029966");
  await page.locator("#workArea").fill("Hà Nội");
  await page.locator("#applicantEmail").fill("ungvien@example.com");
  await page.locator("#bioText").fill("Có kinh nghiệm tổng hợp hồ sơ.");
  await page.locator("#cvAttachment").setInputFiles({
    name: "ho-so.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7\nHồ sơ minh họa"),
  });
  await expect(page.locator("#cvFileList")).toContainText("ho-so.pdf");
  await page.locator("#recruitmentForm button").click();
  await expect(page.getByRole("status")).toContainText(
    "Hồ sơ chưa được gửi hoặc lưu",
  );
  await expect(page.locator("#selectedRole")).toHaveValue(
    "Cộng tác viên pháp lý",
  );
  await expect(page.locator("#cvFileList")).toContainText("ho-so.pdf");
});

test("Biểu mẫu liên hệ: không yêu cầu phân loại, validation, tệp và nội dung không chèn HTML", async ({
  page,
}) => {
  await page.goto("/lien-he");
  const form = page.locator("#legalConsultationForm");
  expect(await form.evaluate((element) => element.checkValidity())).toBe(false);
  await page.locator("#clientName").fill("<img src=x onerror=alert(1)>");
  await page.locator("#clientPhone").fill("0916029966");
  await expect(page.locator("#legalField")).toHaveCount(0);
  await expect(page.locator('input[name="consultMethod"]')).toHaveCount(0);
  await page.locator("#issueContent").fill("Tôi cần trao đổi hồ sơ đất đai.");
  await page.locator("#docAttachment").setInputFiles({
    name: "tai-lieu.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("Tài liệu"),
  });
  await expect(page.locator("#fileList")).toContainText("tai-lieu.pdf");
  expect(await form.evaluate((element) => element.checkValidity())).toBe(true);
  await form.locator("button").click();
  await expect(page.getByRole("status")).toContainText(
    "yêu cầu chưa được gửi hoặc lưu",
  );
  await expect(page.getByRole("status").locator("img")).toHaveCount(0);
  await expect(page.locator("#fileList")).toBeEmpty();
});

test("Đăng nhập thành viên yêu cầu đủ thông tin và xác thực tài khoản", async ({
  page,
}) => {
  await page.goto("/index.html#thanh-vien");
  await expect(page).toHaveURL(/thanh-vien$/);
  await expect(page.getByLabel("Tên đăng nhập", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Xem mẫu/ })).toHaveCount(0);
  await expect(page.locator(".portal")).not.toContainText("Nguyễn Văn A");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.getByLabel("Tên đăng nhập", { exact: true })).toBeFocused();
  await page.getByLabel("Tên đăng nhập", { exact: true }).fill("demo");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeFocused();
  await expect(page).toHaveURL(/thanh-vien$/);
  await page.getByLabel("Mật khẩu", { exact: true }).fill("demo");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/thanh-vien$/);
  await expect(page.getByRole("alert")).toBeVisible();
});

test("Ứng tuyển dẫn sang tuyển dụng và khôi phục mật khẩu ở bản local", async ({
  page,
}) => {
  await page.goto("/thanh-vien");
  await expect(
    page.getByRole("link", { name: "Ứng tuyển thành viên", exact: true }),
  ).toHaveAttribute("href", "/tuyen-dung");
  const dialog = page.getByRole("dialog");
  await page
    .getByRole("button", { name: "Quên mật khẩu?", exact: true })
    .click();
  const account = dialog.getByLabel("Email hoặc số điện thoại đã đăng ký");
  await account.fill("không hợp lệ");
  await dialog
    .getByRole("button", { name: "Yêu cầu khôi phục mật khẩu" })
    .click();
  await expect(account).toBeFocused();
  await expect(dialog.getByRole("status")).toHaveCount(0);
  await account.fill("binh@example.com");
  await account.press("Enter");
  await expect(dialog.getByRole("status")).toContainText(
    "Chưa gửi yêu cầu khôi phục mật khẩu",
  );
  await dialog.getByRole("button", { name: "Đóng", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Quên mật khẩu?", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Quên mật khẩu?", exact: true })
    .click();
  await expect(account).toHaveValue("");
  await account.fill("0912345678");
  await dialog
    .getByRole("button", { name: "Yêu cầu khôi phục mật khẩu" })
    .click();
  await expect(dialog.getByRole("status")).toContainText(
    "Chưa gửi yêu cầu khôi phục mật khẩu",
  );
});

test("Bố cục đủ 5 trang tại 375, 430, 768 và 1024px", async ({ page }) => {
  for (const width of [375, 430, 768, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [path, heading] of routes.filter(
      ([path]) => path !== "/index.html",
    )) {
      await page.goto(path);
      await expect(page.locator("h1")).toContainText(heading);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
        `${path} tại ${width}px`,
      ).toBe(true);
      if (path === "/an-le")
        await expect(page.locator("main .sidebar")).toHaveCount(0);
      else if (path !== "/")
        await expect(page.locator("main .sidebar")).toBeVisible();
    }
  }
});

test("Biểu mẫu trang chủ giữ validation và thông báo minh họa", async ({
  page,
}) => {
  await page.goto("/#lien-he");
  const section = page.locator("#lien-he");
  await section.getByLabel("Họ và tên", { exact: false }).fill("Nguyễn Văn An");
  await section
    .getByLabel("Số điện thoại", { exact: false })
    .fill("0916029966");
  await section
    .getByLabel("Nội dung yêu cầu", { exact: false })
    .fill("Trao đổi hồ sơ minh họa.");
  await section
    .getByRole("button", { name: "Gửi yêu cầu ↗", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Thông tin chưa được gửi hoặc lưu",
  );
});

const legacyRedirects = [
  ["/index.html", "/"],
  ["/gioi-thieu.html", "/gioi-thieu"],
  ["/tuyen-dung.html", "/tuyen-dung"],
  ["/an-le.html", "/an-le"],
  ["/lien-he.html", "/lien-he"],
  ["/thanh-vien.html", "/thanh-vien"],
];
for (const [legacy, canonical] of legacyRedirects) {
  test(`Liên kết cũ ${legacy} giữ query và hash khi chuyển URL`, async ({
    page,
  }) => {
    await page.goto(legacy + "?nguon=kiem-tra#noi-dung");
    await expect(page).toHaveURL(
      new RegExp(
        canonical.replaceAll("/", "\\/") + "\\?nguon=kiem-tra#noi-dung$",
      ),
    );
    await page.reload();
    await expect(page).toHaveURL(
      new RegExp(
        canonical.replaceAll("/", "\\/") + "\\?nguon=kiem-tra#noi-dung$",
      ),
    );
    expect(
      await page
        .locator("header nav a")
        .evaluateAll((links) =>
          links.every((link) => !link.getAttribute("href").includes(".html")),
        ),
    ).toBe(true);
  });
}

test("URL thành viên dạng hash cũ chuyển thẳng sang URL gọn", async ({
  page,
}) => {
  await page.goto("/index.html?nguon=cu#thanh-vien");
  await expect(page).toHaveURL(/\/thanh-vien\?nguon=cu$/);
  await expect(page.locator(".loginbox")).toBeVisible();
});

test("Menu Thành viên dẫn tới trang đăng nhập thành viên", async ({
  page,
}) => {
  await page.goto("/");
  await openMenu(page);
  await page
    .locator("header nav")
    .getByRole("link", { name: "Thành viên", exact: true })
    .click();
  await expect(page).toHaveURL(/thanh-vien$/);
  await expect(page.getByLabel("Tên đăng nhập", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeVisible();
  await page.getByLabel("Tên đăng nhập", { exact: true }).fill("demo");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("sai-mat-khau");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/thanh-vien$/);
  await expect(page.getByRole("alert")).toBeVisible();
});
