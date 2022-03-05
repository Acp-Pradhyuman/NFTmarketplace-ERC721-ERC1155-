//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "@openzeppelin/contracts/utils/Strings.sol";

// contract GameItems is ERC1155, Ownable
contract GameItems1 is ERC1155 {
    mapping(uint256 => string) private _uris;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address contractAddress;

    mapping(uint256 => address) private _owners;

    constructor(address marketplaceAddress) ERC1155("") {
        contractAddress = marketplaceAddress;
    }

    ///@notice only owner modifier
    modifier onlyOwner(uint256 tokenId) {
        require(msg.sender == ownerOf(tokenId));
        _;
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(
            owner != address(0),
            "ERC1155: owner query for nonexistent token"
        );
        return owner;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_uris[tokenId]);
    }

    function setTokenUri(uint256 tokenId, string memory URI)
        public
        onlyOwner(tokenId)
    {
        // require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice");
        _uris[tokenId] = URI;
    }

    /// @notice create a new token
    /// @param _tokenId : token ID
    /// @param tokenURI : token URI
    /// @param amount : amount decides whether the token is a fungible token or a non-fungible token,
    //                  if amount = 1 it's an NFT, else amount greater than 1 then it's a fungible token
    function createToken(
        uint256 _tokenId,
        string memory tokenURI,
        uint256 amount
    ) public returns (uint256) {
        require(!_exists(_tokenId), "ERC1155: token already minted");
        //set a new token id for the token to be minted
        // _tokenIds.increment();
        // uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, _tokenId, amount, ""); //mint the token
        _owners[_tokenId] = msg.sender;
        setTokenUri(_tokenId, tokenURI); //generate the URI
        setApprovalForAll(contractAddress, true); //grant transaction permission to marketplace

        //return token ID
        return _tokenId;
    }

    function burn(uint256 tokenId, uint256 amount) public onlyOwner(tokenId) {
        _burn(msg.sender, tokenId, amount);
    }
}
