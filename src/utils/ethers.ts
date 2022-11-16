import { useEtherStore } from "@/store/ether";
import { ethers } from "ethers";

const connectProvider =
  async (): Promise<ethers.providers.Web3Provider | null> => {
    const etherStore = useEtherStore();
    const window_ = window as any;
    const connection = window_.ethereum;
    let provider: ethers.providers.Web3Provider | null = null;

    if (connection) {
      provider = new ethers.providers.Web3Provider(connection);

      const walletAddress = await provider.send("eth_requestAccounts", []);
      const balance = await provider.getBalance(walletAddress[0]);

      etherStore.setProvider(provider);
      etherStore.setWalletAddress(walletAddress[0]);
      etherStore.setBalance(Number(balance));

      connection.on("accountsChanged", (accounts: string[]) => {
        etherStore.setWalletAddress(accounts[0]);
      });
    } else console.log("Browser não suporta conexão com metamask");

    return provider;
  };

export default { connectProvider };
