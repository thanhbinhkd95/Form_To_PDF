import { useState } from 'react'
import { useForm } from '../hooks/useForm.js'
import { useImage } from '../hooks/useImage.js'
import { usePdf } from '../hooks/usePdf.js'

// Import test scripts
import { runWebMockTest } from '../../tests/web-mock-tests/test-script.js'
import { runAllFeatureTests } from '../../tests/features-mock-tests/features-test-script.js'
import { createMockFormData, createMockImageFile, logTestResults } from '../../tests/shared/test-utils.js'

// Component để test form với dữ liệu mẫu
export default function TestPanel() {
  const { formData, updateForm } = useForm()
  const { setImage, imageUrl } = useImage()
  const { generatePdfFromFormData, generating } = usePdf()
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false)
  const [testStatus, setTestStatus] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  // Hàm để chạy Web Mock Test
  const runWebMockTestHandler = async () => {
    setIsRunning(true)
    setTestStatus('🌐 Đang chạy Web Mock Test... / Running Web Mock Test...')
    
    try {
      await runWebMockTest(updateForm, setImage)
      setTestStatus('✅ Web Mock Test hoàn thành! / Web Mock Test completed!')
      
      setTimeout(() => {
        setIsTestPanelOpen(false)
        setTestStatus('')
        setIsRunning(false)
      }, 3000)
      
    } catch (error) {
      setTestStatus('❌ Lỗi Web Mock Test: ' + error.message)
      setIsRunning(false)
    }
  }

  // Hàm để chạy Features Mock Test
  const runFeaturesMockTestHandler = async () => {
    setIsRunning(true)
    setTestStatus('🔧 Đang chạy Features Mock Test... / Running Features Mock Test...')
    
    try {
      const results = await runAllFeatureTests()
      setTestStatus('✅ Features Mock Test hoàn thành! / Features Mock Test completed!')
      
      // Log results
      Object.keys(results).forEach(testName => {
        logTestResults(testName, results[testName])
      })
      
      setTimeout(() => {
        setIsTestPanelOpen(false)
        setTestStatus('')
        setIsRunning(false)
      }, 3000)
      
    } catch (error) {
      setTestStatus('❌ Lỗi Features Mock Test: ' + error.message)
      setIsRunning(false)
    }
  }

  // Hàm để điền dữ liệu mock đơn giản
  const fillMockData = async () => {
    setIsRunning(true)
    setTestStatus('📝 Đang điền dữ liệu mock... / Filling mock data...')
    
    try {
      // Tạo dữ liệu mock
      const mockData = createMockFormData()
      
      // Tạo ảnh mock
      const mockImage = await createMockImageFile('mock_photo.jpg')
      
      // Cập nhật form
      updateForm(mockData)
      setImage(mockImage)
      
      setTestStatus('✅ Đã điền dữ liệu mock! / Mock data filled!')
      
      setTimeout(() => {
        setIsTestPanelOpen(false)
        setTestStatus('')
        setIsRunning(false)
      }, 2000)
      
    } catch (error) {
      setTestStatus('❌ Lỗi điền dữ liệu: ' + error.message)
      setIsRunning(false)
    }
  }

  // Hàm để xóa dữ liệu test
  const clearTestData = () => {
    updateForm({})
    setImage(null)
    setTestStatus('✅ Đã xóa dữ liệu test / Test data cleared')
    
    setTimeout(() => {
      setTestStatus('')
    }, 2000)
  }

  // Hàm để test validation
  const testValidation = () => {
    setTestStatus('✅ Đang test validation... / Testing validation...')
    
    try {
      // Test validation với dữ liệu hiện tại
      const validation = validateFormData(formData)
      
      if (validation.isValid) {
        setTestStatus('✅ Validation passed! / Validation passed!')
      } else {
        setTestStatus(`❌ Validation failed: ${validation.errors.join(', ')}`)
      }
      
      setTimeout(() => {
        setTestStatus('')
      }, 3000)
      
    } catch (error) {
      setTestStatus('❌ Lỗi validation: ' + error.message)
    }
  }

  // Hàm để test PDF generation
  const testPdfGeneration = async () => {
    setIsRunning(true)
    setTestStatus('📄 Đang test PDF generation... / Testing PDF generation...')
    
    try {
      // Tạo dữ liệu test đầy đủ
      const testData = {
        ...formData,
        lastNameRomaji: formData.lastNameRomaji || 'Tanaka',
        firstNameRomaji: formData.firstNameRomaji || 'Yuki',
        lastNameKanji: formData.lastNameKanji || '田中',
        firstNameKanji: formData.firstNameKanji || '由紀',
        nationality: formData.nationality || 'Vietnamese',
        gender: formData.gender || 'Female',
        dob: formData.dob || '1995-03-15',
        email: formData.email || 'test@example.com',
        phone: formData.phone || '+84-90-123-4567',
        passportNumber: formData.passportNumber || 'N1234567',
        permanentAddress: formData.permanentAddress || '123 Main Street, Ho Chi Minh City',
        currentAddress: formData.currentAddress || '456 University Road, Tokyo',
        course: formData.course || 'Japanese Language Course',
        occupation: formData.occupation || 'Student',
        coeHistory: formData.coeHistory || { yesNo: 'No', count: '0', deniedCount: '0' },
        visits: formData.visits || { yesNo: 'Yes', count: '1', recent: '2023-12-15' },
        education: formData.education || [
          { schoolName: 'University of Technology', startYm: '2013-09', endYm: '2017-06', yearsAttended: '4', location: 'Ho Chi Minh City' }
        ],
        employmentYesNo: formData.employmentYesNo || 'No',
        employment: formData.employment || [],
        hasStudiedAtLanguageSchool: formData.hasStudiedAtLanguageSchool || 'Yes',
        jpLearningHours: formData.jpLearningHours || '400',
        jpSchools: formData.jpSchools || [
          { schoolName: 'Tokyo Language School', startYm: '2023-04', endYm: '2024-03' }
        ],
        proficiency: formData.proficiency || [
          { testName: 'JLPT', year: '2023', level: 'N4', score: '100', result: 'Pass' }
        ],
        sponsor: formData.sponsor || {
          fullName: 'Tanaka Taro',
          relationship: 'Father',
          currentAddress: '123 Main Street, Ho Chi Minh City',
          email: 'taro@example.com',
          phone: '+84-90-987-6543',
          company: 'ABC Company',
          position: 'Manager',
          workAddress: '789 Business District',
          workPhone: '+84-28-123-4567',
          annualIncomeJpy: '6000000',
          exchangeRate: '150'
        },
        family: formData.family || [
          { relation: 'Father', name: 'Tanaka Taro', dob: '1970-05-20', nationality: 'Vietnamese', occupation: 'Manager', address: '123 Main Street' }
        ],
        familyInJapanYesNo: formData.familyInJapanYesNo || 'No',
        familyInJapan: formData.familyInJapan || [],
        motivation: formData.motivation || 'I want to study Japanese language and culture.',
        schoolType: formData.schoolType || 'University',
        schoolName: formData.schoolName || 'Tokyo University',
        major: formData.major || 'Japanese Language',
        desiredJob: formData.desiredJob || 'Translator',
        returnHomeYyyyMm: formData.returnHomeYyyyMm || '2026-03',
        notes: formData.notes || 'I am interested in Japanese culture.',
        reasonsForApplying: formData.reasonsForApplying || 'I want to improve my Japanese skills.'
      }
      
      await generatePdfFromFormData(testData, imageUrl)
      setTestStatus('✅ PDF generation test completed! / PDF generation test completed!')
      
      setTimeout(() => {
        setIsTestPanelOpen(false)
        setTestStatus('')
        setIsRunning(false)
      }, 3000)
      
    } catch (error) {
      setTestStatus('❌ Lỗi PDF generation: ' + error.message)
      setIsRunning(false)
    }
  }

  if (!isTestPanelOpen) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsTestPanelOpen(true)}
          style={{
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1e40af'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1e3a8a'}
        >
          🧪 Test Panel
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '380px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '20px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e3a8a'
        }}>
          🧪 Test Panel
        </h3>
        <button
          onClick={() => setIsTestPanelOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          Chọn loại test để kiểm tra ứng dụng
        </p>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          Choose test type to check application
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Web Mock Tests */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          backgroundColor: '#f8fafc'
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e3a8a'
          }}>
            🌐 Web Mock Tests
          </h4>
          
          <button
            onClick={runWebMockTestHandler}
            disabled={isRunning}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              opacity: isRunning ? 0.6 : 1,
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            {isRunning ? '⏳ Running...' : '🚀 Run Web Mock Test'}
          </button>
        </div>

        {/* Features Mock Tests */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          backgroundColor: '#f8fafc'
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e3a8a'
          }}>
            🔧 Features Mock Tests
          </h4>
          
          <button
            onClick={runFeaturesMockTestHandler}
            disabled={isRunning}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              opacity: isRunning ? 0.6 : 1,
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            {isRunning ? '⏳ Running...' : '🔧 Run Features Test'}
          </button>
        </div>

        {/* PDF Test */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          backgroundColor: '#f8fafc'
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e3a8a'
          }}>
            📄 PDF Generation Test
          </h4>
          
          <button
            onClick={testPdfGeneration}
            disabled={isRunning || generating}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: (isRunning || generating) ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              opacity: (isRunning || generating) ? 0.6 : 1,
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            {(isRunning || generating) ? '⏳ Generating...' : '🚀 Test PDF Generation'}
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          backgroundColor: '#f8fafc'
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e3a8a'
          }}>
            ⚡ Quick Actions
          </h4>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={fillMockData}
              disabled={isRunning}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                opacity: isRunning ? 0.6 : 1,
                transition: 'all 0.2s ease',
                flex: 1
              }}
            >
              📝 Fill Mock
            </button>
            
            <button
              onClick={testValidation}
              disabled={isRunning}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                opacity: isRunning ? 0.6 : 1,
                transition: 'all 0.2s ease',
                flex: 1
              }}
            >
              ✅ Validate
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <button
          onClick={clearTestData}
          disabled={isRunning}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            opacity: isRunning ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          🗑️ Clear All Data
        </button>
      </div>

      {testStatus && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#374151',
          textAlign: 'center'
        }}>
          {testStatus}
        </div>
      )}

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fef3c7',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#92400e'
      }}>
        <strong>Lưu ý / Note:</strong><br />
        • Web Mock: Test giao diện và UI<br />
        • Features Mock: Test tính năng chính<br />
        • PDF Test: Test tạo PDF A4<br />
        • Fill Mock: Điền dữ liệu nhanh<br />
        • Validate: Kiểm tra validation
      </div>
    </div>
  )
}

// Helper function để validate form data
const validateFormData = (formData) => {
  const errors = []
  
  const requiredFields = [
    'lastNameRomaji', 'firstNameRomaji', 'nationality', 'gender',
    'dob', 'email', 'phone', 'passportNumber'
  ]
  
  requiredFields.forEach(field => {
    if (!formData[field]) {
      errors.push(`Missing: ${field}`)
    }
  })
  
  if (formData.email && !formData.email.includes('@')) {
    errors.push('Invalid email')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}