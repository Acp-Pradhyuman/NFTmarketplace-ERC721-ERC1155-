# NFTmarketplace (ERC721 & ERC 1155)

A decentralized Opensea smart contract using ERC 721 & ERC 1155 token and ReentrancyGuard of Openzeppelin. It has features like removing and updating ERC 721 and ERC 1155 tokens from the marketplace, and collect royalty which is in nftMarketplace8.sol. Also made a separate NFT marketplace smart contract that accepts payment through any ERC20 tokens like WETH in nftMarketplace9.sol. NFT2.sol is an ERC 721 token and NFT1155_1.sol is an ERC 1155 token. Tether and WETH are ERC20 tokens which is used for testing nftMarketplace9.sol functionalty. And the test cases are done using truffle. NFTmarketplaceWETH.tests.js is the test cases of nftMarketplace9.sol and TestCases.tests.js is the test cases of nftMarketplace8.sol.

## Clone the project

To clone this project, first make sure that node version 10.16.3 or 10.15.3 installed in the system. For this, I would recommend to install Node Version Manager (nvm) in the system. After installing nvm use the command below,

```bash
  nvm install 10.15.3
```
or
```bash
  nvm install 10.16.3
```
then
```bash
  nvm use 10.16.3
```
finally
```bash
  git clone https://github.com/Acp-Pradhyuman/NFTmarketplace-ERC721-ERC1155-.git
```

## Truffle

Truffle test commands
```bash
  truffle test ./test/NFTmarketplaceWETH.tests.js
```
```bash
  truffle test ./test/TestCases.tests.js
```





## Authors

- [@Ashish Kumar Singh](https://github.com/aks-9)
- [@Pradhyumna](https://github.com/Acp-Pradhyuman)
