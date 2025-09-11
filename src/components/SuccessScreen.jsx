import { useForm } from '../hooks/useForm.js'

export default function SuccessScreen() {
  const { submittedData, resetToForm, navigateToPreview } = useForm()

  return (
    <div className="success-screen">
      <div className="success-container">
        <div className="success-icon">
          <div className="success-checkmark">✓</div>
        </div>
        
        <div className="success-message">
          <h1 className="success-title">
            <span className="success-title-jp">申請書の提出が完了しました</span>
            <span className="success-title-en">Application Form Submitted Successfully</span>
          </h1>
          
          <div className="success-description">
            <p className="success-description-jp">
              ご申請いただき、ありがとうございました。<br />
              申請書の内容を確認いただき、必要に応じてプリビューをご利用ください。
            </p>
            <p className="success-description-en">
              Thank you for your application.<br />
              You can review your submitted form and use the preview feature as needed.
            </p>
          </div>
        </div>

        <div className="success-actions">
          <button 
            className="btn btn-secondary"
            onClick={resetToForm}
          >
            <span className="btn-text-jp">新しい申請書を作成 / Create New Application</span>
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={navigateToPreview}
          >
            <span className="btn-text-jp">提出した申請書を確認 / Review Submitted Application</span>
          </button>
        </div>

        <div className="success-footer">
          <p className="success-footer-text">
            <span className="success-footer-jp">申請に関するご質問がございましたら、お気軽にお問い合わせください。</span>
            <span className="success-footer-en">If you have any questions about your application, please feel free to contact us.</span>
          </p>
        </div>
      </div>

    </div>
  )
}
