import { useEtherStore } from "@/store/ether";
import { ethers } from "ethers";

// smart contract imports
import mockToken from "./smart_contract_files/MockToken.json";
//import p2pix from "./smart_contract_files/P2PIX.json";
import addresses from "./smart_contract_files/localhost.json";

const updateWalletStatus = async (walletAddress: string) => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const balance = await contract.balanceOf(walletAddress);

  etherStore.setBalance(String(balance));
  etherStore.setWalletAddress(walletAddress);
};

const connectProvider = async () => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (!connection) return;
  provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const walletAddress = await provider.send("eth_requestAccounts", []);
  const balance = await contract.balanceOf(walletAddress[0]);

  etherStore.setWalletAddress(walletAddress[0]);
  etherStore.setBalance(String(balance));

  connection.on("accountsChanged", (accounts: string[]) => {
    updateWalletStatus(accounts[0]);
  });
};

const makeTransaction = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const fixedAccount1Address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const tx = await contract.transfer(
    fixedAccount1Address,
    ethers.utils.parseEther("100.0")
  );
  await tx.wait();

  updateWalletStatus(etherStore.walletAddress);
};

const formatEther = (balance: string) => {
  const formatted = ethers.utils.formatEther(balance);
  return formatted;
};

const getProvider = (): ethers.providers.Web3Provider | null => {
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection) return null;

  return new ethers.providers.Web3Provider(connection);
};

export default { connectProvider, formatEther, makeTransaction };
