# Form To PDF System

Ứng dụng React tạo form đơn giản, chuyển đổi PDF và gửi email. Hỗ trợ tiếng Nhật/Anh.

## 🚀 Quick Start

```bash
# 1. Cài đặt
npm install

# 2. Cấu hình
cp env.example .env
# Chỉnh sửa .env với thông tin EmailJS và Firebase

# 3. Chạy
npm run dev
```

**Port**: `http://localhost:5175/`

## 📁 Cấu trúc dự án

```
src/
├── components/     # UI components
├── hooks/         # Custom hooks  
├── utils/         # Utilities (PDF, Email, Firebase)
├── constants/     # App constants
└── context/       # React context
```

## ⚙️ Scripts

```bash
npm run dev        # Development
npm run build      # Production build
npm run lint       # Check code
npm run format     # Format code
```

## 🔧 Cấu hình cần thiết

### Environment Variables (.env)
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### EmailJS Template
```html
Dear {{user_name}},

PDF Download: {{pdf_download_url}}
Filename: {{pdf_filename}} ({{pdf_size_kb}} KB)

Best regards,
Form System
```

### Firebase Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /application-forms/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### CORS Configuration
```bash
# Cài đặt Google Cloud CLI
gcloud auth login
gcloud config set project form-to-pdf-52d69

# Set CORS cho Firebase Storage
gsutil cors set cors.json gs://form-to-pdf-52d69.appspot.com
```

## 🚀 Deploy

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🐛 Troubleshooting

- **PDF không tạo được**: Check console, verify form data
- **Email không gửi được**: Check EmailJS config, Firebase permissions
- **File upload lỗi**: Check Firebase Storage rules, CORS config, file size (max 10MB)
- **CORS error**: Chạy `gsutil cors set cors.json gs://form-to-pdf-52d69.appspot.com`

## 📝 Tính năng chính

- ✅ Form đa ngôn ngữ (Nhật/Anh)
- ✅ Tạo PDF từ form data
- ✅ Gửi email với link PDF
- ✅ Upload file lên Firebase
- ✅ Responsive design
- ✅ Form validation

---
**Built with React + Vite + Firebase + EmailJS**