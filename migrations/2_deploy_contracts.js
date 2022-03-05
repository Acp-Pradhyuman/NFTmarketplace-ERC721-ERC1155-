// const Tether = artifacts.require("Tether");
// const RewardToken = artifacts.require("RewardToken");
// const DecentralBank = artifacts.require("DecentralBank");

const Market = artifacts.require("nftMarketplace8");
const NFT721 = artifacts.require("NFT2");
const NFT1155 = artifacts.require("GameItems1");

// const NFTroyalty = artifacts.require("NFTroyalty");


module.exports = async function (deployer, network, accounts) {
    // await deployer.deploy(Tether)
    // const tether = await Tether.deployed()

    await deployer.deploy(Market)
    const market = await Market.deployed()

    await deployer.deploy(NFT721, market.address)
    await deployer.deploy(NFT1155, market.address)
    // const nft = await NFT.deployed();

    // await deployer.deploy(NFTroyalty, "Opensea Token", "OST", "", '100', accounts[2])
    // const nftRoyalty = await NFTroyalty.deployed();


    // constructor(
    //     string memory _name,
    //     string memory _symbol,
    //     string memory _initBaseURI,
    //     uint256 _royalityFee,
    //     address _artist
    // )

    

    // await deployer.deploy(RewardToken)
    // const rewardToken = await RewardToken.deployed()

    // await deployer.deploy(DecentralBank, rewardToken.address, tether.address) // constructor(RewardToken _rewardToken, Tether _tether)
    // const decentralBank = await DecentralBank.deployed()

    // await rewardToken.transfer(decentralBank.address, '1000000000000000000000000') // transfer all reward tokens to decentral bank

    // await tether.transfer(accounts[1], '100000000000000000000') // 100 Tether tokens as a reward to use the application
}