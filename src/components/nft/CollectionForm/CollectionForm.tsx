'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Sparkles, 
  Globe, 
  Twitter, 
  MessageCircle, 
  Send, 
  Github,
  Crown,
  DollarSign,
  AlertCircle,
  AlertTriangle
} from 'lucide-react'
import ImageUpload from '../ImageUpload'
import { CreateCollectionForm } from '@/types'
import { validateCollectionForm, sanitizeCollectionForm } from '@/lib/nft-validation'
import { useWallet } from '@/contexts/WalletContext'
import { createCollection } from '@/lib/contracts/client'
import { ethers } from 'ethers'
import WalletConnect from '@/components/ui/WalletConnect'

// Zod schema for form validation
const collectionSchema = z.object({
  name: z.string()
    .min(3, 'Collection name must be at least 3 characters')
    .max(50, 'Collection name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s]+$/, 'Collection name can only contain letters, numbers, and spaces'),
  symbol: z.string()
    .min(2, 'Collection symbol must be at least 2 characters')
    .max(10, 'Collection symbol must be less than 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Collection symbol can only contain uppercase letters and numbers'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  maxSupply: z.number()
    .min(1, 'Max supply must be at least 1')
    .max(1000000, 'Max supply must be less than 1,000,000')
    .optional(),
  royaltyPercentage: z.number()
    .min(0, 'Royalty percentage must be at least 0%')
    .max(25, 'Royalty percentage must be less than 25%'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
  discord: z.string().url('Please enter a valid Discord invite URL').optional().or(z.literal('')),
  telegram: z.string().url('Please enter a valid Telegram URL').optional().or(z.literal('')),
  github: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
})

type CollectionFormData = z.infer<typeof collectionSchema>

interface CollectionFormProps {
  onSubmit: (data: CreateCollectionForm) => void
  isLoading?: boolean
}

export default function CollectionForm({ onSubmit, isLoading = false }: CollectionFormProps) {
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const { walletState: { isConnected, isCorrectNetwork, address } } = useWallet()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      maxSupply: undefined,
      royaltyPercentage: 5,
      website: '',
      twitter: '',
      discord: '',
      telegram: '',
      github: '',
    },
  })

  const watchedValues = watch()

  const handleFormSubmit = async (data: CollectionFormData) => {
    try {
      // Validate form data
      const validationErrors = validateCollectionForm({
        ...data,
        coverImage,
        bannerImage,
      })

      if (validationErrors.length > 0) {
        setFormErrors(validationErrors.map(error => error.message))
        return
      }

      // Sanitize form data
      const sanitizedData = sanitizeCollectionForm({
        ...data,
        coverImage,
        bannerImage,
      })

      // Submit form
      onSubmit(sanitizedData)
      setFormErrors([])
    } catch (error) {
      console.error('Form submission error:', error)
      setFormErrors(['An unexpected error occurred. Please try again.'])
    }
  }

  const handleCoverImageSelect = (file: File) => {
    setCoverImage(file)
  }

  const handleCoverImageRemove = () => {
    setCoverImage(null)
  }

  const handleBannerImageSelect = (file: File) => {
    setBannerImage(file)
  }

  const handleBannerImageRemove = () => {
    setBannerImage(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="card-header p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Collection</h2>
              <p className="text-gray-300">Launch your NFT collection on Core Blockchain</p>
            </div>
          </div>
        </div>

        {/* Wallet Connection Check */}
        {!isConnected ? (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center space-x-3 text-yellow-800 mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold">Wallet Not Connected</span>
            </div>
            <p className="text-yellow-700 mb-6 text-lg leading-relaxed">
              Please connect your wallet to create a collection. Make sure you're connected to Core Blockchain Testnet2.
            </p>
            <WalletConnect />
          </div>
        ) : !isCorrectNetwork ? (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center space-x-3 text-orange-800 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold">Wrong Network</span>
            </div>
            <p className="text-orange-700 mb-6 text-lg leading-relaxed">
              Please switch to Core Blockchain Testnet2 to create a collection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Switch Network
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Crown className="w-5 h-5 text-primary-400" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Collection Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="input"
                  placeholder="Enter collection name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Collection Symbol *
                </label>
                <input
                  {...register('symbol')}
                  type="text"
                  className="input"
                  placeholder="e.g., MYNFT"
                  onChange={(e) => setValue('symbol', e.target.value.toUpperCase())}
                />
                {errors.symbol && (
                  <p className="mt-1 text-sm text-red-600">{errors.symbol.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="input"
                placeholder="Describe your collection..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Collection Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-secondary-400" />
              <span>Collection Settings</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Supply
                </label>
                <input
                  {...register('maxSupply', { valueAsNumber: true })}
                  type="number"
                  className="input"
                  placeholder="Leave empty for unlimited"
                  min="1"
                  max="1000000"
                />
                {errors.maxSupply && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxSupply.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Royalty Percentage *
                </label>
                <div className="relative">
                  <input
                    {...register('royaltyPercentage', { valueAsNumber: true })}
                    type="number"
                    className="input pr-12"
                    placeholder="5"
                    min="0"
                    max="25"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    %
                  </span>
                </div>
                {errors.royaltyPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.royaltyPercentage.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Percentage of sales that goes to collection creator
                </p>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Images</h3>
            
            <div className="space-y-6">
              <ImageUpload
                label="Cover Image *"
                required
                selectedImage={coverImage}
                onImageSelect={handleCoverImageSelect}
                onImageRemove={handleCoverImageRemove}
                className="max-w-md"
              />

              <ImageUpload
                label="Banner Image (Optional)"
                selectedImage={bannerImage}
                onImageSelect={handleBannerImageSelect}
                onImageRemove={handleBannerImageRemove}
                className="max-w-md"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary-400" />
              <span>Social Links</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-300" />
                  <span>Website</span>
                </label>
                <input
                  {...register('website')}
                  type="url"
                  className="input"
                  placeholder="https://yourwebsite.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
                  <Twitter className="w-4 h-4 text-gray-300" />
                  <span>Twitter</span>
                </label>
                <input
                  {...register('twitter')}
                  type="url"
                  className="input"
                  placeholder="https://twitter.com/username"
                />
                {errors.twitter && (
                  <p className="mt-1 text-sm text-red-600">{errors.twitter.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-gray-300" />
                  <span>Discord</span>
                </label>
                <input
                  {...register('discord')}
                  type="url"
                  className="input"
                  placeholder="https://discord.gg/invite"
                />
                {errors.discord && (
                  <p className="mt-1 text-sm text-red-600">{errors.discord.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
                  <Send className="w-4 h-4 text-gray-300" />
                  <span>Telegram</span>
                </label>
                <input
                  {...register('telegram')}
                  type="url"
                  className="input"
                  placeholder="https://t.me/username"
                />
                {errors.telegram && (
                  <p className="mt-1 text-sm text-red-600">{errors.telegram.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
                  <Github className="w-4 h-4 text-gray-300" />
                  <span>GitHub</span>
                </label>
                <input
                  {...register('github')}
                  type="url"
                  className="input"
                  placeholder="https://github.com/username"
                />
                {errors.github && (
                  <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Errors */}
          {formErrors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Please fix the following errors:</span>
              </div>
              <ul className="mt-2 text-sm text-red-300 space-y-1">
                {formErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
                          <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Collection...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Create Collection</span>
                </div>
              )}
            </button>
                      </div>
          </form>
        )}
        </div>
      </div>
    )
  }
