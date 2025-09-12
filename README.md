# Form To PDF System

Ứng dụng React tạo form đơn giản, chuyển đổi PDF và gửi email. Hỗ trợ tiếng Nhật/Anh.

## 🚀 Quick Start

```bash
# 1. Cài đặt
npm install

# 2. Cấu hình
cp env.example .env
# Chỉnh sửa .env với các environment variables:
# - 3 keys cho EmailJS (service, template, public key) - BẮT BUỘC
# - 1 key cho Google reCAPTCHA v3 - BẮT BUỘC
# - 6 keys cho Firebase (optional, nếu dùng Firebase Storage)

# 3. Chạy
npm run dev
```

**Port**: `http://localhost:5175/`

## 📁 Cấu Trúc Dự Án (Controller-Service-Component Pattern)

```
src/
├── controllers/           # Business Logic Controllers
│   ├── FormController.js  # Form validation & submission logic
│   ├── PdfController.js   # PDF generation logic
│   ├── EmailController.js # Email sending logic
│   └── index.js          # Export all controllers
├── services/             # Data & External Services
│   ├── FormService.js    # Form data persistence
│   ├── PdfService.js     # PDF file operations
│   ├── EmailService.js   # Email service integration
│   └── index.js          # Export all services
├── components/           # UI Components (organized)
│   ├── forms/            # Form-related components
│   │   └── FormInput.jsx
│   ├── preview/          # Preview-related components
│   │   ├── PreviewPage.jsx
│   │   └── Preview.jsx
│   ├── shared/           # Shared/reusable components
│   │   ├── SuccessScreen.jsx
│   │   ├── SharedDialog.jsx
│   │   └── FormComponents.jsx
│   └── index.js          # Export all components
├── hooks/                # Custom hooks (delegated to controllers)
├── utils/                # Legacy utilities (being phased out)
├── constants/            # App constants
└── context/              # React context
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
# EmailJS Configuration (3 keys) - BẮT BUỘC
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Google reCAPTCHA v3 (1 key) - BẮT BUỘC
VITE_RECAPTCHA_V3_SITE_KEY=your_recaptcha_site_key

# Firebase Configuration (6 keys) - OPTIONAL
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

**Tổng cộng: 4 environment variables BẮT BUỘC + 6 Firebase keys OPTIONAL**

### EmailJS Template

```html
Dear {{user_name}}, PDF Download: {{pdf_download_url}} Filename:
{{pdf_filename}} ({{pdf_size_kb}} KB) Best regards, Form System
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

## 🎯 **Refactor: Controller-Service-Component Pattern**

### **Lợi Ích Đạt Được**

- ✅ **Maintainability**: Logic tách riêng khỏi UI, dễ debug và fix bugs
- ✅ **Testability**: Controllers có thể test độc lập, services có thể mock dễ dàng
- ✅ **Reusability**: Controllers có thể reuse cho nhiều components
- ✅ **Team Collaboration**: Backend dev sửa controllers/services, Frontend dev sửa components

### **Metrics Cải Thiện**

| Aspect               | Before      | After      | Improvement  |
| -------------------- | ----------- | ---------- | ------------ |
| **FormInput.jsx**    | 715 dòng    | ~200 dòng  | -72%         |
| **PreviewPage.jsx**  | 830 dòng    | ~400 dòng  | -52%         |
| **Validation Logic** | Trong hook  | Controller | ✅ Separated |
| **PDF Logic**        | Trong utils | Controller | ✅ Separated |
| **Email Logic**      | Trong hook  | Controller | ✅ Separated |

### **Cách Sử Dụng Mới**

#### **Import Controllers**

```javascript
import { formController, pdfController, emailController } from "../controllers";
```

#### **Import Services**

```javascript
import { formService, pdfService, emailService } from "../services";
```

#### **Import Components**

```javascript
import { FormInput, PreviewPage, SuccessScreen } from "../components";
```

### **Breaking Changes**

#### **Import Paths**

- ✅ `./components/FormInput.jsx` → `./components/forms/FormInput.jsx`
- ✅ `./components/PreviewPage.jsx` → `./components/preview/PreviewPage.jsx`
- ✅ `./components/SuccessScreen.jsx` → `./components/shared/SuccessScreen.jsx`

#### **Hook Changes**

- ✅ `useForm.validate()` now uses `formController.validateForm()`
- ✅ `usePdf.generate()` now uses `pdfController.generateFromPreview()`
- ✅ `useEmail.send()` now uses `emailController.sendEmailWithPdf()`

## 📝 Tính năng chính

- ✅ Form đa ngôn ngữ (Nhật/Anh)
- ✅ Tạo PDF từ form data
- ✅ Gửi email với link PDF
- ✅ Upload file lên Firebase
- ✅ Responsive design
- ✅ Form validation
- ✅ **Controller-Service-Component Architecture**

---

**Built with React + Vite + Firebase + EmailJS** | **Refactored with Clean Architecture** 🚀
