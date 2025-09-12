import { useState, useEffect } from 'react'
import { useForm } from '../hooks/useForm.js'
import { usePdf } from '../hooks/usePdf.js'
import { sendEmail } from '../utils/emailService.js'
import { createAndDownloadPackage, showSaveDialog, downloadPackage } from '../utils/packageDownloader.js'
import Preview from './Preview.jsx'

export default function PreviewPage() {
  const { submittedData, resetToForm } = useForm()
  const { generatePdfFromFormData } = usePdf()
  
  // State cho progress indicator
  const [isCreatingPackage, setIsCreatingPackage] = useState(false)
  const [progress, setProgress] = useState({ message: '', percentage: 0 })
  const [showSuccess, setShowSuccess] = useState(false)
  const [successInfo, setSuccessInfo] = useState({ filename: '', size: 0 })
  
  // State cho email form
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    showEmailForm: false
  })
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  
  // State cho scroll behavior
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Nếu scroll xuống quá 100px thì ẩn header
      if (currentScrollY > 100) {
        // Chỉ ẩn khi scroll xuống, không ẩn khi scroll lên
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          setIsHeaderVisible(false)
        }
        // Hiện lại khi scroll lên
        else if (currentScrollY < lastScrollY) {
          setIsHeaderVisible(true)
        }
      } else {
        // Luôn hiện header khi ở gần đầu trang
        setIsHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  if (!submittedData) {
    return (
      <div className="preview-error">
        <div className="preview-error-container">
          <h2>No submitted data found</h2>
          <button onClick={resetToForm} className="btn btn-primary">
            Return to Form
          </button>
        </div>
      </div>
    )
  }

  const handleDownloadPdf = async () => {
    try {
      setIsCreatingPackage(true)
      setProgress({ message: 'Preparing...', percentage: 0 })
      
      console.log('Starting PDF download creation...')
      
      // 1. Hiển thị dialog chọn nơi lưu file
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      const defaultFilename = `Application_Form_${timestamp}.pdf`
      
      setProgress({ message: 'Preparing...', percentage: 0 })
      
      const selectedFilename = await showSaveDialog(defaultFilename)
      
      if (!selectedFilename) {
        return {
          success: false,
          message: 'User cancelled file save operation',
          cancelled: true
        }
      }
      
      // 2. Tạo PDF với progress updates
      console.log('Creating PDF...')
      setProgress({ message: 'Creating PDF...', percentage: 20 })
      
      const pdfBlob = await generatePdfFromFormData(submittedData, submittedData.imageUrl)
      
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Generated PDF is invalid')
      }
      
      // 3. Download PDF
      console.log('Downloading PDF...')
      setProgress({ message: 'Downloading...', percentage: 95 })
      
      downloadPackage(pdfBlob, selectedFilename)
      
      setProgress({ message: 'Completed!', percentage: 100 })
      
      setSuccessInfo({ filename: selectedFilename, size: pdfBlob.size })
      setShowSuccess(true)
      
      // Tự động đóng modal sau 3 giây
      setTimeout(() => {
        setShowSuccess(false)
        setIsCreatingPackage(false)
        setProgress({ message: '', percentage: 0 })
      }, 3000)
      
    } catch (error) {
      console.error('Error creating PDF:', error)
      alert(`❌ Error creating PDF.\n\nError details: ${error.message || 'Unknown error'}\n\nPlease try again.`)
    } finally {
      if (!showSuccess) {
        setIsCreatingPackage(false)
        setProgress({ message: '', percentage: 0 })
      }
    }
  }

  const handleDownloadPackage = async () => {
    try {
      setIsCreatingPackage(true)
      setProgress({ message: 'Preparing...', percentage: 0 })
      
      console.log('Starting package download creation...')
      const result = await createAndDownloadPackage(
        submittedData, 
        submittedData.imageUrl,
        (message, percentage) => {
          setProgress({ message, percentage })
        }
      )
      
      if (result.success) {
        setSuccessInfo({ filename: result.filename, size: result.size })
        setShowSuccess(true)
        // Auto close modal after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
          setIsCreatingPackage(false)
          setProgress({ message: '', percentage: 0 })
        }, 3000)
      } else if (result.cancelled) {
        // User cancelled, don't show notification
      } else {
        console.error('Package creation failed:', result.error)
        alert(`❌ ${result.message}\n\nError details: ${result.error?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating package:', error)
      alert(`❌ Error creating package.\n\nError details: ${error.message || 'Unknown error'}\n\nPlease try again.`)
    } finally {
      if (!showSuccess) {
        setIsCreatingPackage(false)
        setProgress({ message: '', percentage: 0 })
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmail = async () => {
    // Hiển thị form nhập email
    setEmailForm({ ...emailForm, showEmailForm: true })
  }

  const handleSendEmailConfirm = async () => {
    if (!emailForm.recipientEmail) {
      alert('Vui lòng nhập địa chỉ email người nhận / Please enter recipient email address')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailForm.recipientEmail)) {
      alert('Địa chỉ email không hợp lệ / Invalid email address')
      return
    }

    try {
      setIsSendingEmail(true)
      
      // Tạo PDF trước
      console.log('Creating PDF for email...')
      const pdfBlob = await generatePdfFromFormData(submittedData, submittedData.imageUrl)
      
      // Tạo download link cho PDF
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const fileName = `Application_Form_${new Date().toISOString().slice(0, 10)}.pdf`
      
      // Gửi email với PDF download link
      console.log('Sending email with PDF download link...')
      await sendEmail({
        to: emailForm.recipientEmail,
        subject: '申請書の送信完了 / Application Form Submission',
        text: `Xin chào ${emailForm.recipientEmail.split('@')[0]},\n\nĐây là bản PDF của form đăng ký của bạn.\n\nVui lòng truy cập ứng dụng để tải xuống PDF.\n\nThank you for your application.`,
        html: `
          <p>Xin chào <strong>${emailForm.recipientEmail.split('@')[0]}</strong>,</p>
          <p>Đây là bản PDF của form đăng ký của bạn.</p>
          <p><strong>Để tải xuống PDF:</strong></p>
          <ol>
            <li>Truy cập ứng dụng: <a href="${window.location.origin}">${window.location.origin}</a></li>
            <li>Điền lại form hoặc sử dụng chức năng "Download PDF"</li>
          </ol>
          <p>Thank you for your application.</p>
          <p>Best regards,<br>Application Form System</p>
        `,
        attachments: [{ 
          filename: fileName, 
          blob: pdfBlob 
        }]
      })
      
      // Cleanup URL object
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000)
      
      alert('✅ Email đã được gửi thành công! / Email sent successfully!')
      setEmailForm({ recipientEmail: '', showEmailForm: false })
    } catch (error) {
      console.error('Error sending email:', error)
      alert(`❌ Gửi email thất bại / Failed to send email: ${error.message}`)
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleCancelEmail = () => {
    setEmailForm({ recipientEmail: '', showEmailForm: false })
  }

  return (
    <div className="preview-page">
      <div className={`preview-page-header ${!isHeaderVisible ? 'header-hidden' : ''}`}>
        <div className="preview-page-header-content">
          <h1 className="preview-page-title">
            <span className="preview-title-jp">提出済み申請書の確認</span>
            <span className="preview-title-en">Review Submitted Application</span>
          </h1>
          
          <div className="preview-page-actions">
            <button 
              className="btn btn-primary" 
              onClick={resetToForm}
            >
              <span className="btn-text-jp">新しい申請書を作成 / Create New Application</span>
            </button>
            
            <button 
              className="btn btn-primary" 
              onClick={handleDownloadPackage}
              disabled={isCreatingPackage}
            >
              <span className="btn-text-jp">
                {isCreatingPackage ? '⏳ Creating Package...' : '📦 パッケージダウンロード / Download Package'}
              </span>
            </button>
            
            <button 
              className="btn btn-primary" 
              onClick={handleDownloadPdf}
              disabled={isCreatingPackage}
            >
              <span className="btn-text-jp">📄 PDFダウンロード / Download PDF Only</span>
            </button>
            
            <button 
              className="btn btn-primary" 
              onClick={handlePrint}
            >
              <span className="btn-text-jp">印刷 / Print</span>
            </button>
            
            <button 
              className="btn btn-primary" 
              onClick={handleSendEmail}
              disabled={isSendingEmail}
            >
              <span className="btn-text-jp">
                {isSendingEmail ? '⏳ 送信中... / Sending...' : '📧 メール送信 / Send Email'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="preview-page-content">
        {/* Progress indicator */}
        {(isCreatingPackage || showSuccess) && (
          <div className="progress-overlay">
            <div className="progress-container">
              {showSuccess ? (
                // Success state
                <>
                  <div className="progress-header">
                    <h3 style={{ color: '#059669' }}>✅ Success!</h3>
                  </div>
                  <div className="progress-success">
                    {successInfo.filename.endsWith('.zip') 
                      ? 'Package has been created and downloaded successfully!'
                      : 'PDF has been created and downloaded successfully!'
                    }
                  </div>
                  <div className="progress-details">
                    📁 File: {successInfo.filename}
                  </div>
                  <div className="progress-details">
                    📊 Size: {(successInfo.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <div className="progress-details" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                    This dialog will close automatically in 3 seconds...
                  </div>
                </>
              ) : (
                // Progress state
                <>
                  <div className="progress-header">
                    <h3>
                      {progress.message.includes('PDF') 
                        ? 'Creating PDF...' 
                        : 'Creating Package...'
                      }
                    </h3>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-message">
                    {progress.message}
                  </div>
                  <div className="progress-percentage">
                    {Math.round(progress.percentage)}%
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="preview-container">
          <Preview data={submittedData} imageUrl={submittedData.imageUrl} />
        </div>
      </div>

      <div className="preview-page-footer">
        <button className="btn btn-secondary" onClick={resetToForm}>
          <span className="btn-text-jp">申請書に戻る / Back to Form</span>
        </button>
      </div>

      {/* Email Form Modal */}
      {emailForm.showEmailForm && (
        <div className="email-modal-overlay">
          <div className="email-modal">
            <div className="email-modal-header">
              <h3>📧 メール送信 / Send Email</h3>
              <button 
                className="email-modal-close"
                onClick={handleCancelEmail}
              >
                ×
              </button>
            </div>
            
            <div className="email-modal-content">
              <div className="email-input-group">
                <label htmlFor="recipient-email">
                  <span className="label-jp">受信者メールアドレス / Recipient Email</span>
                </label>
                <input
                  id="recipient-email"
                  type="email"
                  placeholder="example@email.com"
                  value={emailForm.recipientEmail}
                  onChange={(e) => setEmailForm({...emailForm, recipientEmail: e.target.value})}
                  disabled={isSendingEmail}
                />
              </div>
              
              <div className="email-info">
                <p className="email-info-text">
                  <span className="info-jp">申請書のPDFファイルが自動的に添付されます。</span>
                  <span className="info-en">Application form PDF will be automatically attached.</span>
                </p>
              </div>
            </div>
            
            <div className="email-modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleCancelEmail}
                disabled={isSendingEmail}
              >
                <span className="btn-text-jp">キャンセル / Cancel</span>
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSendEmailConfirm}
                disabled={isSendingEmail || !emailForm.recipientEmail}
              >
                <span className="btn-text-jp">
                  {isSendingEmail ? '⏳ 送信中... / Sending...' : '📧 送信 / Send'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating action button để hiện lại header */}
      {!isHeaderVisible && (
        <button 
          className="floating-action-btn show"
          onClick={() => setIsHeaderVisible(true)}
          title="Show actions"
        >
          📋 Actions
        </button>
      )}

      <style>{`
        .progress-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .progress-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          min-width: 400px;
          text-align: center;
        }

        .progress-header h3 {
          margin: 0 0 1.5rem 0;
          color: #1e3a8a;
          font-size: 1.25rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1e3a8a, #3b82f6);
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .progress-message {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .progress-percentage {
          color: #1e3a8a;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .progress-success {
          color: #059669;
          font-weight: 600;
          font-size: 1.1rem;
          margin-top: 1rem;
        }

        .progress-details {
          color: #6b7280;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .preview-page-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          max-width: 900px;
          margin: 20px auto 0;
        }

        .preview-page-actions .btn {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Header hide/show animation */
        .preview-page-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
          transform: translateY(0);
          opacity: 1;
        }

        .preview-page-header.header-hidden {
          transform: translateY(-100%);
          opacity: 0;
        }

        /* Floating action button for mobile */
        .floating-action-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 200;
          background: linear-gradient(135deg, #1e3a8a, #1e40af);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
          transition: all 0.3s ease;
          display: none;
        }

        .floating-action-btn:hover {
          background: linear-gradient(135deg, #1e40af, #1d4ed8);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(30, 58, 138, 0.4);
        }

        @media (max-width: 768px) {
          .preview-page-actions {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            max-width: none;
            margin: 20px 0 0;
          }
          
          .preview-page-actions .btn {
            min-height: 44px;
          }

          /* Show floating button on mobile when header is hidden */
          .preview-page-header.header-hidden + * .floating-action-btn,
          .floating-action-btn.show {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .preview-page-actions {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        /* Email Modal Styles */
        .email-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .email-modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          min-width: 400px;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .email-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .email-modal-header h3 {
          margin: 0;
          color: #1e3a8a;
          font-size: 1.25rem;
        }

        .email-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
        }

        .email-modal-close:hover {
          color: #374151;
        }

        .email-modal-content {
          padding: 1.5rem;
        }

        .email-input-group {
          margin-bottom: 1rem;
        }

        .email-input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .label-jp {
          display: block;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .email-input-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .email-input-group input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .email-input-group input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }

        .email-info {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .email-info-text {
          margin: 0;
          font-size: 0.9rem;
          color: #0369a1;
        }

        .info-jp {
          display: block;
          margin-bottom: 0.25rem;
        }

        .info-en {
          display: block;
          font-style: italic;
        }

        .email-modal-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .email-modal-actions .btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .email-modal-actions .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .email-modal {
            min-width: 90vw;
            margin: 1rem;
          }
          
          .email-modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
