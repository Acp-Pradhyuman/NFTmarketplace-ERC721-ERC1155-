const Market = artifacts.require("nftMarketplace9");
const NFT721 = artifacts.require("NFT2");
const NFT1155 = artifacts.require("GameItems1");
// const Tether = artifacts.require("Tether")
const Tether = artifacts.require("WETH9")


require('chai').use(require('chai-as-promised')).should()

contract('NFTmarket', ([owner, customer, customer2, customer3, customer4, customer5]) => {         // contract('DecentralBank', (accounts) =>
    let market, nft1155, nft721, auctionPrice, auctionPrice1, tokenURI721, tokenURI1155, admin, selector, tether, feeCollector, res

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    describe("NFTMarket", function () {
        it("should deploy contracts", async function () {
          market = await Market.new();
          nft1155 = await NFT1155.new(market.address);
          nft721 = await NFT721.new(market.address);
          tether = await Tether.new();
      
          //set an auction price
          auctionPrice = tokens('1');
          auctionPrice1 = tokens('2');

          await tether.transfer(customer, tokens('100'), { from: owner })
          await tether.transfer(customer2, tokens('100'), { from: owner })
          await tether.transfer(customer3, tokens('100'), { from: owner })
          await tether.transfer(customer4, tokens('100'), { from: owner })

        });




        it("should mint/create tokens, ERC 1155 and ERC 721", async function () {
          //ERC721
          await nft721.createToken(1000, "https://www.mytokenlocation.com", {from: customer});
          tokenURI721 = await nft721.tokenURI(1000)
          console.log("created token 721 Uri :", tokenURI721)

          //ERC1155
          await nft1155.createToken(1000, "https://www.mygametokenlocation.com", 10, {from: customer});
          tokenURI1155 = await nft1155.uri(1000)
          console.log("created token 1155 Uri :", tokenURI1155)

          await nft1155.createToken(1000, "https://www.mygametokenlocation.com", 10, {from: customer2}).should.be.rejected;

          admin = await market.admin()
          console.log("Admin :", admin)
        });




        it("should create market item and change admin", async function () {
          //customer is the creator of the NFT hence the customer must get a royalty of 5% in future
          res = await market.createMarketItem721WETH(nft721.address, 1000, auctionPrice, 5, tether.address, {from: customer});
          //                                         address       ,tokenId, Price     ,royalty, tokenToPurchase
          
          await market.createMarketItem1155WETH(nft1155.address, 1000, 8, auctionPrice, 5, tether.address, {from: customer});
          //                                                           amount                 royalty

          await market.updateAdmin(customer5, {from: owner})

          admin = await market.admin()
          console.log("new Admin :", admin)
        });




        it("buy, secondary sale and buy of ERC 1155", async function () {
          const log = res.logs[0]
          const event = log.args
          await market.removeMarketItem721WETH(nft721.address, Number(event.marketItemId), {from: customer});
          await market.updateMarketItem721WETH(nft721.address, 1, auctionPrice1, {from: customer});

          let admin = await market.admin()
          console.log("admin :", admin)

          let allMarketItems = await market.allMarketItems(1)
          console.log("allMarketItems :", allMarketItems.seller)

          let platformCommission = await market.platformCommission()
          console.log("platform commission :", platformCommission.toString())

          let commission = (Number(platformCommission.toString()) * Number(allMarketItems.price.toString())) / 100;
          console.log("commission :", commission)

          let sellerShare = ((100 - Number(platformCommission.toString())) * Number(allMarketItems.price.toString())) / 100;
          console.log("seller share :", sellerShare)

          await tether.approve(market.address, allMarketItems.price.toString(), {from : customer2})
          await market.buyMarketItem721WETH(tether.address, allMarketItems.price.toString(), nft721.address, 1,  {from: customer2});

          let balance = await tether.balanceOf(customer2)
          console.log("Tether balance of customer2 :", balance.toString())

          balance = await tether.balanceOf(market.address)
          console.log("Tether balance of marketplace :",balance.toString())

          balance = await tether.balanceOf(allMarketItems.seller)
          console.log("Tether balance of seller :",balance.toString())

          balance = await tether.balanceOf(admin)
          console.log("Tether balance of admin :",balance.toString())

          allMarketItems = await market.allMarketItems(2)
          console.log("allMarketItems :", allMarketItems.seller)

          await tether.approve(market.address, allMarketItems.price.toString(), {from : customer2})
          await market.buyMarketItem1155WETH(tether.address, allMarketItems.price.toString(), nft1155.address, 2,  8, {from: customer2})

          balance = await tether.balanceOf(customer2)
          console.log("Tether balance of customer2 after ERC1155 token purchase :", balance.toString())

          balance = await tether.balanceOf(market.address)
          console.log("Tether balance of marketplace after ERC1155 token purchase :",balance.toString())

          balance = await tether.balanceOf(allMarketItems.seller)
          console.log("Tether balance of seller after ERC1155 token purchase :",balance.toString())

          balance = await tether.balanceOf(admin)
          console.log("Tether balance of admin after ERC1155 token purchase :",balance.toString())

        
          
          //customer 2
          await nft721.setApprovalForAll(market.address, true, {from: customer2});
          await market.secondary721saleWETH(nft721.address, 1, auctionPrice, {from: customer2});


          await nft1155.setApprovalForAll(market.address, true, {from: customer2});
          await market.secondary1155saleWETH(nft1155.address, 2, 7, auctionPrice, {from: customer2});


          await tether.approve(market.address, auctionPrice, {from : customer3})
          await market.secondary721buyWETH(auctionPrice, nft721.address, 1, {from: customer3})
          
          await tether.approve(market.address, auctionPrice, {from : customer3})
          await market.secondary1155buyWETH(auctionPrice, nft1155.address, 2, 7, {from: customer3})


          
          
        });


        it("secondary sale & buy and tranfer of ERC 1155", async function () {
          //ERC 1155
          await nft1155.setApprovalForAll(market.address, true, {from: customer3});
          await market.secondary1155saleWETH(nft1155.address, 2, 6, auctionPrice, {from: customer3});

          //remove market item
          //function removeMarketItem1155(address _nftContract, uint256 _marketItemId)

          let result = await nft1155.balanceOf(customer3, 1000)
          console.log("customer3 ERC 1155 balanceOf before remove market item : ", result.toString());
          
          //remove market item
          await market.removeMarketItem1155WETH(nft1155.address, 2, 6, {from: customer3});

          result = await nft1155.balanceOf(customer3, 1000)
          console.log("customer3 ERC 1155 balanceOf after remove market item : ", result.toString());

          //update market item
          await market.updateMarketItem1155WETH(nft1155.address, 2, auctionPrice1, 7, {from: customer3});

          result = await nft1155.balanceOf(customer3, 1000)
          console.log("customer3 ERC 1155 balanceOf after update market item : ", result.toString());

          result = await nft1155.balanceOf(market.address, 1000)
          console.log("NFT market place ERC 1155 balanceOf : ", result.toString());
          
          await tether.approve(market.address, auctionPrice1, {from : customer4})
          await market.secondary1155buyWETH(auctionPrice1, nft1155.address, 2, 5, {from: customer4})

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
          await market.secondary721saleWETH(nft721.address, 1, auctionPrice, {from: customer4});


          await market.removeMarketItem721WETH(nft721.address, 1, {from: customer4});
          await market.updateMarketItem721WETH(nft721.address, 1, auctionPrice1, {from: customer4});

          await tether.approve(market.address, auctionPrice1, {from : customer2})
          await market.secondary721buyWETH(auctionPrice1, nft721.address, 1, {from: customer2})
          

          await nft721.setTokenURI(1000, "https://www.myNFT.com", {from: customer2})
          
          tokenURI721 = await nft721.tokenURI(1000)
          console.log("updated token 721 URI :", tokenURI721)

          //only owner of the token can burn it
          await nft721.burn(1000, {from: customer2})

        });
      });
      


})


