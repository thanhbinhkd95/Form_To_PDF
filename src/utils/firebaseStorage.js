import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../config/firebase.js'
import { APP_CONSTANTS } from '../constants/appConstants.js'

/**
 * Upload PDF file to Firebase Storage
 * @param {Blob} pdfBlob - PDF file as Blob
 * @param {string} filename - Name of the file
 * @returns {Promise<string>} Download URL
 */
export async function uploadPdfToStorage(pdfBlob, filename) {
  try {
    console.log('Uploading PDF to Firebase Storage...', { filename, sizeBytes: pdfBlob.size })
    
    // Create storage reference with timestamp to avoid conflicts
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const storageRef = ref(storage, `${APP_CONSTANTS.STORAGE_PATHS.APPLICATION_FORMS}${timestamp}_${filename}`)
    
    // Upload PDF blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, pdfBlob, {
      contentType: 'application/pdf',
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: filename
      }
    })
    
    console.log('PDF uploaded successfully:', snapshot.metadata.fullPath)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log('Download URL generated:', downloadURL)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading PDF to Firebase Storage:', error)
    throw new Error(`Failed to upload PDF: ${error.message}`)
  }
}

/**
 * Delete PDF file from Firebase Storage
 * @param {string} downloadURL - Download URL of the file
 */
export async function deletePdfFromStorage(downloadURL) {
  try {
    if (!downloadURL || typeof downloadURL !== 'string') {
      console.warn('Invalid download URL provided for deletion')
      return
    }
    
    // Extract file path from download URL
    const url = new URL(downloadURL)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)
    
    if (!pathMatch) {
      throw new Error('Invalid download URL format')
    }
    
    const filePath = decodeURIComponent(pathMatch[1])
    const fileRef = ref(storage, filePath)
    
    await deleteObject(fileRef)
    console.log('PDF deleted successfully:', filePath)
  } catch (error) {
    console.error('Error deleting PDF from Firebase Storage:', error)
    // Don't throw error for delete operations
  }
}

/**
 * Clean up old PDF files (older than 7 days)
 * This is a utility function for maintenance
 */
export async function cleanupOldPdfs() {
  // Implementation for cleanup if needed
  console.log('Cleanup function - implement if needed')
}

