import { ethers } from "ethers";
import { useEtherStore } from "@/store/ether";
import { NetworkEnum } from "@/model/NetworkEnum";
import { updateWalletStatus } from "./wallet";

const getProviderUrl = (): string => {
  const etherStore = useEtherStore();

  const possibleProvidersUrls: { [key: string]: string } = {
    Ethereum: import.meta.env.VITE_GOERLI_API_URL,
    Polygon: import.meta.env.VITE_MUMBAI_API_URL,
    Localhost: import.meta.env.VITE_GOERLI_API_URL,
  };

  return possibleProvidersUrls[etherStore.networkName];
};

const getProvider = ():
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider => {
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection)
    return new ethers.providers.JsonRpcProvider(getProviderUrl()); // alchemy provider

  return new ethers.providers.Web3Provider(connection); // metamask provider
};

const connectProvider = async (): Promise<void | null> => {
  const window_ = window as any;
  const connection = window_.ethereum;
  const provider = getProvider();

  if (!(provider instanceof ethers.providers.Web3Provider)) {
    window.alert("Please, connect to metamask extension");
    return null;
  }

  await updateWalletStatus();
  // await updateValidDeposits();
  // await updateDepositAddedEvents();
  // await updateLockAddedEvents();
  // await updateLockReleasedEvents();

  listenToNetworkChange(connection);
  listenToWalletChange(connection);
};

const listenToWalletChange = (connection: any): void => {
  connection.on("accountsChanged", async () => {
    await updateWalletStatus();
  });
};

const listenToNetworkChange = (connection: any) => {
  const etherStore = useEtherStore();

  const possibleNetworks: { [key: string]: NetworkEnum } = {
    "0x5": NetworkEnum.ethereum,
    "0x13881": NetworkEnum.polygon,
    "0x7a69": NetworkEnum.localhost,
  };

  connection.on("chainChanged", (networkChain: string) => {
    if (Object.keys(possibleNetworks).includes(networkChain)) {
      etherStore.setNetworkName(possibleNetworks[networkChain]);
    }
  });
};

export { getProvider, connectProvider, listenToNetworkChange };
