import { test, expect } from "@playwright/test";

const choose = async (page, name) => {
  if (!(await page.locator(".member-list").isVisible())) {
    await page
      .getByRole("button", { name: "← Danh sách", exact: true })
      .click();
  }
  await page
    .locator(".member-thread-choice")
    .filter({ hasText: name })
    .first()
    .click();
};
const directorSession = {
  token: "playwright-member",
  id: 99,
  name: "Giám đốc",
  username: "giamdoc",
  role: "director",
};
const loginAs = async (page, session) => {
  await page.evaluate((next) => {
    localStorage.setItem("luattuliem-member-session", JSON.stringify(next));
  }, session);
  await page.goto("/dien-dan");
};
const tab = async (page, name) =>
  page
    .getByRole("navigation", { name: "Công việc cá nhân" })
    .getByRole("button", { name, exact: true })
    .click();
const compose = (page) =>
  page.getByRole("textbox", { name: "Nội dung trao đổi", exact: true });
const send = async (page, text) => {
  await compose(page).fill(text);
  await page.getByRole("button", { name: "Gửi", exact: true }).click();
};

const memberSession = {
  token: "playwright-member",
  id: 1,
  name: "Nguyễn Văn A",
  username: "demo",
  role: "ctv",
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript((session) => {
    localStorage.setItem("luattuliem-member-session", JSON.stringify(session));
  }, memberSession);
  await page.goto("/dien-dan");
});
test.afterEach(async ({ page }) => {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("Thành viên chỉ thấy tin nhắn, vụ việc và thu nhập của mình", async ({
  page,
}) => {
  await expect(page.locator(".member-thread-choice")).toHaveCount(1);
  await choose(page, "Giám đốc");
  await expect(page.locator(".member-message-list")).toContainText(
    "Em lưu ý nộp hồ sơ",
  );
  await tab(page, "Vụ việc");
  await expect(page.locator(".member-thread-choice")).toHaveCount(1);
  await expect(page.locator(".member-thread-list")).not.toContainText(
    "Vụ ông B",
  );
  await choose(page, "Vụ bà A");
  await expect(page.locator(".member-message-list")).toContainText(
    "phiếu tiếp nhận",
  );
  await expect(
    page.getByRole("button", { name: "Thành viên", exact: true }),
  ).toHaveCount(0);
  await tab(page, "Thu nhập");
  await choose(page, "Các khoản thanh toán");
  await expect(page.locator(".member-message-list")).toContainText(
    "10.000.000đ",
  );
  await send(page, "Em chưa nhận được, anh kiểm tra lại giúp em.");
  await expect(page.locator(".member-message-list")).toContainText(
    "Em chưa nhận được",
  );
});

test("Tin nhắn, file và bản nháp được giữ riêng theo vai và cuộc trao đổi", async ({
  page,
}) => {
  await choose(page, "Giám đốc");
  await compose(page).fill("Bản nháp riêng");
  await page.getByLabel("Chọn file đính kèm").setInputFiles({
    name: "ho-so.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Tài liệu thử"),
  });
  await tab(page, "Vụ việc");
  await choose(page, "Vụ bà A");
  await expect(compose(page)).toHaveValue("");
  await tab(page, "Tin nhắn");
  await choose(page, "Giám đốc");
  await expect(compose(page)).toHaveValue("Bản nháp riêng");
  await expect(page.getByRole("list", { name: "File chờ gửi" })).toContainText(
    "ho-so.txt",
  );
  await page.getByRole("button", { name: "Gửi", exact: true }).click();
  await expect(page.locator(".member-message-list")).toContainText(
    "Bản nháp riêng",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Tải xuống", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("ho-so.txt");
  await page.reload();
  await choose(page, "Giám đốc");
  await expect(page.locator(".member-message-list")).not.toContainText(
    "Bản nháp riêng",
  );
});

test("Giám đốc gửi riêng cho nhiều người, không đưa vào hội thoại người khác", async ({
  page,
}) => {
  await loginAs(page, directorSession);
  await page.getByRole("button", { name: "+ Gửi nhanh", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("checkbox", { name: "Nguyễn Văn A", exact: true })
    .check();
  await dialog
    .getByRole("checkbox", { name: "Đỗ Thu Trang", exact: true })
    .check();
  await dialog
    .getByLabel("Nội dung tin nhắn")
    .fill("Nộp bản tổng hợp trước chiều mai.");
  await dialog
    .getByRole("button", { name: "Gửi tin nhắn", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await choose(page, "Nguyễn Văn A");
  await expect(page.locator(".member-message-list")).toContainText(
    "Nộp bản tổng hợp",
  );
  await choose(page, "Đỗ Thu Trang");
  await expect(page.locator(".member-message-list")).toContainText(
    "Nộp bản tổng hợp",
  );
  await choose(page, "Luật sư A");
  await expect(page.locator(".member-message-list")).not.toContainText(
    "Nộp bản tổng hợp",
  );
});

test("Giám đốc tạo vụ việc và đổi thành viên theo nhóm", async ({ page }) => {
  await loginAs(page, directorSession);
  await tab(page, "Vụ việc");
  await page
    .getByRole("button", { name: "+ Tạo vụ việc", exact: true })
    .click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên vụ việc").fill("Vụ kiểm tra mới");
  await dialog
    .getByRole("checkbox", { name: "Luật sư A", exact: true })
    .check();
  await dialog
    .getByRole("checkbox", { name: "Nguyễn Văn A", exact: true })
    .check();
  await dialog
    .getByRole("button", { name: "Tạo vụ việc", exact: true })
    .click();
  await expect(page.locator(".member-thread-heading h2")).toHaveText(
    "Vụ kiểm tra mới",
  );
  await send(page, "Đã phân công hồ sơ.");
  await choose(page, "Vụ kiểm tra mới");
  await page.getByRole("button", { name: "Thành viên", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByRole("checkbox", { name: "Nguyễn Văn A", exact: true })
    .uncheck();
  await dialog
    .getByRole("checkbox", { name: "Đỗ Thu Trang", exact: true })
    .check();
  await dialog
    .getByRole("button", { name: "Lưu thành viên", exact: true })
    .click();
  await expect(page.locator(".member-thread-heading h2")).toHaveText(
    "Vụ kiểm tra mới",
  );
});

test("Thu nhập riêng không lẫn giữa các thành viên", async ({ page }) => {
  await loginAs(page, directorSession);
  await tab(page, "Thu nhập");
  await choose(page, "Nguyễn Văn A");
  await send(page, "Đã tạm ứng 2.000.000đ cho công việc tháng này.");
  await choose(page, "Luật sư B");
  await expect(page.locator(".member-message-list")).not.toContainText(
    "2.000.000đ",
  );
});

test("Tìm kiếm, tệp quá giới hạn và điều hướng về danh sách", async ({
  page,
  isMobile,
}) => {
  await choose(page, "Giám đốc");
  await page
    .getByRole("button", { name: "Tìm kiếm tin nhắn", exact: true })
    .click();
  const search = page.getByLabel("Tìm trong cuộc trao đổi");
  await search.fill("nop ho so");
  await expect(page.locator(".member-message")).toHaveCount(1);
  await search.fill("không có kết quả");
  await expect(page.locator(".member-empty")).toContainText("Không tìm thấy");
  await search.press("Escape");
  await expect(page.locator(".member-message")).toHaveCount(2);
  await page.getByLabel("Chọn file đính kèm").setInputFiles(
    Array.from({ length: 6 }, (_, index) => ({
      name: `file-${index}.txt`,
      mimeType: "text/plain",
      buffer: Buffer.from("x"),
    })),
  );
  await expect(page.getByRole("status")).toContainText("tối đa 5 file");
  await expect(page.locator(".member-pending-files")).toHaveCount(0);
  if (isMobile) {
    await page
      .getByRole("button", { name: "← Danh sách", exact: true })
      .click();
    await expect(page.locator(".member-list")).toBeVisible();
    await expect(page.locator(".member-conversation")).not.toBeVisible();
  }
});

test("Báo lỗi trong hộp thoại khi chưa chọn người phụ trách", async ({
  page,
}) => {
  await loginAs(page, directorSession);
  await tab(page, "Vụ việc");
  await page
    .getByRole("button", { name: "+ Tạo vụ việc", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên vụ việc").fill("Hồ sơ chưa phân công");
  await dialog
    .getByRole("button", { name: "Tạo vụ việc", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Vui lòng chọn ít nhất một người.",
  );
  await dialog
    .getByRole("checkbox", { name: "Nguyễn Văn A", exact: true })
    .check();
  await dialog
    .getByRole("button", { name: "Tạo vụ việc", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Vui lòng chọn ít nhất một luật sư phụ trách.",
  );
  await dialog.getByRole("button", { name: "Đóng", exact: true }).click();
  await expect(dialog).not.toBeVisible();
});

test("Quản lý thành viên: phong cách Master-Detail 2 cột đồng bộ workspace", async ({
  page,
}) => {
  const memberNav = page.getByRole("navigation", { name: "Công việc cá nhân" });
  await expect(
    memberNav.getByRole("button", { name: "Quản lý thành viên", exact: true }),
  ).toHaveCount(0);

  await loginAs(page, directorSession);
  const manageTabBtn = memberNav.getByRole("button", {
    name: "Quản lý thành viên",
    exact: true,
  });
  await expect(manageTabBtn).toBeVisible();

  // 3. Nhấp vào tab Quản lý thành viên
  await manageTabBtn.click();
  await expect(
    page.getByRole("heading", { name: "Đang hoạt động" }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: /Đang hoạt động/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: /Không hoạt động/ }),
  ).toBeVisible();

  // Bố cục: Danh bạ bên trái
  await expect(page.locator(".member-directory-sidebar")).toBeVisible();
  await expect(page.locator(".directory-item")).toHaveCount(6);

  const isMobile = await page.evaluate(() => window.innerWidth <= 820);
  if (!isMobile) {
    await expect(page.locator(".member-dossier-panel")).toBeVisible();
  }

  // 4. Tìm kiếm thành viên bên cột trái
  const searchInput = page.getByRole("searchbox", {
    name: "Tìm kiếm thành viên",
  });
  await searchInput.fill("Đỗ Thu Trang");
  await expect(page.locator(".directory-item")).toHaveCount(1);
  await page.locator(".directory-item").click();
  await expect(page.locator(".member-dossier-panel")).toBeVisible();
  await expect(page.locator(".member-dossier-panel")).toContainText("Đỗ Thu Trang");

  if (isMobile) {
    await page.getByRole("button", { name: "← Danh sách thành viên", exact: true }).click();
  }
  await searchInput.fill("");
  await expect(page.locator(".directory-item")).toHaveCount(6);
  await page.locator(".directory-item").first().click();

  await page.getByRole("button", { name: "Sửa hồ sơ", exact: true }).click();
  await expect(page.locator(".dossier-inline-edit-box")).toBeVisible();
  const areaInput = page.locator("#editArea");
  await areaInput.fill("Đà Nẵng");
  await page.getByRole("button", { name: "Lưu thay đổi hồ sơ", exact: true }).click();
  await expect(page.locator(".dossier-meta-grid")).toContainText("Đà Nẵng");

  await loginAs(page, memberSession);
  await expect(
    page
      .getByRole("navigation", { name: "Công việc cá nhân" })
      .getByRole("button", { name: "Quản lý thành viên", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".member-workspace")).toBeVisible();
});

test("Giám đốc lọc thành viên đang hoạt động và không hoạt động", async ({
  page,
}) => {
  await loginAs(page, directorSession);
  const memberNav = page.getByRole("navigation", { name: "Công việc cá nhân" });
  const manageTabBtn = memberNav.getByRole("button", {
    name: "Quản lý thành viên",
    exact: true,
  });
  await expect(manageTabBtn).toBeVisible();
  await manageTabBtn.click();

  await expect(page.getByRole("tab", { name: /Đang hoạt động/ })).toBeVisible();
  await expect(page.locator(".directory-item")).toHaveCount(6);

  const inactiveSubtab = page.getByRole("tab", { name: /Không hoạt động/ });
  await inactiveSubtab.click();
  await expect(page.getByRole("heading", { name: "Không hoạt động" })).toBeVisible();
  await expect(page.locator(".directory-item")).toHaveCount(0);

  await page.getByRole("tab", { name: /Đang hoạt động/ }).click();
  await page.locator(".directory-item").first().click();
  const pausedName = await page.locator(".member-dossier-panel h2").innerText();
  await page.getByRole("button", { name: "Tạm dừng", exact: true }).click();

  await expect(page.locator(".directory-item")).toHaveCount(5);
  await page.getByRole("tab", { name: /Không hoạt động/ }).click();
  await expect(page.locator(".directory-item")).toHaveCount(1);
  await expect(page.locator(".member-directory-sidebar")).toContainText(pausedName);
});


