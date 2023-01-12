import { ethers } from "ethers";
import { getProvider } from "./provider";
import blockchain from "../utils/blockchain";
import { useEtherStore } from "@/store/ether";

import mockToken from "../utils/smart_contract_files/MockToken.json";
import addresses from "../utils/smart_contract_files/localhost.json";

const updateWalletStatus = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const walletAddress = await provider.send("eth_requestAccounts", []);

  const balance = await contract.balanceOf(walletAddress[0]);
  etherStore.setBalance(blockchain.formatBigNumber(balance));
  etherStore.setWalletAddress(ethers.utils.getAddress(walletAddress[0]));
};

const updateWalletBalance = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const walletAddress = await provider.send("eth_requestAccounts", []);

  const balance = await contract.balanceOf(walletAddress[0]);
  etherStore.setBalance(blockchain.formatBigNumber(balance));
};

export { updateWalletStatus, updateWalletBalance };
