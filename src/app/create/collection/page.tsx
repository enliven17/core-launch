'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import CollectionForm from '../../../components/nft/CollectionForm'
import { CreateCollectionForm } from '../../../types'
import { getSigner, createCollection } from '../../../lib/contracts/client'
import Navbar from '../../../components/ui/Navbar'
import WalletConnect from '../../../components/ui/WalletConnect'

export default function CreateCollectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string>('')
  const [collectionData, setCollectionData] = useState<CreateCollectionForm | null>(null)

  const handleSubmit = async (data: CreateCollectionForm) => {
    setIsLoading(true)
    setError('')

    try {
      // TODO: Upload images to Cloudflare R2
      // For now, we'll use placeholder URIs
      const baseURI = `https://example.com/metadata/${Date.now()}/`
      
      // Get signer for blockchain transaction
      const signer = await getSigner()
      
      // Create collection on Core Blockchain
      const result = await createCollection(
        data.name,
        data.symbol,
        baseURI,
        data.maxSupply || 10000,
        data.royaltyPercentage,
        signer
      )
      
      if (result.success) {
        setCollectionData(data)
        setIsSuccess(true)
        
        // Redirect to collection page after success
        setTimeout(() => {
          router.push('/collections')
        }, 3000)
      } else {
        setError(result.error || 'Failed to create collection on blockchain')
      }
      
    } catch (err) {
      console.error('Collection creation failed:', err)
      setError('Failed to create collection. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Core-Launch</h1>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/launchpad" className="text-gray-300 hover:text-white transition-colors">
                  Launchpad
                </Link>
                <Link href="/collections" className="text-gray-300 hover:text-white transition-colors">
                  Collections
                </Link>
                <Link href="/create/collection" className="text-white font-medium border-b-2 border-primary-500 pb-1">
                  Create Collection
                </Link>
              </nav>

              <WalletConnect />
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto text-center px-6 py-20">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Collection Created Successfully!
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              Your NFT collection "{collectionData?.name}" has been created on Core Blockchain.
            </p>
            
            <div className="bg-gray-700/50 rounded-xl p-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Collection Name:</span>
                <span className="font-medium text-white">{collectionData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Symbol:</span>
                <span className="font-medium text-white">{collectionData?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Royalty:</span>
                <span className="font-medium text-white">{collectionData?.royaltyPercentage}%</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mt-6">
              Redirecting to collections page...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">Create Collection</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Launch your NFT collection on Core Blockchain Testnet2. Create a unique collection with custom metadata, images, and social links.
          </p>
          
          {/* Creation Fee Info */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-2xl px-6 py-3 backdrop-blur-sm">
            <div className="w-8 h-8 bg-primary-500/20 rounded-xl flex items-center justify-center border border-primary-500/30">
              <span className="text-lg font-bold text-primary-400">₵</span>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">Collection Creation Fee: 0.1 CORE</div>
              <div className="text-sm text-primary-300">One-time payment to deploy your collection</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-2 text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Collection Form */}
        <CollectionForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Creation</h3>
              <p className="text-gray-300">
                Simple form-based collection creation with real-time validation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-gray-300">
                Images stored on Cloudflare R2 with blockchain metadata
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Launch</h3>
              <p className="text-gray-300">
                Deploy to Core Blockchain Testnet2 in minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
