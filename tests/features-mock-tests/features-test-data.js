// Test data cho Features Mock Test
// Test data for Features Mock Test

export const featuresTestData = {
  // Test data cho tính năng PDF Generation
  pdfGenerationTest: {
    title: 'PDF Generation Test / PDF生成テスト',
    testCases: [
      {
        name: 'Basic PDF Generation',
        description: 'Test tạo PDF cơ bản với dữ liệu đầy đủ',
        data: {
          formType: 'application_form',
          includePhoto: true,
          includeAttachments: true,
          language: 'both' // japanese, english, both
        }
      },
      {
        name: 'PDF with Japanese Only',
        description: 'Test tạo PDF chỉ với tiếng Nhật',
        data: {
          formType: 'application_form',
          includePhoto: true,
          includeAttachments: false,
          language: 'japanese'
        }
      },
      {
        name: 'PDF with English Only',
        description: 'Test tạo PDF chỉ với tiếng Anh',
        data: {
          formType: 'application_form',
          includePhoto: false,
          includeAttachments: true,
          language: 'english'
        }
      }
    ]
  },

  // Test data cho tính năng Email Service
  emailServiceTest: {
    title: 'Email Service Test / メールサービステスト',
    testCases: [
      {
        name: 'Send Application Email',
        description: 'Test gửi email đơn đăng ký',
        data: {
          recipient: 'test@example.com',
          subject: 'Application Form Submission',
          template: 'application_submission',
          attachments: ['form.pdf', 'passport.pdf']
        }
      },
      {
        name: 'Send Confirmation Email',
        description: 'Test gửi email xác nhận',
        data: {
          recipient: 'applicant@example.com',
          subject: 'Application Received',
          template: 'confirmation',
          attachments: []
        }
      }
    ]
  },

  // Test data cho tính năng Form Validation
  formValidationTest: {
    title: 'Form Validation Test / フォームバリデーションテスト',
    testCases: [
      {
        name: 'Required Fields Validation',
        description: 'Test validation các trường bắt buộc',
        data: {
          testFields: [
            'lastNameRomaji', 'firstNameRomaji', 'nationality', 
            'gender', 'dob', 'email', 'phone', 'passportNumber'
          ],
          expectedResult: 'all_required'
        }
      },
      {
        name: 'Email Format Validation',
        description: 'Test validation format email',
        data: {
          testEmails: [
            'valid@example.com',
            'invalid-email',
            'test@domain.co.jp',
            'invalid@'
          ],
          expectedResults: [true, false, true, false]
        }
      },
      {
        name: 'Date Validation',
        description: 'Test validation ngày tháng',
        data: {
          testDates: [
            '1995-03-15',
            '2025-12-31',
            'invalid-date',
            '2000-13-01'
          ],
          expectedResults: [true, true, false, false]
        }
      }
    ]
  },

  // Test data cho tính năng Image Upload
  imageUploadTest: {
    title: 'Image Upload Test / 画像アップロードテスト',
    testCases: [
      {
        name: 'Valid Image Upload',
        description: 'Test upload ảnh hợp lệ',
        data: {
          fileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          maxSize: 5 * 1024 * 1024, // 5MB
          dimensions: { width: 300, height: 400 }
        }
      },
      {
        name: 'Invalid File Type',
        description: 'Test upload file không hợp lệ',
        data: {
          fileTypes: ['text/plain', 'application/pdf', 'video/mp4'],
          expectedResult: 'rejected'
        }
      },
      {
        name: 'Oversized File',
        description: 'Test upload file quá lớn',
        data: {
          fileSize: 10 * 1024 * 1024, // 10MB
          maxSize: 5 * 1024 * 1024, // 5MB
          expectedResult: 'rejected'
        }
      }
    ]
  },

  // Test data cho tính năng File Attachments
  fileAttachmentTest: {
    title: 'File Attachment Test / ファイル添付テスト',
    testCases: [
      {
        name: 'PDF Upload',
        description: 'Test upload file PDF',
        data: {
          fileType: 'application/pdf',
          maxSize: 10 * 1024 * 1024, // 10MB
          allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
        }
      },
      {
        name: 'Multiple Files Upload',
        description: 'Test upload nhiều file cùng lúc',
        data: {
          maxFiles: 5,
          totalMaxSize: 50 * 1024 * 1024, // 50MB
          fileTypes: ['application/pdf', 'image/jpeg', 'image/png']
        }
      }
    ]
  },

  // Test data cho tính năng Preview
  previewTest: {
    title: 'Preview Test / プレビューテスト',
    testCases: [
      {
        name: 'Form Preview',
        description: 'Test preview form trước khi submit',
        data: {
          showModal: true,
          includePhoto: true,
          includeAttachments: true,
          language: 'both'
        }
      },
      {
        name: 'PDF Preview',
        description: 'Test preview PDF trước khi download',
        data: {
          generatePreview: true,
          showInModal: true,
          allowDownload: true
        }
      }
    ]
  },

  // Test data cho tính năng Data Persistence
  dataPersistenceTest: {
    title: 'Data Persistence Test / データ永続化テスト',
    testCases: [
      {
        name: 'Auto Save',
        description: 'Test tự động lưu dữ liệu',
        data: {
          saveInterval: 30000, // 30 seconds
          saveMethod: 'localStorage',
          maxRetries: 3
        }
      },
      {
        name: 'Form Recovery',
        description: 'Test khôi phục dữ liệu form',
        data: {
          recoveryMethod: 'localStorage',
          backupInterval: 60000, // 1 minute
          maxBackups: 5
        }
      }
    ]
  }
}

// Hàm để tạo test data cho từng tính năng
export const createFeatureTestData = (featureName) => {
  const featureData = featuresTestData[featureName]
  if (!featureData) {
    throw new Error(`Feature test data not found: ${featureName}`)
  }
  
  return {
    ...featureData,
    timestamp: new Date().toISOString(),
    testId: `test_${featureName}_${Date.now()}`
  }
}

// Hàm để tạo mock data cho testing
export const createMockData = (type, options = {}) => {
  const mockDataGenerators = {
    user: () => ({
      id: Math.random().toString(36).substr(2, 9),
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString()
    }),
    
    form: () => ({
      id: Math.random().toString(36).substr(2, 9),
      title: 'Test Form',
      fields: [],
      status: 'draft',
      createdAt: new Date().toISOString()
    }),
    
    file: () => ({
      id: Math.random().toString(36).substr(2, 9),
      name: 'test-file.pdf',
      size: 1024000,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString()
    })
  }
  
  const generator = mockDataGenerators[type]
  if (!generator) {
    throw new Error(`Mock data generator not found for type: ${type}`)
  }
  
  return generator()
}

// Export default
export default featuresTestData
