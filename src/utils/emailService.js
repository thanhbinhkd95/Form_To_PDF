// Stub email service: có thể thay bằng EmailJS (free tier) hoặc Firebase Functions/Extensions
// API: sendEmail({ to, subject, text, html, attachments: [{ filename, blob }] })

export async function sendEmail({ to, subject, text, html, attachments = [] }) {
  // Tạm thời chỉ log ra; triển khai thực tế sẽ dùng provider miễn phí
  console.log('sendEmail stub ->', { to, subject, text, html, attachments })
  // Giả lập độ trễ
  await new Promise((r) => setTimeout(r, 300))
  return { ok: true }
}


