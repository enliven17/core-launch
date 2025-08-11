// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    // NFT contract => tokenId => listing
    mapping(address => mapping(uint256 => Listing)) public listings;
    
    // Platform fee (2.5%)
    uint256 public platformFee = 250; // 2.5% = 250 basis points
    uint256 public constant BASIS_POINTS = 10000;

    event NFTListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(address indexed nftContract, uint256 indexed tokenId, address indexed seller, address buyer, uint256 price);
    event NFTDelisted(address indexed nftContract, uint256 indexed tokenId, address indexed seller);
    event PriceUpdated(address indexed nftContract, uint256 indexed tokenId, uint256 newPrice);

    constructor() Ownable(msg.sender) {}

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than 0");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
        require(IERC721(nftContract).isApprovedForAll(msg.sender, address(this)), "Not approved");

        listings[nftContract][tokenId] = Listing({
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true
        });

        emit NFTListed(nftContract, tokenId, msg.sender, price);
    }

    function purchaseNFT(address nftContract, uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Clear the listing
        delete listings[nftContract][tokenId];

        // Transfer NFT to buyer
        IERC721(nftContract).safeTransferFrom(seller, msg.sender, tokenId);

        // Calculate platform fee
        uint256 platformFeeAmount = (price * platformFee) / BASIS_POINTS;
        uint256 sellerAmount = price - platformFeeAmount;

        // Transfer funds
        payable(seller).transfer(sellerAmount);
        payable(owner()).transfer(platformFeeAmount);

        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit NFTSold(nftContract, tokenId, seller, msg.sender, price);
    }

    function delistNFT(address nftContract, uint256 tokenId) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        delete listings[nftContract][tokenId];
        emit NFTDelisted(nftContract, tokenId, msg.sender);
    }

    function updatePrice(address nftContract, uint256 tokenId, uint256 newPrice) external {
        require(newPrice > 0, "Price must be greater than 0");
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        listing.price = newPrice;
        emit PriceUpdated(nftContract, tokenId, newPrice);
    }

    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) {
        return listings[nftContract][tokenId];
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = newFee;
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Emergency function to rescue stuck NFTs
    function emergencyWithdrawNFT(address nftContract, uint256 tokenId) external onlyOwner {
        require(listings[nftContract][tokenId].active, "Listing not active");
        delete listings[nftContract][tokenId];
    }
}
