import { useEtherStore } from "@/store/ether";
import { ethers } from "ethers";

const updateWalletStatus = async (walletAddress: string) => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection) return;

  const provider = new ethers.providers.Web3Provider(connection);
  const balance = await provider.getBalance(walletAddress);

  etherStore.setBalance(String(balance));
  etherStore.setWalletAddress(walletAddress);
};

const connectProvider = async () => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (connection) {
    provider = new ethers.providers.Web3Provider(connection);

    const walletAddress = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(walletAddress[0]);

    etherStore.setWalletAddress(walletAddress[0]);
    etherStore.setBalance(String(balance));

    connection.on("accountsChanged", (accounts: string[]) => {
      updateWalletStatus(accounts[0]);
    });
  }
};

const formatEther = (balance: string) => {
  const formatted = ethers.utils.formatEther(balance);
  return formatted;
};

export default { connectProvider, formatEther };
