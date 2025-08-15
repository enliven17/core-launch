import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, NETWORK_CONFIG } from './constants'

declare global {
  interface Window {
    ethereum?: any
  }
}

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

export function getNFTCollectionFactoryContract(signer?: ethers.Signer) {
  const provider = signer ? signer.provider : getProvider()
  const contractSigner = signer || provider
  
  return new ethers.Contract(
    CONTRACT_ADDRESSES.NFT_COLLECTION_FACTORY,
    CONTRACT_ABIS.NFT_COLLECTION_FACTORY,
    contractSigner
  )
}

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
    
    const creationFee = ethers.parseEther('1')
    
    const tx = await contract.createCollection(
      name,
      symbol,
      baseURI,
      maxSupply,
      royaltyPercentage,
      { value: creationFee }
    )
    
    const receipt = await tx.wait()
    
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

export async function getAllCollections() {
  try {
    console.log('🔍 Getting all collections from factory...')
    const contract = getNFTCollectionFactoryContract()
    const collections = await contract.getAllCollections()
    console.log('✅ Collections loaded:', collections.length)
    return collections
  } catch (error) {
    console.error('❌ Error getting all collections:', error)
    return []
  }
}

export async function getCollectionInfo(collectionAddress: string) {
  try {
    console.log('🔍 Getting collection info for:', collectionAddress)
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
      exists: info.exists || true
    }
  } catch (error) {
    console.error('❌ Error getting collection info for', collectionAddress, ':', error)
    return null
  }
}

export async function getCollectionsCount() {
  try {
    console.log('🔍 Getting collections count...')
    const contract = getNFTCollectionFactoryContract()
    const count = await contract.getCollectionsCount()
    console.log('✅ Collections count:', count.toString())
    return parseInt(count.toString())
  } catch (error) {
    console.error('❌ Error getting collections count:', error)
    return 0
  }
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
    
    const owners = new Set()
    for (let i = 1; i <= totalSupplyNum; i++) {
      try {
        const owner = await collectionContract.ownerOf(i)
        owners.add(owner.toLowerCase())
      } catch (err) {
        break
      }
    }
    
    return {
      totalSupply: totalSupplyNum,
      uniqueOwners: owners.size,
      volume: '0.0'
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

export async function mintNFT(
  collectionAddress: string,
  to: string,
  tokenURI: string,
  mintPrice: bigint
) {
  try {
    const signer = await getSigner()
    
    const collectionContract = new ethers.Contract(
      collectionAddress,
      [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function balanceOf(address owner) view returns (uint256)",
        "function publicMint(address to, string memory tokenURI) external payable returns (uint256)"
      ],
      signer
    )
    
    console.log('🪙 Minting NFT with price:', ethers.formatEther(mintPrice), 'CORE')
    
    const tx = await collectionContract.publicMint(to, tokenURI, { value: mintPrice })
    console.log('⏳ Mint transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('✅ NFT minted successfully!')
    
    return {
      success: true,
      transactionHash: tx.hash,
      receipt
    }
  } catch (error) {
    console.error('Error minting NFT:', error)
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
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return {
        success: false,
        error: 'Invalid bid amount. Must be greater than 0.'
      }
    }
    
    const amountWei = ethers.parseEther(amount)
    
    console.log('💰 Placing bid:', { nftContract, tokenId, amount, message })
    
    const tx = await contract.placeBid(nftContract, tokenId, message, { value: amountWei })
    console.log('⏳ Bid transaction sent:', tx.hash)
    
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

export async function acceptBid(
  nftContract: string,
  tokenId: number,
  signer: ethers.Signer
) {
  try {
    const contract = getNFTBiddingContract(signer)
    
    console.log('✅ Accepting bid for NFT:', { nftContract, tokenId })
    
    const tx = await contract.acceptBid(nftContract, tokenId)
    console.log('⏳ Accept bid transaction sent:', tx.hash)
    
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

export async function withdrawBid(
  nftContract: string,
  tokenId: number,
  signer: ethers.Signer
) {
  try {
    const contract = getNFTBiddingContract(signer)
    
    console.log('↶ Withdrawing bid for NFT:', { nftContract, tokenId })
    
    const tx = await contract.withdrawBid(nftContract, tokenId)
    console.log('⏳ Withdraw bid transaction sent:', tx.hash)
    
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
          owner: owner.toLowerCase(),
          price: '0',
          forSale: false
        })
      } catch (err) {
        console.warn(`Error getting NFT ${i}:`, err)
        break
      }
    }

    return nfts
  } catch (error) {
    console.error('Error getting collection NFTs:', error)
    return []
  }
}

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

function getNFTBiddingContract(signer?: ethers.Signer) {
  const provider = signer ? signer.provider : getProvider()
  const contractSigner = signer || provider
  
  return new ethers.Contract(
    CONTRACT_ADDRESSES.NFT_BIDDING,
    CONTRACT_ABIS.NFT_BIDDING,
    contractSigner
  )
}

export async function approveNFTForBidding(
  nftContract: string,
  tokenId: number,
  signer: ethers.Signer
) {
  try {
    const nftContractInstance = new ethers.Contract(
      nftContract,
      [
        "function approve(address to, uint256 tokenId) external",
        "function getApproved(uint256 tokenId) external view returns (address)"
      ],
      signer
    )

    const biddingContractAddress = CONTRACT_ADDRESSES.NFT_BIDDING
    console.log('✅ Approving NFT for bidding contract:', biddingContractAddress)

    const tx = await nftContractInstance.approve(biddingContractAddress, tokenId)
    console.log('⏳ Approval transaction sent:', tx.hash)

    const receipt = await tx.wait()
    console.log('✅ NFT approved successfully!')

    return {
      success: true,
      transactionHash: tx.hash,
      receipt
    }
  } catch (error) {
    console.error('Error approving NFT for bidding:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function checkNFTApproval(
  nftContract: string,
  tokenId: number,
  owner: string
): Promise<boolean> {
  try {
    const nftContractInstance = new ethers.Contract(
      nftContract,
      [
        "function getApproved(uint256 tokenId) external view returns (address)",
        "function isApprovedForAll(address owner, address operator) external view returns (bool)"
      ],
      getProvider()
    )

    const approvedAddress = await nftContractInstance.getApproved(tokenId)
    const biddingContractAddress = CONTRACT_ADDRESSES.NFT_BIDDING

    if (approvedAddress.toLowerCase() === biddingContractAddress.toLowerCase()) {
      return true
    }

    const isApprovedForAll = await nftContractInstance.isApprovedForAll(owner, biddingContractAddress)
    return isApprovedForAll
  } catch (error) {
    console.error('Error checking NFT approval:', error)
    return false
  }
}
