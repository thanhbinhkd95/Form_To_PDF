// Shared utilities cho testing
// Shared utilities for testing

// Hàm để tạo mock data chung
export const createMockFormData = (overrides = {}) => {
  const baseData = {
    // Personal Information
    lastNameRomaji: "Test",
    firstNameRomaji: "User",
    lastNameKanji: "テスト",
    firstNameKanji: "ユーザー",
    nationality: "Vietnamese",
    gender: "Female",
    maritalStatus: "Single",
    course: "Japanese Language Course",
    dob: "1995-03-15",
    age: 29,
    permanentAddress: "123 Test Street, Test City, Vietnam",
    currentAddress: "456 Test Avenue, Test City, Vietnam",
    phone: "+84-90-123-4567",
    email: "test@example.com",
    
    // Passport Information
    passportNumber: "N1234567",
    passportIssueDate: "2020-01-15",
    passportIssuePlace: "Test City, Vietnam",
    passportExpirationDate: "2030-01-15",
    occupation: "Student",
    
    // COE History
    coeHistory: {
      yesNo: "No",
      count: 0,
      deniedCount: 0
    },
    
    // Visits to Japan
    visits: {
      yesNo: "Yes",
      count: 1,
      recent: "2023/06 to 2023/08"
    },
    
    // Education
    education: [
      {
        label: "University",
        startYm: "2013/09",
        endYm: "2017/06",
        yearsAttended: "4 years",
        location: "Test City, Vietnam"
      }
    ],
    lastSchoolSummary: "Bachelor of Test Studies",
    lastSchoolCategory: "University",
    yearsFromElementary: 16,
    
    // Employment
    employmentYesNo: "No",
    employment: [],
    
    // Japanese Learning
    hasStudiedAtLanguageSchool: "Yes",
    jpLearningHours: 240,
    jpSchools: [
      {
        label: "Test Japanese School",
        startYm: "2022/07",
        endYm: "2023/06"
      }
    ],
    
    // Japanese Proficiency
    proficiency: [
      {
        label: "JLPT",
        year: "2023",
        level: "N4",
        score: "120/180",
        result: "Passed"
      }
    ],
    otherProficiencyNote: "",
    
    // Financial Sponsor
    sponsor: {
      fullName: "Test Sponsor",
      relationship: "Father",
      currentAddress: "789 Sponsor Street, Test City, Vietnam",
      email: "sponsor@example.com",
      phone: "+84-90-987-6543",
      company: "Test Company",
      position: "Manager",
      workAddress: "101 Work Street, Test City, Vietnam",
      workPhone: "+84-28-1234-5678",
      annualIncomeJpy: 5000000,
      exchangeRate: 150
    },
    
    // Family
    family: [
      {
        relation: "Father",
        name: "Test Father",
        dob: "1965/05/20",
        nationality: "Vietnamese",
        occupation: "Business Owner",
        address: "789 Family Street, Test City, Vietnam"
      }
    ],
    
    // Family in Japan
    familyInJapanYesNo: "No",
    familyInJapan: [],
    
    // Motivation
    motivation: "I want to study Japanese language to improve my skills.",
    
    // School Information
    schoolType: "Japanese Language School",
    schoolName: "Test Japanese Academy",
    major: "Japanese Language",
    desiredJob: "Translator",
    returnHomeYyyyMm: "2026/03",
    notes: "Test notes",
    
    // Reasons for applying
    reasonsForApplying: "I am applying to study Japanese language.",
    
    // Attachments
    attachments: []
  }
  
  return { ...baseData, ...overrides }
}

// Hàm để tạo mock file
export const createMockFile = (name, type, size) => {
  const blob = new Blob(['mock file content'], { type })
  return new File([blob], name, { type, size })
}

// Hàm để tạo mock image file
export const createMockImageFile = (name = 'mock-image.jpg', width = 300, height = 400) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  // Vẽ background
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, width, height)
  
  // Vẽ border
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.strokeRect(10, 10, width - 20, height - 20)
  
  // Vẽ text
  ctx.fillStyle = '#333'
  ctx.font = '16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Mock Image', width / 2, height / 2)
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + 30)
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], name, { type: 'image/jpeg' })
      resolve(file)
    }, 'image/jpeg', 0.8)
  })
}

