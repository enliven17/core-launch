'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/ui/Navbar'
import { useWallet } from '../../contexts/WalletContext'
import { getAllCollections, getCollectionInfo, mintNFT } from '../../lib/contracts/client'
import { ethers } from 'ethers'

interface Collection {
  address: string
  name: string
  symbol: string
  creator: string
  creationTime: number
  items: string
  price: string
  image: string
}

export default function LaunchpadPage() {
  const { walletState: { isConnected, isCorrectNetwork, address }, switchNetwork } = useWallet()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [minting, setMinting] = useState<string | null>(null)
  const [mintSuccess, setMintSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Loading collections for launchpad...')
      
      const collectionAddresses = await getAllCollections()
      console.log('🔗 Collection addresses found:', collectionAddresses.length)
      
      if (collectionAddresses.length === 0) {
        console.log('📊 No collections found')
        setCollections([])
        setError('No collections available for minting yet.')
        setLoading(false)
        return
      }

      const collectionsData: Collection[] = []
      let validCollections = 0
      
      for (const address of collectionAddresses) {
        try {
          console.log('📋 Loading collection info for:', address)
          const info = await getCollectionInfo(address)
          console.log('📋 Collection info:', info)
          
          if (info && info.exists && info.name && info.symbol && info.creator) {
            collectionsData.push({
              address,
              name: info.name,
              symbol: info.symbol,
              creator: info.creator,
              creationTime: Number(info.creationTime) || 0,
              items: '0',
              price: '0.5 CORE',
              image: `bg-gradient-to-br from-primary-500/30 to-secondary-500/30`
            })
            validCollections++
            console.log(`✅ Collection ${info.name} added to launchpad`)
          } else {
            console.log(`⚠️ Collection ${address} has invalid data:`, info)
          }
        } catch (err) {
          console.error(`❌ Error loading collection ${address}:`, err)
          // Continue with other collections instead of failing completely
        }
      }

      console.log('📋 Final launchpad collections:', collectionsData)
      console.log(`📊 Valid collections for launchpad: ${validCollections}/${collectionAddresses.length}`)
      
      setCollections(collectionsData)
      
      if (validCollections === 0) {
        setError('No valid collections found for minting. Please try again later.')
      }
    } catch (err) {
      console.error('❌ Error loading collections for launchpad:', err)
      setError('Failed to load collections. Please try again later.')
      setCollections([])
    } finally {
      setLoading(false)
    }
  }

  const handleMintNFT = async (collectionAddress: string, collectionName: string) => {
    if (!isConnected || !isCorrectNetwork) {
      setError('Please connect your wallet and switch to Core Testnet2')
      return
    }

    setMinting(collectionAddress)
    setError('')

    try {
      const mintPrice = ethers.parseEther('0.5')
      const result = await mintNFT(
        collectionAddress,
        address!,
        `https://example.com/metadata/${Date.now()}`,
        mintPrice
      )

      if (result.success) {
        setMintSuccess(collectionAddress)
        setTimeout(() => {
          loadCollections()
          setMintSuccess(null)
        }, 3000)
      } else {
        setError(result.error || 'Failed to mint NFT')
      }
    } catch (err: any) {
      console.error('NFT minting failed:', err)
      let errorMessage = 'Failed to mint NFT. Please try again.'
      if (err?.code === 4001) {
        errorMessage = 'Transaction was cancelled. Please try again when you\'re ready.'
      } else if (err?.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient CORE balance. You need at least 0.5 CORE to mint.'
      } else if (err?.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected. Please approve the transaction in MetaMask.'
      } else if (err?.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      }
      setError(errorMessage)
    } finally {
      setMinting(null)
    }
  }

  const ItemCard = ({ collection }: { collection: Collection }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
      <div className={`w-full h-48 ${collection.image} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-white/80">{collection.symbol ? collection.symbol.charAt(0) : '?'}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
            {collection.price}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-200">
        {collection.name}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Symbol</span>
          <span className="text-white font-medium">{collection.symbol}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Creator</span>
          <span className="text-white font-medium">
            {collection.creator.slice(0, 6)}...{collection.creator.slice(-4)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Items</span>
          <span className="text-white font-medium">{collection.items}</span>
        </div>
      </div>

      <button
        onClick={() => handleMintNFT(collection.address, collection.name)}
        disabled={minting === collection.address || mintSuccess === collection.address}
        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
          minting === collection.address
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
            : mintSuccess === collection.address
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105'
        }`}
      >
        {minting === collection.address
          ? 'Minting...'
          : mintSuccess === collection.address
          ? 'Minted Successfully!'
          : `Mint NFT for ${collection.price}`
        }
      </button>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading collections...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">NFT Launchpad</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover and mint NFTs from amazing collections. Each NFT costs only 0.5 CORE to mint.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className={`border rounded-2xl p-6 mb-8 backdrop-blur-sm ${
              error.includes('cancelled') || error.includes('rejected') || error.includes('denied')
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  error.includes('cancelled') || error.includes('rejected') || error.includes('denied')
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}>
                  <span className="text-white text-sm font-bold">
                    {error.includes('cancelled') || error.includes('rejected') || error.includes('denied') ? '⚠' : '!'}
                  </span>
                </div>
                <h3 className={`text-lg font-semibold ${
                  error.includes('cancelled') || error.includes('rejected') || error.includes('denied')
                    ? 'text-yellow-300'
                    : 'text-red-300'
                }`}>
                  {error.includes('cancelled') || error.includes('rejected') || error.includes('denied')
                    ? 'Transaction Cancelled'
                    : 'Minting Error'
                  }
                </h3>
              </div>
              <p className={`text-center text-lg ${
                error.includes('cancelled') || error.includes('rejected') || error.includes('denied')
                  ? 'text-yellow-200'
                  : 'text-red-200'
              }`}>
                {error}
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setError('')}
                  className={`px-4 py-2 rounded-xl border transition-colors ${
                    error.includes('cancelled') || error.includes('rejected') || error.includes('denied')
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                  }`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Wallet Connection Check */}
          {!isConnected ? (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">Connect Your Wallet</h2>
              <p className="text-yellow-200 mb-6">Please connect your wallet to mint NFTs from the launchpad.</p>
              <div className="inline-block">{/* WalletConnect in Navbar */}</div>
            </div>
          ) : !isCorrectNetwork ? (
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-orange-300 mb-4">Wrong Network</h2>
              <p className="text-orange-200 mb-6">Please switch to Core Blockchain Testnet2 to mint NFTs.</p>
              <button onClick={switchNetwork} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Switch to Core Testnet2
              </button>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎨</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No Collections Available</h2>
              <p className="text-gray-300 mb-6">There are no NFT collections available for minting yet.</p>
              <Link href="/create/collection" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-200">
                Create First Collection
              </Link>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="text-3xl font-bold text-white mb-2">{collections.length}</div>
                  <div className="text-gray-400">Total Collections</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="text-3xl font-bold text-white mb-2">0.5 CORE</div>
                  <div className="text-gray-400">Mint Price</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="text-3xl font-bold text-white mb-2">∞</div>
                  <div className="text-gray-400">NFTs Available</div>
                </div>
              </div>

              {/* Collections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.map((collection) => (
                  <ItemCard key={collection.address} collection={collection} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
