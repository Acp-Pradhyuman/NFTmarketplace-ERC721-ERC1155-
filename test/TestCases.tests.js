const Market = artifacts.require("nftMarketplace8");
const NFT721 = artifacts.require("NFT2");
const NFT1155 = artifacts.require("GameItems1");


require('chai').use(require('chai-as-promised')).should()

contract('NFTmarket', ([owner, customer, customer2, customer3, customer4, customer5]) => {         // contract('DecentralBank', (accounts) =>
    let market, nft1155, nft721, auctionPrice, auctionPrice1, tokenURI721, tokenURI1155, admin, result

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    describe("NFTMarket", function () {
        it("should deploy contracts", async function () {
          market = await Market.new();
          nft1155 = await NFT1155.new(market.address);
          nft721 = await NFT721.new(market.address);
      
          //set an auction price
          auctionPrice = tokens('1');
          auctionPrice1 = tokens('2');

        });




        it("should mint/create tokens, ERC 1155 and ERC 721", async function () {
          //ERC721
          result = await nft721.createToken(1000, "https://www.mytokenlocation.com", {from: customer});
          tokenURI721 = await nft721.tokenURI(1000)
          
          console.log("created token 721 Uri :", tokenURI721)

          //ERC1155
          await nft1155.createToken(1000, "https://www.mygametokenlocation.com", 10, {from: customer});
          tokenURI1155 = await nft1155.uri(1000)
          console.log("created token 1155 Uri :", tokenURI1155)

          
          await nft1155.createToken(1001, "https://www.mygametokenlocation.com", 10, {from: customer2});

          admin = await market.admin()
          console.log("Admin :", admin)
        });




        it("should create market item and change admin", async function () {
          let log = result.logs[0]
          let event = log.args
          console.log(event)
          await market.createMarketItem721(nft721.address, event.tokenId.toString(), auctionPrice, 5, {from: customer});
          //                               address       , tokenId,                   Price       ,royalty

          await market.createMarketItem1155(nft1155.address, 1000, 8, auctionPrice, 5, {from: customer});
          //                                                       amount                 royalty

          await market.updateAdmin(customer5, {from: owner})

          admin = await market.admin()
          console.log("new Admin :", admin)
        });




        it("buy, secondary sale and buy of ERC 1155", async function () {
          await market.removeMarketItem721(nft721.address, 1, {from: customer});
          await market.updateMarketItem721(nft721.address, 1, auctionPrice1, {from: customer});
          await market.buyMarketItem721(nft721.address, 1,  {from: customer2, value: auctionPrice1});

          await market.buyMarketItem1155(nft1155.address, 2,  8, {from: customer2, value: auctionPrice});

        
          
          //customer 2
          await nft721.setApprovalForAll(market.address, true, {from: customer2});
          await market.secondary721sale(nft721.address, 1, auctionPrice, {from: customer2});


          await nft1155.setApprovalForAll(market.address, true, {from: customer2});
          await market.secondary1155sale(nft1155.address, 2, 7, auctionPrice, {from: customer2});

          await market.secondary721buy(nft721.address, 1, {from: customer3, value: auctionPrice})

          await market.secondary1155buy(nft1155.address, 2, 7, {from: customer3, value: auctionPrice})


          
          
        });


        it("secondary sale & buy and tranfer of ERC 1155", async function () {
          //ERC 1155
          await nft1155.setApprovalForAll(market.address, true, {from: customer3});
          await market.secondary1155sale(nft1155.address, 2, 6, auctionPrice, {from: customer3});

          let result = await nft1155.balanceOf(customer3, 1000)
          console.log("customer3 ERC 1155 balanceOf before remove market item : ", result.toString());
          
          //remove market item
          await market.removeMarketItem1155(nft1155.address, 2, 6, {from: customer3});

          result = await nft1155.balanceOf(customer3, 1000)
          console.log("customer3 ERC 1155 balanceOf after remove market item : ", result.toString());

          //update market item
          await market.updateMarketItem1155(nft1155.address, 2, auctionPrice1, 7, {from: customer3});

          result = await nft1155.balanceOf(customer3, 1000)
          console.log("customer3 ERC 1155 balanceOf after update market item : ", result.toString());

          result = await nft1155.balanceOf(market.address, 1000)
          console.log("NFT market place ERC 1155 balanceOf : ", result.toString());

          await market.secondary1155buy(nft1155.address, 2, 5, {from: customer4, value: auctionPrice1})

          await nft1155.setApprovalForAll(market.address, true, {from: customer4});
          await market.transfer1155(nft1155.address, 2, customer2, 2, {from: customer4})
        });




        it("burn token and set token URI of both ERC 1155 and ERC 721. secondary sale & buy of ERC 721", async function () {
          let result = await nft1155.balanceOf(market.address, 1000)
          console.log("NFT market place ERC 1155 balanceOf : ", result.toString());

          result = await nft1155.balanceOf(customer, 1000)
          console.log("customer ERC 1155 balanceOf : ", result.toString());

          
          await nft1155.burn(1000, 2, {from: customer})

          //only the one who created the token can set token URI it, else vm revert
          await nft1155.setTokenUri(1000, "https://www.gametoken.com", {from: customer})
          tokenURI1155 = await nft1155.uri(1000)

          console.log("updated token 1155 URI", tokenURI1155)

          
          //ERC 721
          await nft721.setApprovalForAll(market.address, true, {from: customer3});
          await market.transfer721(nft721.address, 1, customer4, {from: customer3})
          // customer 3 -> customer 4
          await nft721.setApprovalForAll(market.address, true, {from: customer4});
          await market.secondary721sale(nft721.address, 1, auctionPrice, {from: customer4});

          await market.removeMarketItem721(nft721.address, 1, {from: customer4});
          await market.updateMarketItem721(nft721.address, 1, auctionPrice1, {from: customer4});

          await market.secondary721buy(nft721.address, 1, {from: customer2, value: auctionPrice1})

          await nft721.setTokenURI(1000, "https://www.myNFT.com", {from: customer2})
          
          tokenURI721 = await nft721.tokenURI(1000)
          console.log("updated token 721 URI :", tokenURI721)

          //only owner of the token can burn it
          await nft721.burn(1000, {from: customer2})
        });
      });
      


})


