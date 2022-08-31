const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bitirium", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function getContractsAndAccounts() {
    // Contracts are deployed using the first signer/account by default
    const accounts = await ethers.getSigners();

    const Bitirium = await ethers.getContractFactory("Bitirium");
    const bitirium = await Bitirium.deploy();

    const RIUM = await ethers.getContractFactory("RIUM");
    const rium = await RIUM.deploy();

    return { bitirium, rium, accounts };
  }

  describe("Deployment", function () {
    it("Should set the contract deployers address as admin", async function () {
      const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

      expect(
        await bitirium.isAdmin(accounts[0].address)
      ).to.equal(true);
    });
  });

  describe("Functionalities", function () {
    describe("User", function () {
      it("Should return true if user exists", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        expect(
          await bitirium.isUser(accounts[0].address)
        ).to.equal(true);
      });

      it("Should return false if user doesn't exist", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        expect(
          await bitirium.isUser(accounts[1].address)
        ).to.equal(false);
      });

      it("Non-users should be able to create account on the dApp", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        await bitirium.connect(accounts[1]).createUser();
        expect(
          await bitirium.isUser(accounts[1].address)
        ).to.equal(true);
      })

      describe("Deposit", function () {
        it("Users can deposit", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);
          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });

          expect(
            await bitirium.getBalance(accounts[0].address)
          ).to.equal(10n ** 18n);
        });

        it("Should throw when non-users try to deposit", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await expect(
            bitirium.connect(accounts[1]).deposit({ value: 10n ** 18n })
          ).to.be.revertedWith("Only users can make this happen.");
        });

        it("Should emit a Deposit event", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await expect(
            await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n })
          ).to.emit(bitirium, "Deposit").withArgs(accounts[0].address, 10n ** 18n)
        });
      })

      describe("Withdraw", function () {
        it("Users can withdraw", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          expect(
            await bitirium.connect(accounts[0]).withdraw(1n ** 18n)
          ).to.be.ok;
        });

        it("Users can withdraw all their balance", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          expect(
            await bitirium.connect(accounts[0]).withdrawAll()
          ).to.be.ok;
        });

        it("Should throw when users try to withdraw more than their balance", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await bitirium.connect(accounts[0]).deposit({ value: 1n ** 18n });
          await expect(
            bitirium.connect(accounts[0]).withdraw(2n ** 18n)
          ).to.be.revertedWith("Are you trying to rob me?");
        });

        it("Should throw when non-users try to withdraw", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await expect(
            bitirium.connect(accounts[1]).withdraw(1n ** 18n)
          ).to.be.revertedWith("Only users can make this happen.");
        });

        it("Should emit a Withdraw event", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);
          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          await expect(
            await bitirium.connect(accounts[0]).withdraw(1n ** 18n)
          ).to.emit(bitirium, "Withdraw").withArgs(accounts[0].address, 1n ** 18n)
        });
      })

      describe("WithdrawAll", function () {
        it("Users can withdraw all their balance", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          expect(
            await bitirium.connect(accounts[0]).withdrawAll()
          ).to.be.ok;
        });

        it("Should throw when non-users try to withdraw", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await expect(
            bitirium.connect(accounts[1]).withdrawAll()
          ).to.be.revertedWith("Only users can make this happen.");
        });

        it("Should emit a Withdraw event", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);
          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          await expect(
            await bitirium.connect(accounts[0]).withdrawAll()
          ).to.emit(bitirium, "Withdraw").withArgs(accounts[0].address, 10n ** 18n)
        });
      })

      describe("Transfer", function () {
        it("Users can transfer ETH to other users", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);
          await bitirium.connect(accounts[1]).createUser();
          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          expect(
            await bitirium.connect(accounts[0]).transferEth(accounts[1].address, 1n ** 18n)
          ).to.be.ok;
        });

        it("Users should be able to receive ETH sent to them", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);
          await bitirium.connect(accounts[1]).createUser();
          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          await bitirium.connect(accounts[0]).transferEth(accounts[1].address, 1n ** 18n)
          expect(
            await bitirium.getBalance(accounts[1].address)
          ).to.equal(1n ** 18n);
        });

        it("Should throw when users try to transfer more than their balance", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await bitirium.connect(accounts[0]).deposit({ value: 1n ** 18n });
          await bitirium.connect(accounts[1]).createUser();
          await expect(
            bitirium.connect(accounts[0]).transferEth(accounts[1].address, 2n ** 18n)
          ).to.be.revertedWith("Not enough ETH.");
        });

        it("Should throw when non-users try to transfer", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await expect(
            bitirium.connect(accounts[1]).transferEth(accounts[1].address, 1n ** 18n)
          ).to.be.revertedWith("Only users can make this happen.");
        });

        it("Should emit a Transfer event", async function () {
          const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

          await bitirium.connect(accounts[0]).deposit({ value: 10n ** 18n });
          await expect(
            bitirium.connect(accounts[0]).transferEth(accounts[1].address, 1n ** 18n)
          ).to.emit(bitirium, "Transfer").withArgs(accounts[0].address, accounts[1].address, 1n ** 18n)
        });
      })

      describe("$RIUM", function () {
        describe("Buy", function () {
          it("Users should be able to buy RIUM", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);

            await bitirium.connect(accounts[1]).createUser();
            await bitirium.connect(accounts[1]).deposit({ value: 10n ** 18n });
            await bitirium.connect(accounts[1]).buyRiumForExactEth(rium.address, 1n ** 18n);
            expect(
              await rium.balanceOf(accounts[1].address)
            ).to.equal(1n ** 18n);
          });

          it("Should throw when users try to buy RIUM worth more than their ETH balance", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);
            await bitirium.connect(accounts[1]).createUser();
            await bitirium.connect(accounts[1]).deposit({ value: 1n ** 18n });
            await expect(
              bitirium.connect(accounts[1]).buyRiumForExactEth(rium.address, 10n ** 18n)
            ).to.be.revertedWith("Not enough ETH.");
          });

          it("Should throw when non-users try to buy RIUM", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);

            await expect(
              bitirium.connect(accounts[1]).buyRiumForExactEth(rium.address, 1n ** 18n)
            ).to.be.revertedWith("Only users can make this happen.");
          });

          it("Should emit a Transfer event", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);

            await bitirium.connect(accounts[1]).createUser();
            await bitirium.connect(accounts[1]).deposit({ value: 10n ** 18n });
            await expect(
              bitirium.connect(accounts[1]).buyRiumForExactEth(rium.address, 1n ** 18n)
            ).to.emit(bitirium, "Transfer").withArgs(accounts[1].address, ethers.constants.AddressZero, 1n ** 18n)
          });
        })

        describe("Sell", function () {
          it("Users should be able to sell RIUM", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);

            await bitirium.connect(accounts[1]).createUser();
            await bitirium.connect(accounts[1]).deposit({ value: 10n ** 18n });
            await bitirium.connect(accounts[1]).buyRiumForExactEth(rium.address, 1n ** 18n);
            await bitirium.connect(accounts[1]).sellRiumForExactEth(rium.address, 1n ** 18n);
            expect(
              await rium.balanceOf(accounts[1].address)
            ).to.equal(0n ** 18n);
          });

          it("Should throw when users try to sell RIUM worth more than their balance", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);
            await bitirium.connect(accounts[1]).createUser();
            await bitirium.connect(accounts[1]).deposit({ value: 1n ** 18n });
            await bitirium.connect(accounts[1]).buyRiumForExactEth(rium.address, 1n ** 18n);
            await expect(
              bitirium.connect(accounts[1]).sellRiumForExactEth(rium.address, 10n ** 18n)
            ).to.be.revertedWith("Not enough RIUM.");
          });

          it("Should throw when non-users try to sell RIUM", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);

            await expect(
              bitirium.connect(accounts[1]).sellRiumForExactEth(rium.address, 1n ** 18n)
            ).to.be.revertedWith("Only users can make this happen.");
          });

          it("Should emit a Transfer event", async function () {
            const { bitirium, rium, accounts } = await loadFixture(getContractsAndAccounts);

            await bitirium.connect(accounts[1]).createUser();
            await bitirium.connect(accounts[1]).deposit({ value: 10n ** 18n });
            await bitirium.connect(accounts[1]).buyRiumForExactEth(rium.address, 1n ** 18n);
            await expect(
              bitirium.connect(accounts[1]).sellRiumForExactEth(rium.address, 1n ** 18n)
            ).to.emit(bitirium, "Transfer").withArgs(ethers.constants.AddressZero, accounts[1].address, 1n ** 18n)
          });
        })
      })
    });

    describe("Admin", function () {
      it("Should return true if user is admin", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        expect(
          await bitirium.isAdmin(accounts[0].address)
        ).to.equal(true);
      });

      it("Should return false if user isn't admin", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        expect(
          await bitirium.isAdmin(accounts[1].address)
        ).to.equal(false);
      });

      it("Admins should be a able to administrate an user", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        await bitirium.connect(accounts[1]).createUser();
        await bitirium.connect(accounts[0]).administrateUser(accounts[1].address);
        expect(
          await bitirium.isAdmin(accounts[1].address)
        ).to.equal(true);
      });

      it("Admins should be a able to delete an user", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        await bitirium.connect(accounts[1]).createUser();
        await bitirium.connect(accounts[0]).deleteUser(accounts[1].address);
        expect(
          await bitirium.isUser(accounts[1].address)
        ).to.equal(false);
      });

      it("Should throw when non-admins try to delete or administrate users", async function () {
        const { bitirium, accounts } = await loadFixture(getContractsAndAccounts);

        await bitirium.connect(accounts[1]).createUser();
        await bitirium.connect(accounts[2]).createUser();
        await expect( //* using await before expect instead of inside
          bitirium.connect(accounts[1]).administrateUser(accounts[2].address)
        ).to.be.revertedWith("Only admins can make this happen.");
      });
    });
  })
});
