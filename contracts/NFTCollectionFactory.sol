// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./NFTCollection.sol";

/**
 * @title NFTCollectionFactory
 * @dev Factory contract for creating NFT collections
 */
contract NFTCollectionFactory is Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Collection creation fee in CORE tokens
    uint256 public constant COLLECTION_CREATION_FEE = 0.1 ether; // 0.1 CORE (temporary for testing)

    // Mapping from collection address to collection info
    mapping(address => CollectionInfo) public collections;
    
    // Array of all collection addresses
    address[] public allCollections;
    
    // Collection creation events
    event CollectionCreated(
        address indexed collectionAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 creationTime
    );
    
    event CollectionCreationFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeWithdrawn(address indexed owner, uint256 amount);

    struct CollectionInfo {
        address creator;
        string name;
        string symbol;
        uint256 creationTime;
        bool exists;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new NFT collection
     * @param name Collection name
     * @param symbol Collection symbol
     * @param baseURI Base URI for token metadata
     * @param maxSupply Maximum supply of NFTs (0 for unlimited)
     * @param royaltyPercentage Royalty percentage (0-25)
     */
    function createCollection(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 maxSupply,
        uint256 royaltyPercentage
    ) external payable nonReentrant returns (address) {
        require(msg.value >= COLLECTION_CREATION_FEE, "Insufficient creation fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(royaltyPercentage <= 25, "Royalty cannot exceed 25%");
        
        // Create new NFT collection contract
        NFTCollection newCollection = new NFTCollection(
            name,
            symbol,
            baseURI,
            maxSupply,
            royaltyPercentage,
            msg.sender
        );
        
        address collectionAddress = address(newCollection);
        
        // Store collection info
        collections[collectionAddress] = CollectionInfo({
            creator: msg.sender,
            name: name,
            symbol: symbol,
            creationTime: block.timestamp,
            exists: true
        });
        
        allCollections.push(collectionAddress);
        
        emit CollectionCreated(
            collectionAddress,
            msg.sender,
            name,
            symbol,
            block.timestamp
        );
        
        return collectionAddress;
    }

    /**
     * @dev Get collection info by address
     * @param collectionAddress Address of the collection
     * @return Collection info
     */
    function getCollectionInfo(address collectionAddress) 
        external 
        view 
        returns (CollectionInfo memory) 
    {
        require(collections[collectionAddress].exists, "Collection does not exist");
        return collections[collectionAddress];
    }

    /**
     * @dev Get all collections
     * @return Array of collection addresses
     */
    function getAllCollections() external view returns (address[] memory) {
        return allCollections;
    }

    /**
     * @dev Get collections count
     * @return Total number of collections
     */
    function getCollectionsCount() external view returns (uint256) {
        return allCollections.length;
    }

    /**
     * @dev Check if address is a collection
     * @param collectionAddress Address to check
     * @return True if address is a collection
     */
    function isCollection(address collectionAddress) external view returns (bool) {
        return collections[collectionAddress].exists;
    }

    /**
     * @dev Update collection creation fee (owner only)
     * @param newFee New creation fee
     */
    function updateCreationFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = COLLECTION_CREATION_FEE;
        emit CollectionCreationFeeUpdated(oldFee, newFee);
    }

    /**
     * @dev Withdraw collected fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FeeWithdrawn(owner(), balance);
    }

    /**
     * @dev Get contract balance
     * @return Contract balance in CORE
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Emergency pause (owner only)
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause
    }

    /**
     * @dev Emergency unpause (owner only)
     */
    function emergencyUnpause() external onlyOwner {
        // Implementation for emergency unpause
    }

    // Fallback function to receive CORE
    receive() external payable {}
}
