import { usePdf } from '../hooks/usePdf.js'
import { useImage } from '../hooks/useImage.js'
import { useForm } from '../hooks/useForm.js'
import { useEmail } from '../hooks/useEmail.js'
import Preview from './Preview.jsx'

function PreviewModal({ isOpen, onClose, submittedData }) {
  const { formData } = useForm()
  const { imageUrl } = useImage()
  const { generatePdfFromFormData } = usePdf()
  const { sendEmail } = useEmail()

  if (!isOpen) return null

  // Use submitted data if available, otherwise use current form data
  const dataToPreview = submittedData || { ...formData, imageUrl, attachments: [] }
  const imageToPreview = submittedData?.imageUrl || imageUrl

  const handleDownloadPdf = async () => {
    try {
      await generatePdfFromFormData(dataToPreview, imageToPreview)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Có lỗi khi tạo PDF. Vui lòng thử lại.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmail = async () => {
    try {
      await sendEmail(dataToPreview, imageToPreview)
      alert('Email sent successfully!')
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email. Please try again.')
    }
  }

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-modal-header">
          <h2>Form Preview</h2>
          <button className="preview-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="preview-modal-content">
          <div className="preview-actions">
            <button className="btn btn-primary" onClick={handleDownloadPdf}>
              Download PDF
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              Print
            </button>
            <button className="btn btn-secondary" onClick={handleSendEmail}>
              Send Email
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
          
          <div className="preview-form-container">
            <Preview data={dataToPreview} imageUrl={imageToPreview} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal
