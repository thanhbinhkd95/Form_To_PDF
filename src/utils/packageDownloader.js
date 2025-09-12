import JSZip from 'jszip'
import { generatePdfFromData } from './pdfGenerator.js'

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const byteCharacters = atob(base64.split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

/**
 * Tạo package ZIP chứa PDF form và tất cả file đính kèm
 * @param {Object} formData - Dữ liệu form đã submit
 * @param {string} imageUrl - URL của ảnh portrait
 * @param {Function} onProgress - Callback để hiển thị tiến trình (optional)
 * @returns {Promise<Blob>} - ZIP file blob
 */
export async function createApplicationPackage(formData, imageUrl, onProgress) {
  try {
    const zip = new JSZip()
    
    // 1. Tạo PDF từ form data
    console.log('Creating PDF...')
    if (onProgress) onProgress('Creating PDF form...', 20)
    
    const pdfBlob = await generatePdfFromData(formData, imageUrl)
    
    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('Generated PDF is invalid')
    }
    
    // Thêm PDF vào ZIP
    zip.file('Application_Form.pdf', pdfBlob)
    console.log('✅ Added PDF to package')
    if (onProgress) onProgress('PDF created successfully', 40)
    
    // 2. Thêm ảnh portrait nếu có
    if (imageUrl) {
      try {
        console.log('Adding portrait photo...')
        if (onProgress) onProgress('Adding portrait photo...', 50)
        
        const imageBlob = await fetch(imageUrl).then(res => res.blob())
        zip.file('Portrait_Photo.jpg', imageBlob)
        console.log('✅ Added portrait photo')
      } catch (error) {
        console.warn('Cannot add portrait photo:', error)
      }
    }
    
    // 3. Thêm các file đính kèm
    if (formData.attachments && formData.attachments.length > 0) {
      console.log('Adding attachments...', formData.attachments.length, 'files')
      if (onProgress) onProgress('Adding attachments...', 60)
      
      let attachmentCount = 0
      for (const attachment of formData.attachments) {
        try {
          let fileBlob
          
          if (attachment.file && attachment.file instanceof File) {
            // File object trực tiếp
            fileBlob = attachment.file
          } else if (attachment.base64) {
            // File từ base64 string
            fileBlob = base64ToBlob(attachment.base64, attachment.type)
          } else if (attachment.previewUrl) {
            // File từ URL
            fileBlob = await fetch(attachment.previewUrl).then(res => res.blob())
          } else {
            console.warn('Cannot get attachment file:', attachment.name)
            continue
          }
          
          // Tạo tên file an toàn
          const safeFileName = sanitizeFileName(attachment.name || `attachment_${Date.now()}`)
          const folderName = getAttachmentFolderName(attachment.key)
          
          // Thêm vào folder tương ứng
          zip.file(`${folderName}/${safeFileName}`, fileBlob)
          console.log(`✅ Added: ${folderName}/${safeFileName}`)
          
          attachmentCount++
          const progress = 60 + (attachmentCount / formData.attachments.length) * 20
          if (onProgress) onProgress(`Added ${attachmentCount}/${formData.attachments.length} attachments`, progress)
          
        } catch (error) {
          console.warn(`Cannot add attachment ${attachment.name}:`, error)
        }
      }
    }
    
    // 4. Bỏ qua tạo file README theo yêu cầu
    
    console.log('Creating ZIP file...')
    if (onProgress) onProgress('Creating ZIP file...', 85)
    
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // Cân bằng giữa tốc độ và kích thước
      }
    })
    
    if (!zipBlob || zipBlob.size === 0) {
      throw new Error('Cannot create ZIP file')
    }
    
    console.log('✅ Package ZIP created successfully!')
    return zipBlob
    
  } catch (error) {
    console.error('Error creating package:', error)
    throw new Error('Cannot create package. Please try again.')
  }
}

/**
 * Tạo tên folder cho file đính kèm dựa trên key
 */
function getAttachmentFolderName(key) {
  const folderMap = {
    'passport': '01_Passport_Documents',
    'certificate': '02_Certificates',
    'other': '03_Other_Documents'
  }
  
  return folderMap[key] || '04_Additional_Documents'
}

/**
 * Làm sạch tên file để tránh ký tự không hợp lệ
 */
function sanitizeFileName(fileName) {
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_') // Thay thế ký tự không hợp lệ
    .replace(/\s+/g, '_') // Thay thế khoảng trắng
    .replace(/_+/g, '_') // Gộp nhiều dấu gạch dưới
    .replace(/^_|_$/g, '') // Xóa dấu gạch dưới đầu/cuối
}


/**
 * Hiển thị dialog chọn nơi lưu file (nếu browser hỗ trợ File System Access API)
 * @param {string} defaultName - Tên file mặc định
 * @returns {Promise<string|null>} - Tên file được chọn hoặc null nếu hủy
 */
export async function showSaveDialog(defaultName = 'Application_Package.zip') {
  // Kiểm tra xem browser có hỗ trợ File System Access API không
  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: defaultName,
        types: [{
          description: 'ZIP files',
          accept: {
            'application/zip': ['.zip']
          }
        }]
      })
      return fileHandle.name
    } catch (error) {
      if (error.name === 'AbortError') {
        return null // User cancelled
      }
      throw error
    }
  } else {
    // Fallback: Sử dụng prompt cho tên file
    const filename = prompt(
      'Choose filename to save package:', 
      defaultName
    )
    return filename ? filename.trim() : null
  }
}

/**
 * Download package ZIP với filename đã chọn
 * @param {Blob} zipBlob - ZIP file blob
 * @param {string} filename - Tên file để download
 */
export function downloadPackage(zipBlob, filename = 'Application_Package.zip') {
  try {
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    
    console.log('Package downloaded successfully!')
  } catch (error) {
    console.error('Error downloading package:', error)
    throw new Error('Cannot download package. Please try again.')
  }
}

/**
 * Tạo và download package hoàn chỉnh với UX cải thiện
 * @param {Object} formData - Dữ liệu form đã submit
 * @param {string} imageUrl - URL của ảnh portrait
 * @param {Function} onProgress - Callback để hiển thị tiến trình (optional)
 */
export async function createAndDownloadPackage(formData, imageUrl, onProgress) {
  try {
    // 1. Hiển thị dialog chọn nơi lưu file trước
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const defaultFilename = `Application_Package_${timestamp}.zip`
    
    console.log('Showing save dialog...')
    if (onProgress) onProgress('Preparing...', 0)
    
    const selectedFilename = await showSaveDialog(defaultFilename)
    
    if (!selectedFilename) {
      return {
        success: false,
        message: 'User cancelled file save operation',
        cancelled: true
      }
    }
    
    // 2. Bắt đầu tạo package với progress updates
    console.log('Starting package creation...')
    if (onProgress) onProgress('Creating PDF...', 10)
    
    const zipBlob = await createApplicationPackage(formData, imageUrl, (step, progress) => {
      if (onProgress) onProgress(step, progress)
    })
    
    // 3. Download package
    console.log('Downloading package...')
    if (onProgress) onProgress('Downloading...', 95)
    
    downloadPackage(zipBlob, selectedFilename)
    
    if (onProgress) onProgress('Completed!', 100)
    
    return {
      success: true,
      message: 'Package has been created and downloaded successfully!',
      filename: selectedFilename,
      size: zipBlob.size
    }
    
  } catch (error) {
    console.error('Error during package creation:', error)
    if (onProgress) onProgress('An error occurred', 0)
    return {
      success: false,
      message: error.message || 'An error occurred while creating package',
      error: error
    }
  }
}
