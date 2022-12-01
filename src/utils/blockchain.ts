import { useEtherStore } from "@/store/ether";
import { BigNumber, ethers } from "ethers";

// Smart contract imports
import mockToken from "./smart_contract_files/MockToken.json";
import p2pix from "./smart_contract_files/P2PIX.json";
import addresses from "./smart_contract_files/localhost.json";
// Mock wallets import
import { wallets } from "./smart_contract_files/wallets.json";

// Provider methods
const connectProvider = async () => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (!connection) return;
  provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const walletAddress = await provider.send("eth_requestAccounts", []);
  const balance = await tokenContract.balanceOf(walletAddress[0]);

  etherStore.setWalletAddress(ethers.utils.getAddress(walletAddress[0]));
  etherStore.setBalance(String(balance));

  const p2pEvents = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pEvents.filters.DepositAdded(null);
  const eventsDeposits = await p2pEvents.queryFilter(filterDeposits);
  console.log("Deposits Added: ", eventsDeposits);
  etherStore.setDepositsAddedList(eventsDeposits);

  const filterLocks = p2pEvents.filters.LockAdded(null);
  const eventsLocks = await p2pEvents.queryFilter(filterLocks);
  console.log("Locks Added: ", eventsLocks)
  etherStore.setLocksAddedList(eventsLocks);

  const filterExpiredLocks = p2pEvents.filters.LockReturned(null);
  const eventsExpiredLocks = await p2pEvents.queryFilter(filterExpiredLocks);
  console.log("Expired Locks: ", eventsExpiredLocks);
  etherStore.setDepositsExpiredList(eventsExpiredLocks);

  // (TO DO) Filter valid deposits

  connection.on("accountsChanged", (accounts: string[]) => {
    updateWalletStatus(accounts[0]);
  });
};

const getProvider = (): ethers.providers.Web3Provider | null => {
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection) return null;

  return new ethers.providers.Web3Provider(connection);
};

// Wallet methods
// Update wallet state (balance and address)
const updateWalletStatus = async (walletAddress: string) => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const balance = await contract.balanceOf(walletAddress);

  etherStore.setBalance(String(balance));
  etherStore.setWalletAddress(ethers.utils.getAddress(walletAddress));
};

//  Split tokens between wallets in wallets.json
const splitTokens = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  for (let i = 0; i < wallets.length; i++) {
    const tx = await contract.transfer(
      wallets[i],
      ethers.utils.parseEther("4000000.0")
    );
    await tx.wait();
    updateWalletStatus(etherStore.walletAddress);
  }
};

// Deposit methods
// Gets value and pix key from user's form to create a deposit in the blockchain
const addDeposit = async (tokenQty = "1000.0", pixKey = "00011122233") => {
  const etherStore = useEtherStore();
  const provider = getProvider();

  if (!provider) return;
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(
    addresses.token,
    mockToken.abi,
    signer
  );
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  // First get the approval
  const apprv = await tokenContract.approve(
    addresses.p2pix,
    ethers.utils.parseEther(tokenQty)
  );
  await apprv.wait();

  // Now we make the deposit
  const deposit = await p2pContract.deposit(
    addresses.token,
    ethers.utils.parseEther(tokenQty),
    pixKey
  );
  await deposit.wait();

  updateWalletStatus(etherStore.walletAddress);

  const p2pEvents = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const filter = p2pEvents.filters.DepositAdded(null);
  const events = await p2pEvents.queryFilter(filter);

  etherStore.setDepositsAddedList(events);
};

// Get specific deposit data by its ID
const mapDeposits = async (depositId: BigNumber) => {
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const deposit = await contract.mapDeposits(depositId.toNumber());

  console.log(deposit);
  return deposit;
};

// Lock methods
// Gets value from user's form to create a lock in the blockchain
const addLock = async(depositId: Number, amount: Number) => {
  const etherStore = useEtherStore();
  const provider = getProvider();

  if (!provider) return;
  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  // Make lock
  const lockTx = await p2pContract.lock(
    depositId,
    etherStore.walletAddress,
    ethers.constants.AddressZero,
    0,
    ethers.utils.parseEther(amount.toString()),
    []
  );

  const filterLocks = p2pContract.filters.LockAdded(null);
  const eventsLocks = await p2pContract.queryFilter(filterLocks);
  etherStore.setLocksAddedList(eventsLocks);

  {

    
  }

};

// Get specific lock data by its ID
const mapLocks = async (lockId: string) => {
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const lock = await contract.mapLocks(lockId);

  console.log(lock);
  return lock;
};

// Releases lock by specific ID and other additional data
// (TO DO)
const releaseLock = async() => {
  return;
};

// Formatting methods
const formatEther = (balance: string) => {
  const formatted = ethers.utils.formatEther(balance);
  return formatted;
};

const formatBigNumber = (num: BigNumber) => {
  const formattedNum = ethers.utils.formatEther(num);
  return formattedNum;
};

export default {
  connectProvider,
  formatEther,
  splitTokens,
  addDeposit,
  mapDeposits,
  formatBigNumber,
  addLock,
  mapLocks,
  releaseLock,
};
