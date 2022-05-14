import { useAccount, useContract, useContractEvent, useSigner } from "wagmi";
import { useEffect, useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import config from "@config";
import { ethers } from "ethers";

function getETHFromCoffeeSize(size: string) {
  switch (size) {
    case "small":
      return ethers.utils.parseEther("0.00001");
    case "small":
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

  const [memos, setMemos] = useState<any[]>([]);
  const [formInput, updateFormInput] = useState({
    name: "",
    message: "",
    coffeeSize: "small", // default value in select element is small
  });
  const [tipSentName, setTipSentName] = useState<null | string>(null);

  useEffect(() => {
    if (data && signerData && contract) {
      loadMemos();
    }
  }, [data, signerData, contract]);

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

      setTipSentName(formInput.name);

      let timer = setTimeout(() => {
        setTipSentName(null);
        clearTimeout(timer);
      }, 10000);
    } catch (error) {
      console.warn("Failed to send tip:", error);
    }
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen m-0 pt-5 mb-20">
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
        <div className="mt-20 bg-pattern p-0 m-0 pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl pb-10 sm:pt-20">
              <span className="block">
                &nbsp;&nbsp;&nbsp;&nbsp;Thanks for the Coffee!
              </span>
            </h2>
          </div>
          <div className="container max-w-md m-auto h-[500px] overflow-y-scroll px-5 pt-10">
            {!memos.length && <p>Nothing to show here!</p>}
            {memos.length > 0 && (
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
      </div>
    </>
  );
};

export default Home;
