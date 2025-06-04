# Hướng dẫn Upload Code lên GitHub

## Cách 1: Upload trực tiếp trên GitHub.com (Đơn giản nhất)

1. Vào repository của bạn: https://github.com/Tynhh/AiDebtorRisk
2. Click "Add file" → "Upload files"
3. Kéo thả hoặc chọn tất cả các file sau:

### File cần upload:
- `README.md`
- `package.json`
- `package-lock.json` (không bắt buộc)
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `components.json`
- `drizzle.config.ts`
- `postcss.config.js`
- `.gitignore`

### Thư mục cần upload:
- `client/` (toàn bộ thư mục)
- `server/` (toàn bộ thư mục)
- `shared/` (toàn bộ thư mục)

4. Viết commit message: "Initial commit: AI Debtor Risk Assessment System"
5. Click "Commit changes"

## Cách 2: Sử dụng Git command line

```bash
# Clone repository về máy
git clone https://github.com/Tynhh/AiDebtorRisk.git
cd AiDebtorRisk

# Copy tất cả file project vào thư mục này
# Sau đó chạy:
git add .
git commit -m "AI Debtor Risk Assessment System - Complete Implementation"
git push origin main
```

## Cách 3: GitHub Desktop

1. Tải GitHub Desktop
2. Clone repository
3. Copy tất cả file vào thư mục local
4. Commit và push

## Lưu ý quan trọng:
- KHÔNG upload thư mục `node_modules/`
- KHÔNG upload file `.env`
- File `.gitignore` đã được tạo để loại trừ các file không cần thiết# AiDebtorRisk
