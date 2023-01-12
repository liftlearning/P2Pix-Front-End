import { ethers } from "ethers";
import { useEtherStore } from "@/store/ether";

const getProvider = (): ethers.providers.Web3Provider | null => {
    const etherStore = useEtherStore();

    const window_ = window as any;
    const connection = window_.ethereum;
  
    if (!connection) return null;
  
    return new ethers.providers.Web3Provider(connection);
};

export { getProvider }