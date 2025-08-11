import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, NETWORK_CONFIG } from './constants'

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

// Provider and Signer setup
export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.RPC_URL)
}

export async function getSigner() {
  const provider = getProvider()
  if (provider instanceof ethers.BrowserProvider) {
    return await provider.getSigner()
  }
  throw new Error('Browser provider not available')
}

// Contract instances
export function getNFTCollectionFactoryContract(signer?: ethers.Signer) {
  const provider = signer ? signer.provider : getProvider()
  const contractSigner = signer || provider
  
  return new ethers.Contract(
    CONTRACT_ADDRESSES.NFT_COLLECTION_FACTORY,
    CONTRACT_ABIS.NFT_COLLECTION_FACTORY,
    contractSigner
  )
}

// Contract functions
export async function createCollection(
  name: string,
  symbol: string,
  baseURI: string,
  maxSupply: number,
  royaltyPercentage: number,
  signer: ethers.Signer
) {
  try {
    const contract = getNFTCollectionFactoryContract(signer)
    
    // Calculate creation fee in wei
    const creationFee = ethers.parseEther('0.1') // 0.1 CORE
    
    const tx = await contract.createCollection(
      name,
      symbol,
      baseURI,
      maxSupply,
      royaltyPercentage,
      { value: creationFee }
    )
    
    const receipt = await tx.wait()
    
    // Find CollectionCreated event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log)
        return parsed?.name === 'CollectionCreated'
      } catch {
        return false
      }
    })
    
    if (event) {
      const parsed = contract.interface.parseLog(event)
      return {
        success: true,
        collectionAddress: parsed?.args[0],
        transactionHash: tx.hash,
        receipt
      }
    }
    
    return {
      success: true,
      transactionHash: tx.hash,
      receipt
    }
  } catch (error) {
    console.error('Error creating collection:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getCollectionsCount() {
  try {
    const contract = getNFTCollectionFactoryContract()
    const count = await contract.getCollectionsCount()
    return parseInt(count.toString())
  } catch (error) {
    console.error('Error getting collections count:', error)
    return 0
  }
}

export async function getAllCollections() {
  try {
    const contract = getNFTCollectionFactoryContract()
    const collections = await contract.getAllCollections()
    return collections
  } catch (error) {
    console.error('Error getting all collections:', error)
    return []
  }
}

export async function getCollectionInfo(collectionAddress: string) {
  try {
    const contract = getNFTCollectionFactoryContract()
    const info = await contract.collections(collectionAddress)
    
    console.log('🔍 Raw collection info:', info)
    console.log('🔍 Info properties:', {
      creator: info.creator,
      name: info.name,
      symbol: info.symbol,
      creationTime: info.creationTime,
      maxSupply: info.maxSupply,
      royalty: info.royalty,
      exists: info.exists
    })
    
    // Check if required properties exist
    if (!info.creator || !info.name || !info.symbol) {
      console.error('❌ Missing required collection properties')
      return null
    }
    
    return {
      creator: info.creator,
      name: info.name,
      symbol: info.symbol,
      creationTime: info.creationTime ? parseInt(info.creationTime.toString()) : 0,
      maxSupply: info.maxSupply ? parseInt(info.maxSupply.toString()) : 0,
      royalty: info.royalty ? parseInt(info.royalty.toString()) : 0,
      exists: info.exists || true // Default to true if not specified
    }
  } catch (error) {
    console.error('Error getting collection info:', error)
    return null
  }
}

// Network utilities
export async function switchToCoreTestnet2() {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${NETWORK_CONFIG.CHAIN_ID.toString(16)}` }],
      })
      return true
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${NETWORK_CONFIG.CHAIN_ID.toString(16)}`,
              chainName: 'Core Blockchain Testnet2',
              nativeCurrency: NETWORK_CONFIG.NATIVE_CURRENCY,
              rpcUrls: [NETWORK_CONFIG.RPC_URL],
              blockExplorerUrls: [NETWORK_CONFIG.EXPLORER_URL],
            }],
          })
          return true
        } catch (addError) {
          console.error('Error adding chain:', addError)
          return false
        }
      }
      console.error('Error switching chain:', error)
      return false
    }
  }
  return false
}

export async function getCurrentChainId(): Promise<number | null> {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      return parseInt(chainId, 16)
    } catch (error) {
      console.error('Error getting chain ID:', error)
      return null
    }
  }
  return null
}

export function isCorrectNetwork(chainId: number): boolean {
  return chainId === NETWORK_CONFIG.CHAIN_ID
}

export async function getCollectionNFTCount(collectionAddress: string) {
  try {
    const collectionContract = new ethers.Contract(
      collectionAddress,
      [
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)"
      ],
      getProvider()
    )
    
    const totalSupply = await collectionContract.totalSupply()
    return parseInt(totalSupply.toString())
  } catch (error) {
    console.error('Error getting collection NFT count:', error)
    return 0
  }
}

