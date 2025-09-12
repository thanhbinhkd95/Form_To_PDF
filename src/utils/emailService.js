import emailjs from '@emailjs/browser'
import { uploadPdfToStorage } from './firebaseStorage.js'

// Cấu hình EmailJS chỉ từ biến môi trường (không dùng giá trị mặc định)
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
}

// Validate cấu hình bắt buộc
if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
  const missing = [
    !EMAILJS_CONFIG.serviceId ? 'VITE_EMAILJS_SERVICE_ID' : null,
    !EMAILJS_CONFIG.templateId ? 'VITE_EMAILJS_TEMPLATE_ID' : null,
    !EMAILJS_CONFIG.publicKey ? 'VITE_EMAILJS_PUBLIC_KEY' : null,
  ].filter(Boolean).join(', ')
  throw new Error(`Missing EmailJS environment variables: ${missing}`)
}

// Khởi tạo EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey)



export async function sendEmail({ to, subject, text, html, attachments = [] }) {
  try {
    console.log('Sending email with EmailJS...', { to, subject, attachmentsCount: attachments.length })
    
    // Template parameters cho EmailJS - đơn giản hóa để tránh lỗi variables
    const templateParams = {
      to_email: to,
      to_name: to.split('@')[0],
      user_name: to.split('@')[0], // Thêm user_name cho template
      subject: subject,
      message: text || html,
      from_name: 'Application Form System',
      pdf_download_url: '' // Sẽ được set khi có PDF
    }

    // Xử lý PDF attachment nếu có
    if (attachments.length > 0) {
      console.log('Processing PDF attachment...')
      const pdfBlob = attachments[0].blob
      const filename = attachments[0].filename || 'application_form.pdf'
      
      console.log('PDF blob info:', { 
        filename: filename, 
        size: pdfBlob.size, 
        type: pdfBlob.type 
      })

      // Upload PDF to Firebase Storage (bắt buộc thành công để gửi email)
      console.log('Uploading PDF to Firebase Storage...')
      const downloadURL = await uploadPdfToStorage(pdfBlob, filename)
      
      // Thêm PDF download URL vào template parameters
      templateParams.pdf_download_url = downloadURL
      templateParams.pdf_filename = filename
      templateParams.pdf_size_kb = Math.round(pdfBlob.size / 1024)
    }

    // Debug: Log template parameters
    console.log('EmailJS Template Parameters:', templateParams)
    console.log('EmailJS Config:', {
      serviceId: EMAILJS_CONFIG.serviceId,
      templateId: EMAILJS_CONFIG.templateId,
      publicKey: EMAILJS_CONFIG.publicKey?.substring(0, 10) + '...'
    })
    
    // Gửi email qua EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    )

    console.log('Email sent successfully:', response)
    return { 
      ok: true, 
      messageId: response.text,
      status: response.status
    }
    
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error(`Failed to send email: ${error.text || error.message}`)
  }
}


