import { useEtherStore } from "@/store/ether";

import { getProvider } from "./provider";
import { getTokenAddress, possibleChains } from "./addresses";

import mockToken from "../utils/smart_contract_files/MockToken.json";

import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";

const updateWalletStatus = async () => {
  const etherStore = useEtherStore();

  const provider = getProvider();
  const signer = provider.getSigner();

  const { chainId } = await provider.getNetwork();
  etherStore.setNetworkName(possibleChains[chainId]);

  const mockTokenContract = new ethers.Contract(
    getTokenAddress(),
    mockToken.abi,
    signer
  );

  const walletAddress = await provider.send("eth_requestAccounts", []);
  const balance = await mockTokenContract.balanceOf(walletAddress[0]);

  etherStore.setBalance(formatEther(balance));
  etherStore.setWalletAddress(ethers.utils.getAddress(walletAddress[0]));
};

export { updateWalletStatus };
