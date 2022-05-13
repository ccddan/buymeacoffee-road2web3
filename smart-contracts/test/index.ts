import { BuyMeACoffee } from "../typechain";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("BuyMeACoffee", function () {
  let coffee: BuyMeACoffee;

  this.beforeAll(async () => {
    const Coffee = await ethers.getContractFactory("BuyMeACoffee");
    coffee = await Coffee.deploy();
    await coffee.deployed();
  });

  it("Cannot buy coffee for free", async function () {
    try {
      await coffee.buyCoffee("yo", "greetings");
      expect(false).to.true;
    } catch (error) {
      expect(`${error}`.includes("can't buy coffee for free")).to.true;
    }
  });

  it("Cannot withdraw 0 tips", async function () {
    try {
      await coffee.withdrawTips();
      expect(false).to.true;
    } catch (error) {
      expect(`${error}`.includes("No tips to withdraw")).to.true;
    }
  });

  it("Should list available memos", async function () {
    let memos = await coffee.getMemos();
    expect(memos.length).greaterThanOrEqual(0);
  });

  it("Buy a coffee", async function () {
    const [ownerAccount, senderAccount] = await ethers.getSigners();

    await coffee.connect(senderAccount).buyCoffee("yo", "greetings!", {
      value: ethers.utils.parseEther(".5"),
    });
    let memos = await coffee.getMemos();
    expect(memos.length).equal(1);
    expect(memos[0].from).to.equal(senderAccount.address);
    expect(memos[0].name).to.equal("yo");
    expect(memos[0].message).to.equal("greetings!");
  });

  it("Withdraws tips", async function () {
    const [ownerAccount, senderAccount1, senderAccount2] =
      await ethers.getSigners();
    const initialBalance = +ethers.utils.formatEther(
      await ownerAccount.getBalance()
    );

    await coffee.connect(senderAccount1).buyCoffee("yo", "greetings!", {
      value: ethers.utils.parseEther("5"),
    });
    await coffee.connect(senderAccount2).buyCoffee("yo2", "greetings again!!", {
      value: ethers.utils.parseEther("5"),
    });
    const txn = await coffee.withdrawTips();
    await txn.wait();

    const finalBalance = +ethers.utils.formatEther(
      await ownerAccount.getBalance()
    );

    expect(finalBalance).greaterThan(initialBalance);
  });
});
