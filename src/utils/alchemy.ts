import { Network, Alchemy } from "alchemy-sdk";
import { useEtherStore } from "@/store/ether";

const getAlchemy = () => {
  const possibleSettings = {
    Ethereum: {
      apiKey: import.meta.env.VITE_GOERLI_API_KEY,
      network: Network.ETH_GOERLI,
    },
    Polygon: {
      apiKey: import.meta.env.VITE_MUMBAI_API_KEY,
      network: Network.MATIC_MUMBAI,
    },
  };
  const etherStore = useEtherStore();

  const settings = possibleSettings[etherStore.networkName];
  const alchemy = new Alchemy(settings);
  return alchemy;
};

const showLatestBlockNumber = async () => {
  const alchemy = getAlchemy();

  const latestBlock = await alchemy.core.getBlockNumber();
  if (latestBlock) console.log(latestBlock);
};

export default {
  getAlchemy,
  showLatestBlockNumber,
};
