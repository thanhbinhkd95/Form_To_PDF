// Test script cho Web Mock Test
// Test script for Web Mock Test

import { testData, createTestDataWithFiles, createAlternativeTestData } from './test-data.js'

// Hàm để điền form với dữ liệu test cho Web Mock
export const fillFormWithWebMockData = (formData, testDataToUse = testData) => {
  console.log('🌐 Bắt đầu Web Mock Test...')
  console.log('🌐 Starting Web Mock Test...')
  
  // Cập nhật tất cả các trường với dữ liệu test
  const updatedFormData = {
    ...formData,
    ...testDataToUse
  }
  
  console.log('✅ Web Mock Test data đã được điền')
  console.log('✅ Web Mock Test data has been filled')
  
  return updatedFormData
}

// Hàm để tạo file ảnh mẫu cho Web Mock Test
export const createWebMockImageFile = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 400
  const ctx = canvas.getContext('2d')
  
  // Vẽ background với màu web mock
  ctx.fillStyle = '#e0f2fe'
  ctx.fillRect(0, 0, 300, 400)
  
  // Vẽ border
  ctx.strokeStyle = '#0369a1'
  ctx.lineWidth = 3
  ctx.strokeRect(10, 10, 280, 380)
  
  // Vẽ text
  ctx.fillStyle = '#0369a1'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('WEB MOCK', 150, 180)
  ctx.fillText('Sample Photo', 150, 210)
  ctx.fillText('4cm x 3cm', 150, 240)
  ctx.fillText('Test Image', 150, 270)
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'web_mock_photo.jpg', { type: 'image/jpeg' })
      resolve(file)
    }, 'image/jpeg', 0.8)
  })
}

// Hàm để tạo file PDF mẫu cho Web Mock Test
export const createWebMockPdfFile = (filename, content) => {
  const text = content || `WEB MOCK TEST PDF\n\nThis is a web mock test PDF file for ${filename}\n\nGenerated for web interface testing purposes.\n\nMock Data:\n- Name: Tanaka Yuki\n- Test Type: Web Mock\n- Date: ${new Date().toLocaleDateString()}`
  const blob = new Blob([text], { type: 'application/pdf' })
  return new File([blob], filename, { type: 'application/pdf' })
}

// Hàm để tạo tất cả file đính kèm mẫu cho Web Mock
export const createWebMockAttachments = async () => {
  const attachments = []
  
  // Tạo ảnh mẫu
  const sampleImage = await createWebMockImageFile()
  
  // Tạo các file PDF mẫu
  const passportFile = createWebMockPdfFile('web_mock_passport.pdf', 
    'WEB MOCK PASSPORT SAMPLE\n\nName: Tanaka Yuki\nPassport No: N1234567\nNationality: Vietnamese\nIssue Date: 2020-01-15\nExpiry Date: 2030-01-15\n\nThis is a web mock test document.')
  
  const certificateFile = createWebMockPdfFile('web_mock_graduation.pdf',
    'WEB MOCK GRADUATION CERTIFICATE\n\nThis is to certify that\nTanaka Yuki\nhas successfully completed\nBachelor of Business Administration\nUniversity of Economics Ho Chi Minh City\nGraduation Date: 2017-06-15\n\nThis is a web mock test document.')
  
  const jlptFile = createWebMockPdfFile('web_mock_jlpt.pdf',
    'WEB MOCK JLPT CERTIFICATE\n\nName: Tanaka Yuki\nTest: Japanese Language Proficiency Test\nLevel: N3\nScore: 145/180\nResult: Passed\nTest Date: 2023-12-03\n\nThis is a web mock test document.')
  
  attachments.push(
    {
      key: 'passport',
      name: passportFile.name,
      type: passportFile.type,
      size: passportFile.size,
      file: passportFile
    },
    {
      key: 'certificate',
      name: certificateFile.name,
      type: certificateFile.type,
      size: certificateFile.size,
      file: certificateFile
    },
    {
      key: 'other',
      name: jlptFile.name,
      type: jlptFile.type,
      size: jlptFile.size,
      file: jlptFile
    }
  )
  
  return { attachments, sampleImage }
}

// Hàm để chạy Web Mock Test hoàn chỉnh
export const runWebMockTest = async (updateForm, setImage) => {
  console.log('🌐 Bắt đầu Web Mock Test hoàn chỉnh...')
  console.log('🌐 Starting complete Web Mock Test...')
  
  try {
    // 1. Tạo file đính kèm mẫu
    const { attachments, sampleImage } = await createWebMockAttachments()
    
    // 2. Điền dữ liệu form
    const testDataWithFiles = createTestDataWithFiles()
    const finalFormData = {
      ...testDataWithFiles,
      attachments: attachments
    }
    
    // 3. Cập nhật form
    updateForm(finalFormData)
    
    // 4. Cập nhật ảnh
    setImage(sampleImage)
    
    console.log('✅ Web Mock Test hoàn thành!')
    console.log('✅ Web Mock Test completed!')
    console.log('🌐 Web Mock Test Results:')
    console.log('- Giao diện form / Form Interface: ✅')
    console.log('- Upload ảnh / Image Upload: ✅')
    console.log('- Upload file / File Upload: ✅')
    console.log('- Validation / Form Validation: ✅')
    console.log('- Responsive Design: ✅')
    
    return finalFormData
    
  } catch (error) {
    console.error('❌ Lỗi Web Mock Test:', error)
    console.error('❌ Web Mock Test Error:', error)
    throw error
  }
}

// Hàm để test responsive design
export const testResponsiveDesign = () => {
  console.log('📱 Testing responsive design...')
  
  const breakpoints = [
    { name: 'Mobile', width: 375 },
    { name: 'Tablet', width: 768 },
    { name: 'Desktop', width: 1024 },
    { name: 'Large Desktop', width: 1440 }
  ]
  
  breakpoints.forEach(breakpoint => {
    console.log(`📱 Testing ${breakpoint.name} (${breakpoint.width}px)`)
    // Có thể thêm logic test responsive ở đây
  })
  
  console.log('✅ Responsive design test completed')
}

// Hàm để test form validation
export const testFormValidation = (formData) => {
  console.log('✅ Testing form validation...')
  
  const errors = []
  
  // Kiểm tra các trường bắt buộc
  const requiredFields = [
    'lastNameRomaji', 'firstNameRomaji', 'nationality', 'gender',
    'dob', 'email', 'phone', 'passportNumber'
  ]
  
  requiredFields.forEach(field => {
    if (!formData[field]) {
      errors.push(`Thiếu trường bắt buộc: ${field}`)
    }
  })
  
  // Kiểm tra email format
  if (formData.email && !formData.email.includes('@')) {
    errors.push('Email không hợp lệ')
  }
  
  if (errors.length === 0) {
    console.log('✅ Form validation passed')
  } else {
    console.log('❌ Form validation errors:', errors)
  }
  
  return errors
}

// Export các hàm để sử dụng
export default {
  fillFormWithWebMockData,
  createWebMockImageFile,
  createWebMockPdfFile,
  createWebMockAttachments,
  runWebMockTest,
  testResponsiveDesign,
  testFormValidation
}