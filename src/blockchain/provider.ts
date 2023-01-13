import { useEtherStore } from "@/store/ether";

import { updateWalletStatus } from "./wallet";
import {
  getProviderUrl,
  isPossibleNetwork,
  possibleChains,
  network2Chain,
} from "./addresses";

import { ethers } from "ethers";

const getProvider = ():
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider => {
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection)
    return new ethers.providers.JsonRpcProvider(getProviderUrl()); // alchemy provider

  return new ethers.providers.Web3Provider(connection); // metamask provider
};

const connectProvider = async (): Promise<void> => {
  const window_ = window as any;
  const connection = window_.ethereum;
  const provider = getProvider();

  if (!(provider instanceof ethers.providers.Web3Provider)) {
    window.alert("Please, connect to metamask extension");
    return;
  }

  await updateWalletStatus();

  listenToNetworkChange(connection);
  listenToWalletChange(connection);
};

const listenToWalletChange = (connection: any): void => {
  connection.on("accountsChanged", async () => {
    console.log("Changed account!");
    updateWalletStatus();
  });
};

const listenToNetworkChange = (connection: any) => {
  const etherStore = useEtherStore();

  connection.on("chainChanged", (networkChain: string) => {
    console.log("Changed network!");

    if (isPossibleNetwork(networkChain)) {
      etherStore.setNetworkName(possibleChains[networkChain]);
      updateWalletStatus();
    } else {
      window.alert("Invalid chain!");
    }
  });
};

const requestNetworkChange = async (network: string): Promise<boolean> => {
  const etherStore = useEtherStore();
  if (!etherStore.walletAddress) return true;

  try {
    const window_ = window as any;
    await window_.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network2Chain[network] }], // chainId must be in hexadecimal numbers
    });
  } catch {
    return false;
  }

  return true;
};

export {
  getProvider,
  connectProvider,
  listenToNetworkChange,
  requestNetworkChange,
};
