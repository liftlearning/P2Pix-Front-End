import { useEtherStore } from "@/store/ether";
import { BigNumber, ethers } from "ethers";

// Smart contract imports
import mockToken from "./smart_contract_files/MockToken.json";
import p2pix from "./smart_contract_files/P2PIX.json";
import addresses from "./smart_contract_files/localhost.json";
// Mock wallets import
import { wallets } from "./smart_contract_files/wallets.json";

// Wallet methods
// Update wallet state (balance and address)
const updateWalletStatus = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const walletAddress = await provider.send("eth_requestAccounts", []);

  const balance = await contract.balanceOf(walletAddress[0]);

  etherStore.setBalance(String(balance));
  etherStore.setWalletAddress(ethers.utils.getAddress(walletAddress[0]));
};

//  Split tokens between wallets in wallets.json
const splitTokens = async () => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  for (let i = 0; i < wallets.length; i++) {
    const tx = await tokenContract.transfer(
      wallets[i],
      ethers.utils.parseEther("4000000.0")
    );
    await tx.wait();
    updateWalletStatus();
  }
};

// Update store
const updateStore = async () => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (!connection) return;
  provider = new ethers.providers.Web3Provider(connection);

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pContract.filters.DepositAdded(null);
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);
  console.log("Deposits Added: ", eventsDeposits);
  etherStore.setDepositsAddedList(eventsDeposits);

  const filterLocks = p2pContract.filters.LockAdded(null);
  const eventsLocks = await p2pContract.queryFilter(filterLocks);
  console.log("Locks Added: ", eventsLocks);
  etherStore.setLocksAddedList(eventsLocks);

  const filterReleasedLocks = p2pContract.filters.LockReleased(null);
  const eventsReleasedLocks = await p2pContract.queryFilter(filterReleasedLocks);
  console.log("Released Locks: ", eventsReleasedLocks);
  etherStore.setLocksReleasedList(eventsReleasedLocks);

  const filterExpiredLocks = p2pContract.filters.LockReturned(null);
  const eventsExpiredLocks = await p2pContract.queryFilter(filterExpiredLocks);
  console.log("Expired Locks: ", eventsExpiredLocks);
  etherStore.setLocksExpiredList(eventsExpiredLocks);


  // (TO DO) Filter valid deposits
}

// Provider methods
const connectProvider = async () => {
  const window_ = window as any;
  const connection = window_.ethereum;

  await updateWalletStatus();
  await updateStore();

  connection.on("accountsChanged", () => {
    updateWalletStatus();
  });
};

const getProvider = (): ethers.providers.Web3Provider | null => {
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection) return null;

  return new ethers.providers.Web3Provider(connection);
};

// Deposit methods
// Gets value and pix key from user's form to create a deposit in the blockchain
const addDeposit = async (tokenQty = "1000.0", pixKey = "00011122233") => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();

  const tokenContract = new ethers.Contract(
    addresses.token,
    mockToken.abi,
    signer
  );
  const p2pContract = new ethers.Contract(
    addresses.p2pix, 
    p2pix.abi, 
    signer
  );

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

  updateStore();
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
const addLock = async (depositId: Number, amount: Number) => {
  const etherStore = useEtherStore();
  const provider = getProvider();

  if (!provider) return;
  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  // Make lock
  const lock = await p2pContract.lock(
    depositId,
    etherStore.walletAddress,
    ethers.constants.AddressZero,
    0,
    ethers.utils.parseEther(amount.toString()),
    []
  );
  lock.wait();

  updateStore();
};

// Get specific lock data by its ID
const mapLocks = async (lockId: string) => {
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const lock = await contract.mapLocks(lockId);

  console.log(lock);

  console.log("Expiration block = ", Number(lock.expirationBlock))
  return lock;
};

// Releases lock by specific ID and other additional data
const releaseLock = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();
  if (!provider) return;

  const myLock = etherStore.locksAddedList[0];
  const lockId = myLock.args.lockID
  const depositId = myLock.args.depositID
  const amount = formatBigNumber(myLock.args.amount);

  const myDeposit = await mapDeposits(depositId);
  const pixKey = myDeposit.pixTarget

  const e2eId = 123

  console.log(pixKey, amount, e2eId)

  const mockBacenSigner = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")

  const messageToSign = ethers.utils.solidityKeccak256(
    [
      "string", 
      "uint256", 
      "uint256"
    ],
    [
      pixKey,
      ethers.utils.parseEther(amount),
      e2eId
    ]
  )

  const messageHashBytes = ethers.utils.arrayify(messageToSign);
  const flatSig = await mockBacenSigner.signMessage(messageHashBytes);
  const sig = ethers.utils.splitSignature(flatSig);

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  
  const release = await p2pContract.release(
    lockId,
    e2eId,
    sig.r,
    sig.s,
    sig.v
  )
  release.wait()
  console.log(release)

  updateStore();
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
  releaseLock
};