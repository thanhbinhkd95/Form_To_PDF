import { useState } from 'react'
import { useForm } from '../hooks/useForm.js'
import { usePdf } from '../hooks/usePdf.js'
import { useEmail } from '../hooks/useEmail.js'
import { createAndDownloadPackage, showSaveDialog, downloadPackage } from '../utils/packageDownloader.js'
import Preview from './Preview.jsx'

export default function PreviewPage() {
  const { submittedData, resetToForm } = useForm()
  const { generatePdfFromFormData } = usePdf()
  const { sendEmail } = useEmail()
  
  // State cho progress indicator
  const [isCreatingPackage, setIsCreatingPackage] = useState(false)
  const [progress, setProgress] = useState({ message: '', percentage: 0 })
  const [showSuccess, setShowSuccess] = useState(false)
  const [successInfo, setSuccessInfo] = useState({ filename: '', size: 0 })

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
    try {
      await sendEmail(submittedData, submittedData.imageUrl)
      alert('Email sent successfully!')
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email. Please try again.')
    }
  }

  return (
    <div className="preview-page">
      <div className="preview-page-header">
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
            >
              <span className="btn-text-jp">メール送信 / Send Email</span>
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
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .preview-page-actions .btn {
          flex: 1;
          min-width: 200px;
          max-width: 250px;
        }

        @media (max-width: 768px) {
          .preview-page-actions {
            flex-direction: column;
          }
          
          .preview-page-actions .btn {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>
    </div>
  )
}
