'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { validateFile, formatFileSize } from '@/lib/r2-client'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onImageRemove: () => void
  selectedImage: File | null
  previewUrl?: string
  label?: string
  required?: boolean
  className?: string
  maxSize?: number
  acceptedTypes?: string[]
}

export default function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  previewUrl,
  label = 'Upload Image',
  required = false,
  className = '',
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}: ImageUploadProps) {
  const [error, setError] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError('')

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors.some((error: any) => error.code === 'file-too-large')) {
          setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
        } else if (rejection.errors.some((error: any) => error.code === 'file-invalid-type')) {
          setError(`File type not supported. Allowed types: ${acceptedTypes.join(', ')}`)
        } else {
          setError('File upload failed. Please try again.')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const validation = validateFile(file)
        
        if (!validation.isValid) {
          setError(validation.error || 'Invalid file')
          return
        }

        onImageSelect(file)
      }
    },
    [onImageSelect, maxSize, acceptedTypes]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  })

  const handleRemoveImage = () => {
    setError('')
    onImageRemove()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validation = validateFile(file)
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file')
        return
      }
      onImageSelect(file)
      setError('')
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {selectedImage ? (
        <div className="relative">
          <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
            <img
              src={previewUrl || URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-2 text-sm text-gray-300">
            <p>File: {selectedImage.name}</p>
            <p>Size: {formatFileSize(selectedImage.size)}</p>
            <p>Type: {selectedImage.type}</p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-primary-400 hover:bg-primary-500/10 ${
            isDragActive ? 'border-primary-500 bg-primary-500/20' : 'border-gray-600'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-8 h-8 text-primary-400" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-300" />
            )}
          </div>
            
            <div>
              <p className="text-lg font-medium text-white">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                or click to select a file
              </p>
            </div>
            
            <div className="text-xs text-gray-400 space-y-1">
              <p>Supported formats: {acceptedTypes.join(', ')}</p>
              <p>Max file size: {maxSize / (1024 * 1024)}MB</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {!selectedImage && (
        <div className="text-center">
          <label className="btn-outline cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Choose File
            <input
              type="file"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
            />
          </label>
        </div>
      )}
    </div>
  )
}
