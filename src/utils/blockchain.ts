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

  etherStore.setBalance(formatBigNumber(balance));
  etherStore.setWalletAddress(ethers.utils.getAddress(walletAddress[0]));
};

//  Split tokens between wallets in wallets.json
const splitTokens = async () => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(
    addresses.token,
    mockToken.abi,
    signer
  );

  for (let i = 0; i < wallets.length; i++) {
    const tx = await tokenContract.transfer(
      wallets[i],
      ethers.utils.parseEther("4000000.0")
    );
    await tx.wait();
    updateWalletStatus();
  }
};

// get wallet transactions
const listTransactionByWalletAddress = async (
  walletAddress: string
): Promise<any[] | undefined> => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pContract.filters.DepositAdded([walletAddress]);
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);

  const filterAddedLocks = p2pContract.filters.LockAdded([walletAddress]);
  const eventsAddedLocks = await p2pContract.queryFilter(filterAddedLocks);

  const filterReleasedLocks = p2pContract.filters.LockReleased([walletAddress]);
  const eventsReleasedLocks = await p2pContract.queryFilter(
    filterReleasedLocks
  );

  return [...eventsDeposits, ...eventsAddedLocks, ...eventsReleasedLocks].sort(
    (a, b) => {
      return b.blockNumber - a.blockNumber;
    }
  );
};

// Update events at store methods
const updateDepositAddedEvents = async () => {
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
  etherStore.setDepositsAddedList(eventsDeposits);
};

const updateLockAddedEvents = async () => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (!connection) return;
  provider = new ethers.providers.Web3Provider(connection);

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterLocks = p2pContract.filters.LockAdded(null);
  const eventsLocks = await p2pContract.queryFilter(filterLocks);
  etherStore.setLocksAddedList(eventsLocks);
};

const updateLockReleasedEvents = async () => {
  const etherStore = useEtherStore();
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (!connection) return;
  provider = new ethers.providers.Web3Provider(connection);

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterLocks = p2pContract.filters.LockReleased(null);
  const eventsLocks = await p2pContract.queryFilter(filterLocks);
  etherStore.setLocksReleasedList(eventsLocks);
};

// Provider methods
const connectProvider = async () => {
  const window_ = window as any;
  const connection = window_.ethereum;

  await updateWalletStatus();
  await updateDepositAddedEvents();
  await updateLockAddedEvents();
  await updateLockReleasedEvents();

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
const addDeposit = async (tokenQty: string, pixKey: string) => {
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
    formatEther(tokenQty)
  );
  await apprv.wait();

  // Now we make the deposit
  const deposit = await p2pContract.deposit(
    addresses.token,
    formatEther(tokenQty),
    pixKey
  );
  await deposit.wait();

  updateWalletStatus();
  updateDepositAddedEvents();
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

  updateLockAddedEvents();
  return lock;
};

// Get specific lock data by its ID
const mapLocks = async (lockId: string) => {
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const lock = await contract.mapLocks(lockId);

  console.log(lock);

  console.log("Expiration block = ", Number(lock.expirationBlock));
  return lock;
};

// Releases lock by specific ID and other additional data
const releaseLock = async (
  pixKey: string,
  amount: string,
  e2eId: Number,
  lockId: string
) => {
  const provider = getProvider();
  if (!provider) return;

  const mockBacenSigner = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const messageToSign = ethers.utils.solidityKeccak256(
    ["string", "uint256", "uint256"],
    [pixKey, formatEther(amount), e2eId]
  );

  const messageHashBytes = ethers.utils.arrayify(messageToSign);
  const flatSig = await mockBacenSigner.signMessage(messageHashBytes);
  const sig = ethers.utils.splitSignature(flatSig);

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const release = await p2pContract.release(lockId, e2eId, sig.r, sig.s, sig.v);
  release.wait();

  updateLockReleasedEvents();
  return release
};

// Formatting methods
const formatEther = (num: string) => {
  const formattedNum = ethers.utils.parseEther(num);
  return formattedNum;
};

const formatBigNumber = (num: BigNumber) => {
  const formattedNum = ethers.utils.formatEther(num);
  return formattedNum;
};

export default {
  connectProvider,
  formatEther,
  splitTokens,
  listTransactionByWalletAddress,
  addDeposit,
  mapDeposits,
  formatBigNumber,
  addLock,
  mapLocks,
  releaseLock,
};
