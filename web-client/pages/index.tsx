import { LockClosedIcon, XCircleIcon } from "@heroicons/react/solid";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="bg-gray-50 min-h-screen m-0 pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Do you like my work?</span>
            <span className="block text-indigo-600">
              &nbsp;&nbsp;&nbsp;&nbsp;Buy me a coffee!!
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Connect Wallet
              </a>
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
            <form className="mt-8 space-y-6" action="#" method="POST">
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
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={true}
                >
                  Sending...
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-20 bg-pattern p-0 m-0 pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">
                &nbsp;&nbsp;&nbsp;&nbsp;Thanks for the Coffee!
              </span>
            </h2>
          </div>
          <div className="container max-w-md m-auto h-[500px] overflow-y-scroll px-5 pt-10">
            <ol className="border-l-2 border-blue-600">
              <li>
                <div className="flex flex-start items-center">
                  <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
                  <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                    Title of section 1
                  </h4>
                </div>
                <div className="ml-6 mb-6 pb-6">
                  <a
                    href="#!"
                    className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm"
                  >
                    12 May, 2022
                  </a>
                  <p className="text-gray-700 mt-2 mb-4">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo. Nemo
                    enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                    aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-start items-center">
                  <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
                  <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                    Title of section 2
                  </h4>
                </div>
                <div className="ml-6 mb-6 pb-6">
                  <a
                    href="#!"
                    className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm"
                  >
                    12 January, 2022
                  </a>
                  <p className="text-gray-700 mt-2 mb-4">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo. Nemo
                    enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                    aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-start items-center">
                  <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
                  <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                    Title of section 3
                  </h4>
                </div>
                <div className="ml-6 mb-6 pb-6">
                  <a
                    href="#!"
                    className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm"
                  >
                    27 December, 2021
                  </a>
                  <p className="text-gray-700 mt-2 mb-4">
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum deleniti atque
                    corrupti quos dolores et quas molestias excepturi sint
                    occaecati cupiditate non provident, similique sunt in culpa
                    qui officia deserunt mollitia animi, id est laborum et
                    dolorum fuga. Et harum quidem rerum facilis est et expedita
                    distinctio.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
