export const MAX_CV_SIZE = 25 * 1024 * 1024;

export async function validateRecruitmentCv(file) {
  if (!file) return "Vui lòng đính kèm CV định dạng PDF.";
  if (!file.name.toLocaleLowerCase("vi").endsWith(".pdf"))
    return "CV phải là file PDF. Vui lòng chọn lại.";
  if (file.size > MAX_CV_SIZE)
    return "CV vượt quá 25 MB. Vui lòng chọn file nhỏ hơn.";
  try {
    const header = await file.slice(0, 5).text();
    if (header !== "%PDF-")
      return "File đã chọn không có định dạng PDF phù hợp. Vui lòng chọn lại.";
  } catch {
    return "Không đọc được CV. Vui lòng chọn lại file.";
  }
  return "";
}
