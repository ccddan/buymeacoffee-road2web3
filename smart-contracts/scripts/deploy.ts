import { ethers } from "hardhat";
import { join } from "path";
import { writeFileSync } from "fs";

async function main() {
  const contractName = "Greeter";
  const Greeter = await ethers.getContractFactory(contractName);
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

  const exportFile = join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    `${contractName}.sol`,
    `${contractName}.addr.json`
  );
  const exportFileTimestamp = exportFile.replace(
    ".addr.",
    `.addr-${new Date().toISOString()}.`
  );
  const fileData = JSON.stringify(
    { name: contractName, addr: greeter.address },
    null,
    2
  );
  writeFileSync(exportFile, fileData, { flag: "w" });
  writeFileSync(exportFileTimestamp, fileData);

  console.log(
    "Contract info exported at:\n\t",
    exportFile,
    "\n\t",
    exportFileTimestamp
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
