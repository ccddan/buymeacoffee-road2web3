import {
  useAccount,
  useBalance,
  useContract,
  useContractEvent,
  useSigner,
} from "wagmi";
import { useCallback, useEffect, useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import type { NextPage } from "next";
import config from "@config";
import { ethers } from "ethers";

function getETHFromCoffeeSize(size: string) {
  switch (size) {
    case "small":
      return ethers.utils.parseEther("0.00001");
    case "medium":
      return ethers.utils.parseEther("0.0001");
    case "big":
      return ethers.utils.parseEther("0.001");
    case "extra":
      return ethers.utils.parseEther("0.01");
    default:
      throw new Error(`Coffee size not supported: ${size}`);
  }
}

const Home: NextPage = () => {
  const [contractBalance, setContractBalance] = useState("");
  const { data: contractData, refetch } = useBalance({
    addressOrName: config.blockchain.contract.addr,
  });
  const { data } = useAccount();
  const { data: signerData } = useSigner();
  const contract = useContract({
    addressOrName: config.blockchain.contract.addr,
    contractInterface: config.blockchain.contract.abi,
    signerOrProvider: signerData,
  });
  useContractEvent(
    {
      addressOrName: config.blockchain.contract.addr,
      contractInterface: config.blockchain.contract.abi,
    },
    "NewMemo",
    async (newMemoEvent) => {
      console.log("NewMemo event:", newMemoEvent);
      await loadMemos();
    }
  );
  const loadMemosFn = useCallback(() => {
    async function fn() {
      console.log("getting memos...");
      try {
        const _memos = await contract.getMemos();
        console.log("memos:", _memos);
        setMemos(_memos);
      } catch (error) {
        console.warn("Failed to get memos:", error);
      }
    }

    fn();
  }, [contract]);

  const isOwnerFn = useCallback(() => {
    async function fn() {
      console.log("check if wallet is the owner...");
      try {
        const owner = await contract.isOwner();
        console.log("isOwner:", owner);
        setIsOwner(owner);
      } catch (error) {
        console.warn("Failed to check if wallet is owner:", error);
      }
    }

    fn();
  }, [contract]);

  const [isOwner, setIsOwner] = useState(false);
  const [memos, setMemos] = useState<any[]>([]);
  const [formInput, updateFormInput] = useState({
    name: "",
    message: "",
    coffeeSize: "small", // default value in select element is small
  });
  const [tipSentName, setTipSentName] = useState<null | string>(null);

  useEffect(() => {
    if (data && signerData && contract) {
      isOwnerFn();
      loadMemosFn();
    }
    if (contractData) {
      setContractBalance(contractData.value.toString());
    }
  }, [data, signerData, contract, contractData, loadMemosFn, isOwnerFn]);

  async function loadMemos() {
    console.log("getting memos...");
    try {
      const _memos = await contract.getMemos();
      console.log("memos:", memos);
      setMemos(_memos);
    } catch (error) {
      console.warn("Failed to get memos:", error);
    }
  }

  async function sendTipHandler() {
    console.log("Send tip");
    try {
      let tx = await contract.buyCoffee(formInput.name, formInput.message, {
        value: getETHFromCoffeeSize(formInput.coffeeSize),
      });

      console.log("Wait for tx to complete");
      await tx.wait();
      console.log("completed");

      setTipSentName(formInput.name);

      let timer = setTimeout(() => {
        setTipSentName(null);
        clearTimeout(timer);
      }, 10000);
    } catch (error) {
      console.warn("Failed to send tip:", error);
    }
  }

  async function claimTipsHandler() {
    console.log("Claiming tips");
    try {
      let tx = await contract.withdrawTips();
      console.log("Wait for tx to complete");

      await tx.wait();
      console.log("Withdraw complete!");

      let { data: _contractData } = await refetch({
        throwOnError: true,
      });
      if (_contractData) setContractBalance(_contractData.value.toString());
    } catch (error) {
      console.warn("Failed to send tip:", error);
    }
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen m-0 pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between sm:block">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Do you like my work?</span>
            <span className="block text-indigo-600">
              &nbsp;&nbsp;&nbsp;&nbsp;Buy me a coffee!!
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 sm:mb-20">
            <div className="inline-flex rounded-md shadow sm:block sm:m-auto">
              <ConnectButton />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Send a tip
              </h2>
            </div>
            <div className="mt-8 space-y-6">
              <div className="rounded-md">
                <div className="mb-5">
                  <label htmlFor="sender" className="text-gray-600">
                    Who sends the tip?
                  </label>
                  <input
                    id="sender"
                    name="sender"
                    type="text"
                    autoComplete="true"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2"
                    placeholder="Name"
                    onChange={(e) =>
                      updateFormInput({ ...formInput, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-gray-600">
                    Anything you would like to share?
                  </label>
                  <input
                    id="message"
                    name="message"
                    type="message"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2"
                    placeholder="Message"
                    onChange={(e) =>
                      updateFormInput({ ...formInput, message: e.target.value })
                    }
                  />
                </div>
                <div className="mt-10">
                  <label htmlFor="coffeeSize" className="text-gray-600">
                    Coffee Size
                  </label>
                  <div className="flex justify-center">
                    <div className="mb-3 w-full">
                      <select
                        className="
                        form-select appearance-none block w-full px-3 py-2 text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-2"
                        aria-label="Coffee Size"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            coffeeSize: e.target.value,
                          })
                        }
                      >
                        <option value="small" defaultValue="small">
                          Small (0.00001 ETH)
                        </option>
                        <option value="medium">Medium (0.0001 ETH)</option>
                        <option value="big">Big (0.001 ETH)</option>
                        <option value="extra">Extra Big (0.01 ETH)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {(!data && (
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    disabled={true}
                  >
                    Wallet Required
                  </button>
                )) || (
                  <button
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={sendTipHandler}
                    disabled={
                      !(
                        formInput.name.trim() &&
                        formInput.message.trim() &&
                        formInput.coffeeSize?.trim()
                      )
                    }
                  >
                    Send
                  </button>
                )}
                {tipSentName && (
                  <div className="bg-green-100 rounded-lg py-5 px-6 mt-4 text-base text-green-700">
                    Thanks{" "}
                    <b className="font-bold text-green-800">{tipSentName}</b>{" "}
                    for the coffee!!.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 bg-pattern md:p-0 m-0 pb-40 pt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl pb-10 sm:pt-20">
              <span className="block">
                &nbsp;&nbsp;&nbsp;&nbsp;Thank you{" "}
                <b className="text-indigo-600">ALL</b> for the Coffee!
              </span>
            </h2>
            {data && isOwner && contractBalance && (
              <div className="flex flex-row justify-between pl-5 pr-5 content-center">
                <p className="py-1">
                  <b>
                    Total Tips: {ethers.utils.formatEther(contractBalance)} ETH
                  </b>
                </p>
                <button
                  className="group relative flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={claimTipsHandler}
                >
                  Claim
                </button>
              </div>
            )}
          </div>
          <div className="container max-w-md m-auto h-[500px] overflow-y-scroll px-5 pt-10">
            {(!data || !memos.length) && (
              <p className="text-gray-400 m-auto text-center">
                Nothing to show here!
              </p>
            )}
            {data && memos.length > 0 && (
              <ol className="border-l-2 border-blue-600">
                {memos.map((memo: any, idx: number, arr: any[]) => {
                  memo = arr[arr.length - (idx + 1)];
                  return (
                    <li key={idx}>
                      <div className="flex flex-start items-center">
                        <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
                        <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                          {memo.name}
                        </h4>
                      </div>
                      <div className="ml-6 mb-6 pb-6">
                        <a
                          href="#!"
                          className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm"
                        >
                          {memo.timestamp.toString()}
                        </a>
                        <p className="text-gray-700 mt-2 mb-4">
                          {memo.message}
                        </p>
                      </div>
                    </li>
                  );
                })}
                ;
              </ol>
            )}
          </div>
        </div>
        <footer className="text-center text-white">
          <div className="container pt-9 m-auto">
            <div className="flex justify-center mb-9">
              <a
                href="https://twitter.com/AlchemyPlatform"
                target="_blank"
                rel="noreferrer"
                className="mr-9 text-gray-800"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="twitter"
                  className="svg-inline--fa fa-twitter w-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                  ></path>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/alchemyinc"
                target="_blank"
                rel="noreferrer"
                className="mr-9 text-gray-800"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="linkedin-in"
                  className="svg-inline--fa fa-linkedin-in w-3.5"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                  ></path>
                </svg>
              </a>
              <a
                href="https://github.com/ccddan/buymeacoffee-road2web3"
                target="_blank"
                rel="noreferrer"
                className="text-gray-800"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="github"
                  className="svg-inline--fa fa-github w-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                >
                  <path
                    fill="currentColor"
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="flex text-gray-700 p-4 items-center justify-center">
            © 2022 Road to Web3 by
            <a
              className="text-gray-800 ml-5 pt-2"
              href="https://www.alchemy.com/"
            >
              <Image
                src="https://assets-global.website-files.com/5f973c970bea5548ad4287ef/6088f4c7c34ad61ab10cdf72_horizontal-logo-onecolor-neutral-alchemy.svg"
                alt="Alchemy"
                width={100}
                height={20}
              />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
