// Số thứ tự tăng khi thêm bài; độc lập với năm án lệ và ngày sửa nội dung.
export function sortByPublicationOrder(entries, direction = "newest") {
  const factor = direction === "oldest" ? 1 : -1;
  return [...entries].sort(
    (a, b) => factor * ((a.publicationOrder ?? 0) - (b.publicationOrder ?? 0)),
  );
}
