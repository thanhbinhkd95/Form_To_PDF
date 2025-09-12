import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase.js";
import { APP_CONSTANTS } from "../constants/appConstants.js";

// Server-side upload via Cloud Function to avoid CORS/App Check in browser
async function uploadViaFunction(pdfBlob, filename) {
  const base64 = await blobToBase64(pdfBlob);

  // Thử local proxy trước (cho development)
  const localEndpoint = `${location.origin}/uploadPdf`;
  const projectId =
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "form-to-pdf-52d69";
  const regionUrl = `https://us-central1-${projectId}.cloudfunctions.net/uploadPdf`;

  // Thử local proxy trước (Vite dev server proxy)
  try {
    console.log("Trying local proxy:", localEndpoint);
    const res = await fetch(localEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64, filename }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.downloadURL) {
        console.log("Upload successful via local proxy:", data.downloadURL);
        return data.downloadURL;
      }
    }
    console.log("Local proxy failed, falling back to direct Cloud Function");
  } catch (error) {
    console.log(
      "Local proxy error, falling back to direct Cloud Function:",
      error.message
    );
  }

  // Fallback: Gọi trực tiếp Firebase Cloud Functions
  try {
    console.log("Uploading directly to Firebase Cloud Function:", regionUrl);
    const res = await fetch(regionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64, filename }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Function upload failed:", res.status, errorText);
      throw new Error(`Function upload failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    if (!data.ok || !data.downloadURL) {
      console.error("Invalid response from function:", data);
      throw new Error(data.error || "No download URL received");
    }

    console.log(
      "Upload successful via direct Cloud Function:",
      data.downloadURL
    );
    return data.downloadURL;
  } catch (error) {
    console.error("Error uploading to Cloud Function:", error);
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const base64 = String(result).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
// (duplicate import removed)

/**
 * Upload PDF file to Firebase Storage
 * @param {Blob} pdfBlob - PDF file as Blob
 * @param {string} filename - Name of the file
 * @returns {Promise<string>} Download URL
 */
export async function uploadPdfToStorage(pdfBlob, filename) {
  try {
    console.log("Uploading PDF to Firebase Storage...", {
      filename,
      sizeBytes: pdfBlob.size,
    });
    // Use Cloud Function path by default to avoid browser CORS
    if (import.meta.env.VITE_USE_FUNCTION_UPLOAD !== "false") {
      return await uploadViaFunction(pdfBlob, filename);
    }

    // Create storage reference with timestamp to avoid conflicts
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const storageRef = ref(
      storage,
      `${APP_CONSTANTS.STORAGE_PATHS.APPLICATION_FORMS}${timestamp}_${filename}`
    );

    // Upload PDF blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, pdfBlob, {
      contentType: "application/pdf",
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: filename,
      },
    });

    console.log("PDF uploaded successfully:", snapshot.metadata.fullPath);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL generated:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading PDF to Firebase Storage:", error);
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }
}

/**
 * Delete PDF file from Firebase Storage
 * @param {string} downloadURL - Download URL of the file
 */
export async function deletePdfFromStorage(downloadURL) {
  try {
    if (!downloadURL || typeof downloadURL !== "string") {
      console.warn("Invalid download URL provided for deletion");
      return;
    }

    // Extract file path from download URL
    const url = new URL(downloadURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);

    if (!pathMatch) {
      throw new Error("Invalid download URL format");
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    const fileRef = ref(storage, filePath);

    await deleteObject(fileRef);
    console.log("PDF deleted successfully:", filePath);
  } catch (error) {
    console.error("Error deleting PDF from Firebase Storage:", error);
    // Don't throw error for delete operations
  }
}

/**
 * Clean up old PDF files (older than 7 days)
 * This is a utility function for maintenance
 */
export async function cleanupOldPdfs() {
  // Implementation for cleanup if needed
  console.log("Cleanup function - implement if needed");
}
