import { useEtherStore } from "@/store/ether";
import { ethers } from "ethers";

const getProvider = async (): Promise<ethers.providers.Web3Provider | null> => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  let provider: ethers.providers.Web3Provider | null = null;

  if (window_.ethereum) {
    provider = new ethers.providers.Web3Provider(window_.ethereum);

    const walletAddress = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(walletAddress[0]);

    etherStore.setProvider(provider);
    etherStore.setWalletAddress(walletAddress);
    etherStore.setBalance(Number(balance));
  } else console.log("Browser não suporta conexão com metamask");

  return provider;
};

export default { getProvider };
