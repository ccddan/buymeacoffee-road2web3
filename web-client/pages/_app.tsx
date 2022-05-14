import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Chain, WagmiProvider, chain, createClient } from "wagmi";
import {
  RainbowKitProvider,
  apiProvider,
  configureChains,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import type { AppProps } from "next/app";
import config from "../config";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const goerliChain: Chain = {
    id: 5,
    name: "Ethereum Goerli",
    nativeCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH",
    },
    rpcUrls: {
      default: config.blockchain.network["ethereum-goerli"].host,
    },
    blockExplorers: {
      etherscan: {
        name: "Goerli Etherscan",
        url: "https://goerli.etherscan.io/",
      },
      default: {
        name: "Mumbai Polygon Scan",
        url: "https://goerli.etherscan.io/",
      },
    },
    testnet: true,
  };
  const polygonMumbaiChain: Chain = {
    id: 80001,
    name: "Mumbai",
    nativeCurrency: {
      decimals: 18,
      name: "MATIC",
      symbol: "MATIC",
    },
    rpcUrls: {
      default: config.blockchain.network["polygon-testnet"].host,
    },
    blockExplorers: {
      etherscan: {
        name: "Mumbai Polygon Scan",
        url: "https://mumbai.polygonscan.com/",
      },
      default: {
        name: "Mumbai Polygon Scan",
        url: "https://mumbai.polygonscan.com/",
      },
    },
    testnet: true,
  };
  const localhostChain: Chain = {
    id: config.blockchain.network.local.chainId,
    name: "Hardhat",
    nativeCurrency: {
      decimals: 18,
      name: "Ethereum",
      symbol: "ETH",
    },
    rpcUrls: {
      default: config.blockchain.network.local.host,
    },
    testnet: true,
  };

  const { provider, chains } = configureChains(
    [goerliChain, chain.polygon, polygonMumbaiChain, localhostChain],
    [
      apiProvider.jsonRpc((chain) => ({ rpcUrl: `${chain.rpcUrls.default}` })),
      apiProvider.fallback(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "Buy Me A Coffee",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const theme = lightTheme({
    accentColor: "#ec4899",
    accentColorForeground: "white",
    borderRadius: "small",
    fontStack: "system",
  });
  theme.colors = { ...theme.colors, connectButtonInnerBackground: "white" };
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={theme}
        appInfo={{ appName: "NFT Marketplace" }}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export default MyApp;
