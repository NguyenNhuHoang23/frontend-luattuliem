// Tên hiện hành theo Quyết định 19/2025/QĐ-TTg; giữ tên cũ để đọc hồ sơ đã lưu.
const provinceNames = [
  ["An Giang", "Kiên Giang"],
  ["Bắc Ninh", "Bắc Giang"],
  ["Cà Mau", "Bạc Liêu"],
  ["Cần Thơ", "Hậu Giang", "Sóc Trăng"],
  ["Cao Bằng"],
  ["Đà Nẵng", "Quảng Nam"],
  ["Đắk Lắk", "Phú Yên"],
  ["Điện Biên"],
  ["Đồng Nai", "Bình Phước"],
  ["Đồng Tháp", "Tiền Giang"],
  ["Gia Lai", "Bình Định"],
  ["Hà Nội"],
  ["Hà Tĩnh"],
  ["Hải Phòng", "Hải Dương"],
  ["Huế", "Thừa Thiên Huế", "Thừa Thiên - Huế"],
  ["Hưng Yên", "Thái Bình"],
  ["Khánh Hòa", "Ninh Thuận"],
  ["Lai Châu"],
  ["Lâm Đồng", "Bình Thuận", "Đắk Nông"],
  ["Lạng Sơn"],
  ["Lào Cai", "Yên Bái"],
  ["Nghệ An"],
  ["Ninh Bình", "Hà Nam", "Nam Định"],
  ["Phú Thọ", "Vĩnh Phúc", "Hòa Bình"],
  ["Quảng Ngãi", "Kon Tum"],
  ["Quảng Ninh"],
  ["Quảng Trị", "Quảng Bình"],
  ["Sơn La"],
  ["Tây Ninh", "Long An"],
  ["Thái Nguyên", "Bắc Kạn"],
  ["Thanh Hóa"],
  [
    "TP. Hồ Chí Minh",
    "Hồ Chí Minh",
    "TPHCM",
    "TP HCM",
    "HCM",
    "Bình Dương",
    "Bà Rịa - Vũng Tàu",
  ],
  ["Tuyên Quang", "Hà Giang"],
  ["Vĩnh Long", "Bến Tre", "Trà Vinh"],
];

function normalizeArea(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/^(?:tinh|thanh pho|tp)[.\s]+/u, "")
    .replace(/\s+/gu, " ")
    .trim();
}

const provinceByName = new Map(
  provinceNames.flatMap(([province, ...aliases]) =>
    [province, ...aliases].map((name) => [normalizeArea(name), province]),
  ),
);

export const workProvinces = provinceNames.map(([province]) => province);

export function registeredProvinces(area) {
  const values = Array.isArray(area) ? area : [area];
  return new Set(
    values.flatMap((value) =>
      typeof value === "string"
        ? value
            .split(/[,;/|\n]+/u)
            .map((part) => provinceByName.get(normalizeArea(part.trim())))
            .filter(Boolean)
        : [],
    ),
  );
}
