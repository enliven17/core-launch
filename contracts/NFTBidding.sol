// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTBidding is ReentrancyGuard, Ownable {
    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
        string message;
    }
    
    struct NFTBiddingInfo {
        address nftContract;
        uint256 tokenId;
        address owner;
        uint256 minBid;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool isActive;
        Bid[] bids;
        mapping(address => uint256) bidderTotalBids;
    }
    
    // NFT => Bidding Info
    mapping(bytes32 => NFTBiddingInfo) public nftBiddings;
    
    // Events
    event BiddingStarted(
        address indexed nftContract, 
        uint256 indexed tokenId, 
        address indexed owner, 
        uint256 minBid, 
        uint256 endTime
    );
    
    event BidPlaced(
        address indexed nftContract, 
        uint256 indexed tokenId, 
        address indexed bidder, 
        uint256 amount, 
        string message
    );
    
    event BidAccepted(
        address indexed nftContract, 
        uint256 indexed tokenId, 
        address indexed bidder, 
        uint256 amount
    );
    
    event BiddingCancelled(
        address indexed nftContract, 
        uint256 indexed tokenId, 
        address indexed owner
    );
    
    event BidWithdrawn(
        address indexed nftContract, 
        uint256 indexed tokenId, 
        address indexed bidder, 
        uint256 amount
    );
    
    // Platform fee (1%)
    uint256 public platformFee = 100; // 1% = 100 basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // Minimum bidding duration (1 hour)
    uint256 public constant MIN_BIDDING_DURATION = 1 hours;
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Start bidding for an NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID to bid on
     * @param minBid Minimum bid amount in CORE
     * @param duration Bidding duration in seconds
     * @param message Optional message for the bid
     */
    function startBidding(
        address nftContract, 
        uint256 tokenId, 
        uint256 minBid, 
        uint256 duration,
        string memory message
    ) external {
        require(minBid > 0, "Min bid must be greater than 0");
        require(duration >= MIN_BIDDING_DURATION, "Duration too short");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
        require(IERC721(nftContract).isApprovedForAll(msg.sender, address(this)), "Not approved");
        
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        require(!nftBiddings[nftKey].isActive, "Bidding already active");
        
        NFTBiddingInfo storage bidding = nftBiddings[nftKey];
        bidding.nftContract = nftContract;
        bidding.tokenId = tokenId;
        bidding.owner = msg.sender;
        bidding.minBid = minBid;
        bidding.highestBid = 0;
        bidding.highestBidder = address(0);
        bidding.endTime = block.timestamp + duration;
        bidding.isActive = true;
        
        // Add initial bid from owner
        Bid memory initialBid = Bid({
            bidder: msg.sender,
            amount: 0,
            timestamp: block.timestamp,
            isActive: true,
            message: message
        });
        bidding.bids.push(initialBid);
        
        emit BiddingStarted(nftContract, tokenId, msg.sender, minBid, bidding.endTime);
    }
    
    /**
     * @dev Place a bid on an NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID to bid on
     * @param message Optional message for the bid
     */
    function placeBid(
        address nftContract, 
        uint256 tokenId, 
        string memory message
    ) external payable nonReentrant {
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        NFTBiddingInfo storage bidding = nftBiddings[nftKey];
        
        require(bidding.isActive, "Bidding not active");
        require(block.timestamp < bidding.endTime, "Bidding ended");
        require(msg.sender != bidding.owner, "Owner cannot bid");
        require(msg.value >= bidding.minBid, "Bid too low");
        require(msg.value > bidding.highestBid, "Bid not higher than current highest");
        
        // Refund previous highest bidder if exists
        if (bidding.highestBidder != address(0)) {
            payable(bidding.highestBidder).transfer(bidding.highestBid);
        }
        
        // Update highest bid
        bidding.highestBid = msg.value;
        bidding.highestBidder = msg.sender;
        
        // Add new bid
        Bid memory newBid = Bid({
            bidder: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            isActive: true,
            message: message
        });
        bidding.bids.push(newBid);
        bidding.bidderTotalBids[msg.sender] += msg.value;
        
        emit BidPlaced(nftContract, tokenId, msg.sender, msg.value, message);
    }
    
    /**
     * @dev Accept the highest bid and transfer NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     */
    function acceptBid(address nftContract, uint256 tokenId) external nonReentrant {
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        NFTBiddingInfo storage bidding = nftBiddings[nftKey];
        
        require(bidding.isActive, "Bidding not active");
        require(msg.sender == bidding.owner, "Only owner can accept");
        require(bidding.highestBidder != address(0), "No bids to accept");
        require(block.timestamp >= bidding.endTime, "Bidding not ended yet");
        
        // Calculate platform fee
        uint256 platformFeeAmount = (bidding.highestBid * platformFee) / BASIS_POINTS;
        uint256 ownerAmount = bidding.highestBid - platformFeeAmount;
        
        // Transfer NFT to highest bidder
        IERC721(nftContract).safeTransferFrom(bidding.owner, bidding.highestBidder, tokenId);
        
        // Transfer funds
        payable(bidding.owner).transfer(ownerAmount);
        payable(owner()).transfer(platformFeeAmount);
        
        // Close bidding
        bidding.isActive = false;
        
        emit BidAccepted(nftContract, tokenId, bidding.highestBidder, bidding.highestBid);
    }
    
    /**
     * @dev Cancel bidding (only owner, before any bids)
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     */
    function cancelBidding(address nftContract, uint256 tokenId) external {
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        NFTBiddingInfo storage bidding = nftBiddings[nftKey];
        
        require(bidding.isActive, "Bidding not active");
        require(msg.sender == bidding.owner, "Only owner can cancel");
        require(bidding.highestBidder == address(0), "Cannot cancel after bids");
        
        bidding.isActive = false;
        
        emit BiddingCancelled(nftContract, tokenId, msg.sender);
    }
    
    /**
     * @dev Withdraw bid (only if bidding is cancelled or ended without acceptance)
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     */
    function withdrawBid(address nftContract, uint256 tokenId) external nonReentrant {
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        NFTBiddingInfo storage bidding = nftBiddings[nftKey];
        
        require(!bidding.isActive, "Bidding still active");
        require(bidding.highestBidder != address(0), "No bids to withdraw");
        
        uint256 bidAmount = 0;
        
        // Find user's highest bid
        for (uint i = bidding.bids.length - 1; i >= 0; i--) {
            if (bidding.bids[i].bidder == msg.sender && bidding.bids[i].isActive) {
                bidAmount = bidding.bids[i].amount;
                bidding.bids[i].isActive = false;
                break;
            }
        }
        
        require(bidAmount > 0, "No active bid found");
        
        // Refund bid
        payable(msg.sender).transfer(bidAmount);
        
        emit BidWithdrawn(nftContract, tokenId, msg.sender, bidAmount);
    }
    
    /**
     * @dev Get bidding info for an NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     * @return owner Owner address
     * @return minBid Minimum bid amount
     * @return highestBid Current highest bid
     * @return highestBidder Current highest bidder
     * @return endTime Bidding end time
     * @return isActive Whether bidding is active
     * @return totalBids Total number of bids
     */
    function getBiddingInfo(address nftContract, uint256 tokenId) external view returns (
        address owner,
        uint256 minBid,
        uint256 highestBid,
        address highestBidder,
        uint256 endTime,
        bool isActive,
        uint256 totalBids
    ) {
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        NFTBiddingInfo storage bidding = nftBiddings[nftKey];
        
        return (
            bidding.owner,
            bidding.minBid,
            bidding.highestBid,
            bidding.highestBidder,
            bidding.endTime,
            bidding.isActive,
            bidding.bids.length
        );
    }
    
    /**
     * @dev Get all bids for an NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     * @return bidders Array of bidder addresses
     * @return amounts Array of bid amounts
     * @return timestamps Array of bid timestamps
     * @return active Array of bid active status
     * @return messages Array of bid messages
     */
    function getBids(address nftContract, uint256 tokenId) external view returns (
        address[] memory bidders,
        uint256[] memory amounts,
        uint256[] memory timestamps,
        bool[] memory active,
        string[] memory messages
    ) {
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        NFTBiddingInfo storage bidding = nftBiddings[nftKey];
        
        uint256 bidCount = bidding.bids.length;
        bidders = new address[](bidCount);
        amounts = new uint256[](bidCount);
        timestamps = new uint256[](bidCount);
        active = new bool[](bidCount);
        messages = new string[](bidCount);
        
        for (uint i = 0; i < bidCount; i++) {
            bidders[i] = bidding.bids[i].bidder;
            amounts[i] = bidding.bids[i].amount;
            timestamps[i] = bidding.bids[i].timestamp;
            active[i] = bidding.bids[i].isActive;
            messages[i] = bidding.bids[i].message;
        }
    }
    
    /**
     * @dev Get user's total bids for an NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     * @param user User address
     * @return Total bid amount
     */
    function getUserTotalBids(address nftContract, uint256 tokenId, address user) external view returns (uint256) {
        bytes32 nftKey = keccak256(abi.encodePacked(nftContract, tokenId));
        return nftBiddings[nftKey].bidderTotalBids[user];
    }
    
    /**
     * @dev Set platform fee (owner only)
     * @param newFee New fee in basis points
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee cannot exceed 5%");
        platformFee = newFee;
    }
    
    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Emergency function to rescue stuck funds
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Fallback function to receive CORE
    receive() external payable {}
}
