import { UploadResponse } from '@/types'

// Cloudflare R2 Configuration
export const R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL!,
}

// File upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles: 10,
}

// Validate file before upload
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return {
      isValid: false,
      error: `File size must be less than ${UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB`,
    }
  }

  // Check file type
  if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${UPLOAD_CONFIG.allowedTypes.join(', ')}`,
    }
  }

  return { isValid: true }
}

// Generate unique file key
export function generateFileKey(prefix: string, file: File): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()
  return `${prefix}/${timestamp}-${randomString}.${extension}`
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Mock upload function (replace with actual R2 implementation)
export async function uploadToR2(file: File, key: string): Promise<UploadResponse> {
  // This is a mock implementation
  // In production, you would use the actual Cloudflare R2 SDK
  
  return new Promise((resolve, reject) => {
    // Simulate upload delay
    setTimeout(() => {
      try {
        // Mock successful upload
        const response: UploadResponse = {
          url: `${R2_CONFIG.publicUrl}/${key}`,
          key,
          size: file.size,
          mimeType: file.type,
        }
        resolve(response)
      } catch (error) {
        reject(new Error('Upload failed'))
      }
    }, 2000)
  })
}

// Delete file from R2
export async function deleteFromR2(key: string): Promise<boolean> {
  // This is a mock implementation
  // In production, you would use the actual Cloudflare R2 SDK
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

// Get file info from R2
export async function getFileInfo(key: string): Promise<UploadResponse | null> {
  // This is a mock implementation
  // In production, you would use the actual Cloudflare R2 SDK
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock file info
      resolve({
        url: `${R2_CONFIG.publicUrl}/${key}`,
        key,
        size: 0,
        mimeType: 'image/jpeg',
      })
    }, 500)
  })
}

// Upload multiple files
export async function uploadMultipleFiles(files: File[], prefix: string): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file, index) => {
    const key = generateFileKey(prefix, file)
    return uploadToR2(file, key)
  })

  try {
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    throw new Error('Failed to upload multiple files')
  }
}

// Validate multiple files
export function validateMultipleFiles(files: File[]): { validFiles: File[]; errors: string[] } {
  const validFiles: File[] = []
  const errors: string[] = []

  files.forEach((file, index) => {
    const validation = validateFile(file)
    if (validation.isValid) {
      validFiles.push(file)
    } else {
      errors.push(`File ${index + 1}: ${validation.error}`)
    }
  })

  return { validFiles, errors }
}
