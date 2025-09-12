import "./App.css";
import FormInput from "./components/forms/FormInput.jsx";
import TestPanel from "./components/TestPanel.jsx";
import SuccessScreen from "./components/shared/SuccessScreen.jsx";
import PreviewPage from "./components/preview/PreviewPage.jsx";
import { FormProvider } from "./context/FormContext.jsx";
import { useForm } from "./hooks/useForm.js";

function Shell() {
  const { formData, currentPage } = useForm();

  // Route based on current page
  if (currentPage === "success") {
    return <SuccessScreen />;
  }

  if (currentPage === "preview") {
    return <PreviewPage />;
  }

  return (
    <div className="app-bg-white">
      {/* Header */}
      <div className="app-header">
        <div className="app-logo">
          入学願書システム / Application Form System
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">入学願書</span>
              <span className="hero-title-accent">Application Form</span>
            </h1>

            <div className="hero-features">
              <div className="hero-feature-card">
                <div className="hero-feature-icon">📝</div>
                <div className="hero-feature-text">
                  <strong>デジタル記入</strong>
                  <span>Digital Form</span>
                </div>
              </div>
              <div className="hero-feature-card">
                <div className="hero-feature-icon">📄</div>
                <div className="hero-feature-text">
                  <strong>PDF出力</strong>
                  <span>PDF Export</span>
                </div>
              </div>
              <div className="hero-feature-card">
                <div className="hero-feature-icon">📧</div>
                <div className="hero-feature-text">
                  <strong>メール送信</strong>
                  <span>Email Send</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="form-section">
            <div className="form-header-info">
              <h2>申請書の記入 / Form Completion</h2>
              <p>
                以下のフォームに必要事項を記入してください。すべての項目を正確に入力することが重要です。
              </p>
              <p>
                Please fill out the form below with the required information. It
                is important to accurately input all items.
              </p>
            </div>

            <div className="panel">
              <div className="panel-content">
                <FormInput initialValues={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2024 Application Form System. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Test Panel */}
      <TestPanel />
    </div>
  );
}

function App() {
  return (
    <FormProvider>
      <Shell />
    </FormProvider>
  );
}

export default App;
