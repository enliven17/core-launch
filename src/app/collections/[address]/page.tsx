'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import { getCollectionInfo, getCollectionStats, getCollectionNFTs } from '@/lib/contracts/client'
import { useWallet } from '@/contexts/WalletContext'
import BiddingModal from '@/components/nft/BiddingModal'

interface NFT {
  tokenId: number
  tokenURI: string
  owner: string
  price?: string
  forSale: boolean
}

interface CollectionDetails {
  address: string
  name: string
  symbol: string
  creator: string
  creationTime: number
  maxSupply: number
  royalty: number
  totalSupply: number
  uniqueOwners: number
  volume: string
}

export default function CollectionDetailsPage() {
  const params = useParams()
  const { walletState: { isConnected, address, isCorrectNetwork }, switchNetwork } = useWallet()
  const [collection, setCollection] = useState<CollectionDetails | null>(null)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showBiddingModal, setShowBiddingModal] = useState(false)
  const [biddingNFT, setBiddingNFT] = useState<NFT | null>(null)

  const collectionAddress = params.address as string

  useEffect(() => {
    if (collectionAddress) {
      loadCollectionDetails()
    }
  }, [collectionAddress])

  const loadCollectionDetails = async () => {
    try {
      setIsLoading(true)
      console.log('🔍 Loading collection details for:', collectionAddress)

      // Get collection info
      console.log('📋 Getting collection info...')
      const info = await getCollectionInfo(collectionAddress)
      console.log('📋 Collection info result:', info)
      
      if (!info) {
        setError('Failed to fetch collection info')
        return
      }
      
      if (!info.exists) {
        setError('Collection does not exist')
        return
      }

      // Get collection stats
      console.log('📊 Getting collection stats...')
      const stats = await getCollectionStats(collectionAddress)
      console.log('📊 Collection stats:', stats)

      // Get NFTs in collection
      console.log('🖼️ Getting NFTs...')
      const nftsData = await getCollectionNFTs(collectionAddress)
      console.log('🖼️ NFTs in collection:', nftsData)

      setCollection({
        address: collectionAddress,
        name: info.name,
        symbol: info.symbol,
        creator: info.creator,
        creationTime: Number(info.creationTime),
        maxSupply: Number(info.maxSupply),
        royalty: Number(info.royalty),
        totalSupply: stats.totalSupply,
        uniqueOwners: stats.uniqueOwners,
        volume: stats.volume
      })

      setNfts(nftsData)
    } catch (err) {
      console.error('Error loading collection details:', err)
      setError('Failed to load collection details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenBidding = (nft: NFT) => {
    setBiddingNFT(nft)
    setShowBiddingModal(true)
  }

  const handlePurchaseNFT = async (nft: NFT) => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
      alert('Please enter a valid price')
      return
    }

    try {
      // TODO: Implement NFT purchase logic
      console.log('🛒 Purchasing NFT:', nft.tokenId, 'for', purchasePrice, 'CORE')
      alert('NFT purchase functionality will be implemented soon!')
    } catch (err) {
      console.error('Error purchasing NFT:', err)
      alert('Failed to purchase NFT')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Loading Collection...</h3>
            <p className="text-gray-500">Fetching data from Core Blockchain</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" x2="9"></line>
                <line x1="9" x2="15"></line>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Collection Not Found</h3>
            <p className="text-gray-400 mb-8">{error || 'The requested collection could not be found.'}</p>
            <a 
              href="/collections"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-600 transition-colors duration-200"
            >
              Back to Collections
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Collection Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <a 
                href="/collections"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ← Back to Collections
              </a>
            </div>
            
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{collection.name}</h1>
                  <p className="text-xl text-gray-400 mb-6">{collection.symbol} Collection on Core Blockchain</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm">Total Supply</p>
                      <p className="text-2xl font-bold text-white">
                        {isConnected && isCorrectNetwork ? collection.totalSupply : '--'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Max Supply</p>
                      <p className="text-2xl font-bold text-white">
                        {isConnected && isCorrectNetwork ? (collection.maxSupply === 0 ? '∞' : collection.maxSupply) : '--'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Unique Owners</p>
                      <p className="text-2xl font-bold text-white">
                        {isConnected && isCorrectNetwork ? collection.uniqueOwners : '--'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Royalty</p>
                      <p className="text-2xl font-bold text-primary-500">
                        {isConnected && isCorrectNetwork ? `${collection.royalty}%` : '--'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-white/80">{collection.symbol.charAt(0)}</span>
                  </div>
                  <p className="text-sm text-gray-400">Collection Icon</p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm">Creator</p>
                    <p className="text-white font-mono">
                      {collection.creator.slice(0, 6)}...{collection.creator.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Contract Address</p>
                    <p className="text-white font-mono">
                      {collection.address.slice(0, 6)}...{collection.address.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white">
                      {new Date(collection.creationTime * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Connection Check */}
          {!isConnected ? (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-yellow-200 mb-6">
                Please connect your wallet to view collection details and NFTs.
              </p>
              <div className="inline-block">
                {/* WalletConnect component will be rendered by Navbar */}
              </div>
            </div>
          ) : !isCorrectNetwork ? (
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-orange-300 mb-4">
                Wrong Network
              </h2>
              <p className="text-orange-200 mb-6">
                Please switch to Core Blockchain Testnet2 to view collection details.
              </p>
              <button
                onClick={switchNetwork}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Switch to Core Testnet2
              </button>
            </div>
          ) : null}

          {/* NFTs Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">NFTs in Collection</h2>
            
            {!isConnected || !isCorrectNetwork ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Connect Wallet to View NFTs
                </h3>
                <p className="text-gray-400">
                  Please connect your wallet and switch to Core Testnet2 to view NFTs in this collection.
                </p>
              </div>
            ) : nfts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                  <div key={nft.tokenId} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                    <div className="w-full h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white/80">#{nft.tokenId}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {collection.name} #{nft.tokenId}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                      </p>
                    </div>
                    
                    {nft.forSale ? (
                      <div className="mb-4">
                        <p className="text-primary-500 font-bold text-lg">{nft.price} CORE</p>
                        <p className="text-gray-400 text-sm">For Sale</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4">Not for sale</p>
                    )}
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => handleOpenBidding(nft)}
                        className="w-full bg-gradient-to-r from-secondary-500 to-purple-500 text-white py-2 rounded-xl font-bold hover:from-secondary-600 hover:to-purple-600 transition-all duration-200"
                      >
                        Place Bid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <image href="https://via.placeholder.com/48x48" width="48" height="48" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No NFTs Yet</h3>
                <p className="text-gray-400">This collection doesn't have any NFTs minted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Bidding Modal */}
      {showBiddingModal && biddingNFT && (
        <BiddingModal
          isOpen={showBiddingModal}
          onClose={() => {
            setShowBiddingModal(false)
            setBiddingNFT(null)
          }}
          nft={{
            tokenId: biddingNFT.tokenId,
            tokenURI: biddingNFT.tokenURI,
            owner: biddingNFT.owner,
            collectionAddress: collectionAddress
          }}
        />
      )}
    </div>
  )
}
