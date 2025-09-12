import emailjs from '@emailjs/browser'
import { uploadPdfToStorage } from './firebaseStorage.js'

// Cấu hình EmailJS với thông tin của bạn
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_xt3712r',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_kn6moqh', 
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '519ktkUCZCirkhD7f'
}

// Khởi tạo EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey)


export async function sendEmail({ to, subject, text, html, attachments = [] }) {
  try {
    console.log('Sending email with EmailJS...', { to, subject, attachments: attachments.length })
    
    // Template parameters cho EmailJS
    const templateParams = {
      to_email: to,
      user_name: to.split('@')[0], // Tên người dùng từ email
      subject: subject,
      message: text || html,
      from_name: 'Application Form System'
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

      // Upload PDF to Firebase Storage
      console.log('Uploading PDF to Firebase Storage...')
      const downloadURL = await uploadPdfToStorage(pdfBlob, filename)
      
      // Thêm PDF info vào template params
      templateParams.pdf_filename = filename
      templateParams.pdf_size_kb = Math.round(pdfBlob.size / 1024)
      templateParams.pdf_download_url = downloadURL
      templateParams.has_attachment = 'Yes'
      
      // Tạo HTML download link
      templateParams.pdf_download_link = `
        <div style="background-color: #f0f9ff; padding: 20px; border: 2px solid #0ea5e9; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0; color: #0369a1;">📄 Your Application Form PDF</h3>
          <p style="margin-bottom: 15px;"><strong>File:</strong> ${filename}</p>
          <p style="margin-bottom: 15px;"><strong>Size:</strong> ${Math.round(pdfBlob.size / 1024)} KB</p>
          <a href="${downloadURL}" target="_blank" 
             style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            📥 Download PDF
          </a>
          <p style="margin-top: 15px; font-size: 12px; color: #666;">
            Click the button above to download your application form PDF from Firebase Storage
          </p>
        </div>
      `
    } else {
      templateParams.has_attachment = 'No'
      templateParams.pdf_download_link = ''
    }

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