export async function getCollectionStats(collectionAddress: string) {
  try {
    const collectionContract = new ethers.Contract(
      collectionAddress,
      [
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)",
        "function ownerOf(uint256 tokenId) view returns (address)"
      ],
      getProvider()
    )
    
    const totalSupply = await collectionContract.totalSupply()
    const totalSupplyNum = parseInt(totalSupply.toString())
    
    // Get unique owners (simplified - just count different addresses that own tokens)
    const owners = new Set()
    for (let i = 1; i <= totalSupplyNum; i++) {
      try {
        const owner = await collectionContract.ownerOf(i)
        owners.add(owner.toLowerCase())
      } catch (err) {
        // Token might not exist
        break
      }
    }
    
    return {
      totalSupply: totalSupplyNum,
      uniqueOwners: owners.size,
      volume: '0.0' // Will be updated when trading starts
    }
  } catch (error) {
    console.error('Error getting collection stats:', error)
    return {
      totalSupply: 0,
      uniqueOwners: 0,
      volume: '0.0'
    }
  }
}

export async function getCollectionNFTs(collectionAddress: string) {
  try {
    const collectionContract = new ethers.Contract(
      collectionAddress,
      [
        "function totalSupply() view returns (uint256)",
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)"
      ],
      getProvider()
    )
    
    const totalSupply = await collectionContract.totalSupply()
    const totalSupplyNum = parseInt(totalSupply.toString())
    
    const nfts = []
    
    for (let i = 1; i <= totalSupplyNum; i++) {
      try {
        const owner = await collectionContract.ownerOf(i)
        const tokenURI = await collectionContract.tokenURI(i)
        
        nfts.push({
          tokenId: i,
          tokenURI,
          owner,
          price: '0.0', // Will be updated when marketplace is implemented
          forSale: false // Will be updated when marketplace is implemented
        })
      } catch (err) {
        // Token might not exist
        console.log(`Token ${i} not found or error:`, err)
        break
      }
    }
    
    return nfts
  } catch (error) {
    console.error('Error getting collection NFTs:', error)
    return []
  }
}

// Bidding functions
export function getNFTBiddingContract(signer?: ethers.Signer) {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESSES.NFT_BIDDING,
    CONTRACT_ABIS.NFT_BIDDING,
    signer || getProvider()
  )
  return contract
}

export async function startBidding(
  nftContract: string,
  tokenId: number,
  minBid: string,
  duration: number,
  message: string,
  signer: ethers.Signer
) {
  try {
    const contract = getNFTBiddingContract(signer)
    const minBidWei = ethers.parseEther(minBid)
    
    console.log('🚀 Starting bidding for NFT:', { nftContract, tokenId, minBid, duration, message })
    
    const tx = await contract.startBidding(nftContract, tokenId, minBidWei, duration, message)
    console.log('⏳ Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('✅ Bidding started successfully!')
    
    return {
      success: true,
      transactionHash: tx.hash,
      receipt
    }
  } catch (error) {
    console.error('Error starting bidding:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function placeBid(
  nftContract: string,
  tokenId: number,
  amount: string,
  message: string,
  signer: ethers.Signer
) {
  try {
    const contract = getNFTBiddingContract(signer)
    const amountWei = ethers.parseEther(amount)
    
    console.log('💰 Placing bid for NFT:', { nftContract, tokenId, amount, message })
    
    const tx = await contract.placeBid(nftContract, tokenId, message, { value: amountWei })
    console.log('⏳ Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('✅ Bid placed successfully!')
    
    return {
      success: true,
      transactionHash: tx.hash,
      receipt
    }
  } catch (error) {
    console.error('Error placing bid:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getBiddingInfo(nftContract: string, tokenId: number) {
  try {
    const contract = getNFTBiddingContract()
    const info = await contract.getBiddingInfo(nftContract, tokenId)
    
    return {
      owner: info.owner,
      minBid: ethers.formatEther(info.minBid),
      highestBid: ethers.formatEther(info.highestBid),
      highestBidder: info.highestBidder,
      endTime: Number(info.endTime),
      isActive: info.isActive,
      totalBids: Number(info.totalBids)
    }
  } catch (error) {
    console.error('Error getting bidding info:', error)
    return null
  }
}

export async function getBids(nftContract: string, tokenId: number) {
  try {
    const contract = getNFTBiddingContract()
    const bids = await contract.getBids(nftContract, tokenId)
    
    const formattedBids = []
    for (let i = 0; i < bids.bidders.length; i++) {
      formattedBids.push({
        bidder: bids.bidders[i],
        amount: ethers.formatEther(bids.amounts[i]),
        timestamp: Number(bids.timestamps[i]),
        active: bids.active[i],
        message: bids.messages[i]
      })
    }
    
    return formattedBids
  } catch (error) {
    console.error('Error getting bids:', error)
    return []
  }
}

export async function acceptBid(nftContract: string, tokenId: number, signer: ethers.Signer) {
  try {
    const contract = getNFTBiddingContract(signer)
    
    console.log('✅ Accepting bid for NFT:', { nftContract, tokenId })
    
    const tx = await contract.acceptBid(nftContract, tokenId)
    console.log('⏳ Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('✅ Bid accepted successfully!')
    
    return {
      success: true,
      transactionHash: tx.hash,
      receipt
    }
  } catch (error) {
    console.error('Error accepting bid:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function withdrawBid(nftContract: string, tokenId: number, signer: ethers.Signer) {
  try {
    const contract = getNFTBiddingContract(signer)
    
    console.log('💸 Withdrawing bid for NFT:', { nftContract, tokenId })
    
    const tx = await contract.withdrawBid(nftContract, tokenId)
    console.log('⏳ Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('✅ Bid withdrawn successfully!')
    
    return {
      success: true,
      transactionHash: tx.hash,
      receipt
    }
  } catch (error) {
    console.error('Error withdrawing bid:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