// Hàm để tạo mock PDF file
export const createMockPdfFile = (name = 'mock-document.pdf', content = 'Mock PDF content') => {
  const blob = new Blob([content], { type: 'application/pdf' })
  return new File([blob], name, { type: 'application/pdf' })
}

// Hàm để validate form data
export const validateFormData = (formData) => {
  const errors = []
  
  // Required fields
  const requiredFields = [
    'lastNameRomaji', 'firstNameRomaji', 'nationality', 'gender',
    'dob', 'email', 'phone', 'passportNumber'
  ]
  
  requiredFields.forEach(field => {
    if (!formData[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  })
  
  // Email validation
  if (formData.email && !formData.email.includes('@')) {
    errors.push('Invalid email format')
  }
  
  // Age validation
  if (formData.age && (formData.age < 16 || formData.age > 60)) {
    errors.push('Age must be between 16 and 60')
  }
  
  // Date validation
  if (formData.dob) {
    const dob = new Date(formData.dob)
    if (isNaN(dob.getTime())) {
      errors.push('Invalid date of birth')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Hàm để format test results
export const formatTestResults = (results) => {
  const total = results.passed + results.failed
  const passRate = total > 0 ? (results.passed / total * 100).toFixed(1) : 0
  
  return {
    total,
    passed: results.passed,
    failed: results.failed,
    passRate: `${passRate}%`,
    status: results.failed === 0 ? 'PASS' : 'FAIL'
  }
}

// Hàm để log test results
export const logTestResults = (testName, results) => {
  const formatted = formatTestResults(results)
  
  console.log(`\n📊 ${testName} Results:`)
  console.log(`   Total: ${formatted.total}`)
  console.log(`   Passed: ${formatted.passed}`)
  console.log(`   Failed: ${formatted.failed}`)
  console.log(`   Pass Rate: ${formatted.passRate}`)
  console.log(`   Status: ${formatted.status}`)
  
  return formatted
}

// Hàm để tạo test report
export const createTestReport = (testResults) => {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      totalPassed: 0,
      totalFailed: 0,
      overallPassRate: 0
    },
    details: {}
  }
  
  // Calculate summary
  Object.keys(testResults).forEach(testName => {
    const results = testResults[testName]
    report.summary.totalTests += results.total
    report.summary.totalPassed += results.passed
    report.summary.totalFailed += results.failed
    report.details[testName] = formatTestResults(results)
  })
  
  // Calculate overall pass rate
  if (report.summary.totalTests > 0) {
    report.summary.overallPassRate = (report.summary.totalPassed / report.summary.totalTests * 100).toFixed(1)
  }
  
  return report
}

// Hàm để export test report
export const exportTestReport = (report, format = 'json') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `test-report-${timestamp}.${format}`
  
  let content
  if (format === 'json') {
    content = JSON.stringify(report, null, 2)
  } else if (format === 'csv') {
    content = convertReportToCSV(report)
  } else {
    throw new Error(`Unsupported format: ${format}`)
  }
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  return filename
}

// Hàm để convert report sang CSV
const convertReportToCSV = (report) => {
  const headers = ['Test Name', 'Total', 'Passed', 'Failed', 'Pass Rate', 'Status']
  const rows = [headers.join(',')]
  
  Object.keys(report.details).forEach(testName => {
    const detail = report.details[testName]
    const row = [
      testName,
      detail.total,
      detail.passed,
      detail.failed,
      detail.passRate,
      detail.status
    ]
    rows.push(row.join(','))
  })
  
  return rows.join('\n')
}

// Hàm để tạo test environment
export const setupTestEnvironment = () => {
  console.log('🔧 Setting up test environment...')
  
  // Mock localStorage if not available
  if (typeof Storage === 'undefined') {
    global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    }
  }
  
  // Mock console methods if needed
  const originalConsole = { ...console }
  
  return {
    originalConsole,
    cleanup: () => {
      console.log('🧹 Cleaning up test environment...')
      // Restore original console if needed
    }
  }
}

// Export default
export default {
  createMockFormData,
  createMockFile,
  createMockImageFile,
  createMockPdfFile,
  validateFormData,
  formatTestResults,
  logTestResults,
  createTestReport,
  exportTestReport,
  setupTestEnvironment
}
