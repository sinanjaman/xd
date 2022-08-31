const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RIUM", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function getRIUMAndOwner() {
        // Contracts are deployed using the first signer/account by default
        const accounts = await ethers.getSigners();

        const RIUM = await ethers.getContractFactory("RIUM");
        const rium = await RIUM.deploy();

        return { rium, accounts };
    }

    describe("Deployment", function () {
        it("Creates $RIUM with 10^27 total supply", async function () {
            const { rium } = await loadFixture(getRIUMAndOwner);

            expect(
                await rium.totalSupply()
            ).to.equal(10n ** 27n)
        });

        it("with decimals of 18", async function () {
            const { rium } = await loadFixture(getRIUMAndOwner);

            expect(
                await rium.decimals()
            ).to.equal(18)
        });

        it("with name of \"Bitirium\"", async function () {
            const { rium } = await loadFixture(getRIUMAndOwner);

            expect(
                await rium.name()
            ).to.equal("Bitirium")
        });

        it("with symbol of \"RIUM\"", async function () {
            const { rium } = await loadFixture(getRIUMAndOwner);

            expect(
                await rium.name()
            ).to.equal("Bitirium")
        });


        it("and approves all the $RIUM to the deployer address", async function () { /* ? */
            const { rium, accounts } = await loadFixture(getRIUMAndOwner);

            expect(
                await rium.allowance(accounts[0].address, accounts[0].address)
            ).to.equal(await rium.totalSupply())
        });
    })

    describe("Functionalities", function () {
        describe("Buy", function () {
            it("Should swap exact ETH to RIUM", async function () {
                const { rium, accounts } = await loadFixture(getRIUMAndOwner);
                await rium.connect(accounts[1]).buy(accounts[1].address, 1n ** 18n)
                expect(
                    await rium.balanceOf(accounts[1].address)
                ).to.equal(1n ** 18n)
            });

            it("Should emit a Transfer event", async function () {
                const { rium, accounts } = await loadFixture(getRIUMAndOwner);
                expect(
                    await rium.connect(accounts[1]).buy(accounts[1].address, 1n ** 18n)
                ).to.emit(rium, "Transfer").withArgs(ethers.constants.AddressZero, accounts[1].address, 1n ** 18n)
            });
        })

        describe("Sell", function () {
            it("Should swap RIUM to exact ETH", async function () {
                const { rium, accounts } = await loadFixture(getRIUMAndOwner);
                await rium.connect(accounts[1]).buy(accounts[1].address, 10n ** 18n)
                await rium.connect(accounts[1]).sell(accounts[1].address, 1n ** 18n)
                expect(
                    await rium.balanceOf(accounts[1].address)
                ).to.equal(10n ** 18n - 1n ** 18n)
            });

            it("Should emit a Transfer event", async function () {
                const { rium, accounts } = await loadFixture(getRIUMAndOwner);
                await rium.connect(accounts[1]).buy(accounts[1].address, 10n ** 18n)
                expect(
                    await rium.connect(accounts[1]).sell(accounts[1].address, 1n ** 18n)
                ).to.emit(rium, "Transfer").withArgs(accounts[1].address, ethers.constants.AddressZero, 1n ** 18n)
            });
        })

        describe("Approval", function () {
            it("Clients should be approve different adresses for their balance", async function () {
                const { rium, accounts } = await loadFixture(getRIUMAndOwner);
                await rium.connect(accounts[0]).approve(accounts[1].address, 10n ** 18n)
                expect(
                    await rium.allowance(accounts[0].address, accounts[1].address)
                ).to.equal(10n ** 18n)
            });

            it("Should emit an Approval event", async function () {
                const { rium, accounts } = await loadFixture(getRIUMAndOwner);
                expect(
                    await rium.connect(accounts[0]).approve(accounts[1].address, 10n ** 18n)
                ).to.emit(rium, "Approval").withArgs(accounts[0].address, accounts[1].address, 10n ** 18n)
            });
        })
    })
});
