// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFTCollection
 * @dev Simplified ERC-721 NFT collection contract with minting functionality
 */
contract NFTCollection is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Token counter
    uint256 private _tokenIds;
    
    // Collection metadata
    string private _baseTokenURI;
    uint256 private _maxSupply;
    uint256 private _royaltyPercentage;
    address private _creator;
    
    // Minting settings
    uint256 public mintPrice;
    bool public mintingEnabled;
    bool public publicMintingEnabled;
    
    // Token URI mapping
    mapping(uint256 => string) private _tokenURIs;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event MintingToggled(bool enabled);
    event PublicMintingToggled(bool enabled);
    event RoyaltyUpdated(uint256 oldPercentage, uint256 newPercentage);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 maxSupply,
        uint256 royaltyPercentage,
        address creator
    ) ERC721(name, symbol) Ownable(creator) {
        _baseTokenURI = baseURI;
        _maxSupply = maxSupply;
        _royaltyPercentage = royaltyPercentage;
        _creator = creator;
        mintingEnabled = true;
        publicMintingEnabled = true; // Enable public minting by default
        mintPrice = 0.5 ether; // Set mint price to 0.5 CORE
    }

    /**
     * @dev Mint a new NFT
     * @param to Address to mint to
     * @param tokenURI Token metadata URI
     */
    function mint(address to, string memory tokenURI) 
        external 
        onlyOwner 
        nonReentrant 
        returns (uint256) 
    {
        require(mintingEnabled, "Minting is disabled");
        require(_maxSupply == 0 || _tokenIds < _maxSupply, "Max supply reached");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit NFTMinted(to, newTokenId, tokenURI);
        
        return newTokenId;
    }

    /**
     * @dev Public minting function
     * @param to Address to mint to
     * @param tokenURI Token metadata URI
     */
    function publicMint(address to, string memory tokenURI) 
        external 
        payable 
        nonReentrant 
        returns (uint256) 
    {
        require(publicMintingEnabled, "Public minting is disabled");
        require(mintingEnabled, "Minting is disabled");
        require(_maxSupply == 0 || _tokenIds < _maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient mint price");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit NFTMinted(to, newTokenId, tokenURI);
        
        return newTokenId;
    }

    /**
     * @dev Batch mint multiple NFTs
     * @param to Address to mint to
     * @param tokenURIs Array of token metadata URIs
     */
    function batchMint(address to, string[] memory tokenURIs) 
        external 
        onlyOwner 
        nonReentrant 
        returns (uint256[] memory) 
    {
        require(mintingEnabled, "Minting is disabled");
        require(_maxSupply == 0 || _tokenIds + tokenURIs.length <= _maxSupply, "Max supply would be exceeded");
        
        uint256[] memory newTokenIds = new uint256[](tokenURIs.length);
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _tokenIds++;
            uint256 newTokenId = _tokenIds;
            
            _safeMint(to, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            
            newTokenIds[i] = newTokenId;
            
            emit NFTMinted(to, newTokenId, tokenURIs[i]);
        }
        
        return newTokenIds;
    }

    /**
     * @dev Get royalty info for a token
     * @param tokenId Token ID
     * @param salePrice Sale price
     * @return receiver and royalty amount
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) 
        external 
        view 
        returns (address receiver, uint256 royaltyAmount) 
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        receiver = _creator;
        royaltyAmount = (salePrice * _royaltyPercentage) / 1000; // Basis points
    }

    /**
     * @dev Get collection info
     * @return collectionName Collection name
     * @return collectionSymbol Collection symbol
     * @return collectionTotalSupply Total supply
     * @return collectionMaxSupply Max supply
     * @return collectionCreator Creator address
     * @return collectionRoyaltyPercentage Royalty percentage
     */
    function getCollectionInfo() 
        external 
        view 
        returns (
            string memory collectionName,
            string memory collectionSymbol,
            uint256 collectionTotalSupply,
            uint256 collectionMaxSupply,
            address collectionCreator,
            uint256 collectionRoyaltyPercentage
        ) 
    {
        return (
            name(),
            symbol(),
            _tokenIds,
            _maxSupply,
            _creator,
            _royaltyPercentage
        );
    }

    /**
     * @dev Update mint price (owner only)
     * @param newPrice New mint price
     */
    function updateMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice);
    }

    /**
     * @dev Toggle minting (owner only)
     * @param enabled Whether minting should be enabled
     */
    function toggleMinting(bool enabled) external onlyOwner {
        mintingEnabled = enabled;
        emit MintingToggled(enabled);
    }

    /**
     * @dev Set mint price (owner only)
     * @param newPrice New mint price in wei
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice);
    }

    /**
     * @dev Toggle public minting (owner only)
     * @param enabled Whether public minting should be enabled
     */
    function togglePublicMinting(bool enabled) external onlyOwner {
        publicMintingEnabled = enabled;
        emit PublicMintingToggled(enabled);
    }

    /**
     * @dev Update royalty percentage (owner only)
     * @param newPercentage New royalty percentage (0-25)
     */
    function updateRoyaltyPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 25, "Royalty cannot exceed 25%");
        uint256 oldPercentage = _royaltyPercentage;
        _royaltyPercentage = newPercentage;
        emit RoyaltyUpdated(oldPercentage, newPercentage);
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get base URI
     * @return Base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Update base URI (owner only)
     * @param newBaseURI New base URI
     */
    function updateBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /**
     * @dev Set token URI
     * @param tokenId Token ID
     * @param tokenURI Token metadata URI
     */
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _tokenURIs[tokenId] = tokenURI;
    }

    /**
     * @dev Get token URI
     * @param tokenId Token ID
     * @return Token metadata URI
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override 
        returns (string memory) 
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        string memory uri = _tokenURIs[tokenId];
        if (bytes(uri).length > 0) {
            return uri;
        }
        
        return string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }

    /**
     * @dev Get total supply
     * @return Total number of tokens minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }

    // Emergency functions
    function emergencyPause() external onlyOwner {
        mintingEnabled = false;
        publicMintingEnabled = false;
    }

    function emergencyUnpause() external onlyOwner {
        mintingEnabled = true;
        // Note: publicMintingEnabled remains false for security
    }
}
