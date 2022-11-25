import { useEtherStore } from "@/store/ether";
import { BigNumber, ethers } from "ethers";

// smart contract imports
import mockToken from "./smart_contract_files/MockToken.json";
import p2pix from "./smart_contract_files/P2PIX.json";
import addresses from "./smart_contract_files/localhost.json";

import { wallets } from "./smart_contract_files/wallets.json"

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

  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filter = p2pContract.filters.DepositAdded(null);
  const events = await p2pContract.queryFilter(filter);

  console.log(events)
  etherStore.setDepositList(events);

  connection.on("accountsChanged", (accounts: string[]) => {
    updateWalletStatus(accounts[0]);
  });
};

const splitTokens = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  for (var i = 0; i < wallets.length; i++){
    const tx = await contract.transfer(wallets[i], ethers.utils.parseEther("4000000.0"));
    await tx.wait()
    updateWalletStatus(etherStore.walletAddress);
  }
  
};

const mockDeposit = async (tokenQty = "1000.0", pixKey = "00011122233") => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();

  const tokenContract = new ethers.Contract(addresses.token, mockToken.abi, signer);
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  // first get the approval
  const apprv = await tokenContract.approve(addresses.p2pix, ethers.utils.parseEther(tokenQty));
  await apprv.wait();


  // deposit
  const deposit = await p2pContract.deposit(addresses.token, ethers.utils.parseEther(tokenQty), pixKey);
  await deposit.wait();

  updateWalletStatus(etherStore.walletAddress);

  const filter = p2pContract.filters.DepositAdded(null);
  const events = await p2pContract.queryFilter(filter);

  console.log(events)

  etherStore.setDepositList(events);

};


const countDeposit = async () => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const count = await contract.depositCount();

  console.log(Number(count))
};

const mapDeposits = async (depositId: BigNumber) => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const deposit = await contract.mapDeposits(depositId);

  console.log(deposit)
};

const formatEther = (balance: string) => {
  const formatted = ethers.utils.formatEther(balance);
  return formatted;
};

const verifyDepositAmmount = (ammountBigNumber: BigNumber) => {
  return ethers.utils.formatEther(ammountBigNumber)
}


const getProvider = (): ethers.providers.Web3Provider | null => {
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection) return null;

  return new ethers.providers.Web3Provider(connection);
};

export default { connectProvider, formatEther, splitTokens, mockDeposit, countDeposit, mapDeposits, verifyDepositAmmount };
