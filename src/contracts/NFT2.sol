//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT2 is ERC721URIStorage {
    //auto-increment field for each token
    // using Counters for Counters.Counter;

    // Counters.Counter private _tokenIds;

    address contractAddress;

    constructor(address marketplaceAddress) ERC721("OpenSea Tokens", "OST") {
        contractAddress = marketplaceAddress;
    }

    ///@notice only owner modifier
    modifier onlyOwner(uint256 tokenId) {
        require(msg.sender == ownerOf(tokenId));
        _;
    }

    /// @notice create a new token
    /// @param _tokenId : token ID
    /// @param tokenURI : token URI
    function createToken(uint256 _tokenId, string memory tokenURI)
        public
        returns (uint256)
    {
        //set a new token id for the token to be minted
        // _tokenIds.increment();
        // uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, _tokenId); //mint the token
        _setTokenURI(_tokenId, tokenURI); //generate the URI
        setApprovalForAll(contractAddress, true); //grant transaction permission to marketplace

        //return token ID
        return _tokenId;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI)
        public
        onlyOwner(tokenId)
    {
        _setTokenURI(tokenId, tokenURI);
    }

    function burn(uint256 tokenId) public onlyOwner(tokenId) {
        _burn(tokenId);
    }
}
