import { useEtherStore } from "@/store/ether";
import { NetworkEnum } from "@/model/NetworkEnum";

const getTokenAddress = (): string => {
  const etherStore = useEtherStore();

  const possibleTokenAddresses: { [key: string]: string } = {
    Ethereum: "0x294003F602c321627152c6b7DED3EAb5bEa853Ee",
    Polygon: "0x294003F602c321627152c6b7DED3EAb5bEa853Ee",
    Localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  };

  return possibleTokenAddresses[etherStore.networkName];
};

const getProviderUrl = (): string => {
  const etherStore = useEtherStore();

  const possibleProvidersUrls: { [key: string]: string } = {
    Ethereum: import.meta.env.VITE_GOERLI_API_URL,
    Polygon: import.meta.env.VITE_MUMBAI_API_URL,
    Localhost: import.meta.env.VITE_GOERLI_API_URL,
  };

  return possibleProvidersUrls[etherStore.networkName];
};

const possibleChains: { [key: string]: NetworkEnum } = {
  "0x5": NetworkEnum.ethereum,
  "5": NetworkEnum.ethereum,
  "0x13881": NetworkEnum.polygon,
  "80001": NetworkEnum.polygon,
  "0x7a69": NetworkEnum.localhost,
  "31337": NetworkEnum.localhost,
};

const network2Chain: { [key: string]: string } = {
  Ethereum: "0x5",
  Polygon: "0x13881",
  Localhost: "0x7a69",
};

const isPossibleNetwork = (networkChain: string): boolean => {
  if (Object.keys(possibleChains).includes(networkChain)) {
    return true;
  }
  return false;
};

export {
  getTokenAddress,
  getProviderUrl,
  possibleChains,
  network2Chain,
  isPossibleNetwork,
};
