import { useEtherStore } from "@/store/ether";
import { BigNumber, ethers } from "ethers";
import type { DepositEvent } from "@/model/Deposit";
import type { LockEvent } from "@/model/Lock";
import type { ReleaseEvent } from "@/model/LockRelease";
import type {ValidDeposit} from "@/model/ValidDeposit";

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

const updateWalletBalance = async () => {
  const etherStore = useEtherStore();
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.token, mockToken.abi, signer);

  const walletAddress = await provider.send("eth_requestAccounts", []);

  const balance = await contract.balanceOf(walletAddress[0]);
  etherStore.setBalance(formatBigNumber(balance));
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

// get all wallet transactions
const listAllTransactionByWalletAddress = async (
  walletAddress: string
): Promise<(DepositEvent | LockEvent | ReleaseEvent)[] | undefined> => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pContract.filters.DepositAdded([walletAddress]);
  const eventsDeposits: DepositEvent[] = await p2pContract.queryFilter(filterDeposits);

  const filterAddedLocks = p2pContract.filters.LockAdded([walletAddress]);
  const eventsAddedLocks: LockEvent[] = await p2pContract.queryFilter(filterAddedLocks);

  const filterReleasedLocks = p2pContract.filters.LockReleased([walletAddress]);
  const eventsReleasedLocks: ReleaseEvent[] = await p2pContract.queryFilter(
    filterReleasedLocks
  );

  return [...eventsDeposits, ...eventsAddedLocks, ...eventsReleasedLocks].sort(
    (a, b) => {
      return b.blockNumber - a.blockNumber;
    }
  );
};

// get wallet's deposit transactions
const listDepositTransactionByWalletAddress = async (
  walletAddress: string
): Promise<(DepositEvent)[] | undefined> => {
  const provider = getProvider();
  if (!provider) return [];

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pContract.filters.DepositAdded([walletAddress]);
  const eventsDeposits: DepositEvent[] = await p2pContract.queryFilter(filterDeposits)

  return eventsDeposits.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });
};

// get wallet's deposit transactions
const listValidDepositTransactionsByWalletAddress = async (
  walletAddress: string
): Promise<(ValidDeposit)[]> => {
  const walletDeposits: ValidDeposit[] = await getValidDeposits();
  if (walletDeposits) {
    return walletDeposits
      .filter((deposit) => deposit.seller == walletAddress)
      .sort((a, b) => {
        return b.blockNumber - a.blockNumber;
      });
  }
  return [];
};

// get wallet's lock transactions
const listLockTransactionByWalletAddress = async (
  walletAddress: string
): Promise<(LockEvent)[] | undefined> => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterAddedLocks = p2pContract.filters.LockAdded([walletAddress]);
  const eventsAddedLocks: LockEvent[] = await p2pContract.queryFilter(filterAddedLocks);

  return eventsAddedLocks.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });
};

// get wallet's release transactions
const listReleaseTransactionByWalletAddress = async (
  walletAddress: string
): Promise<(ReleaseEvent)[] | undefined> => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterReleasedLocks = p2pContract.filters.LockReleased([walletAddress]);
  const eventsReleasedLocks: ReleaseEvent[] = await p2pContract.queryFilter(
    filterReleasedLocks
  );

  return eventsReleasedLocks.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });
};

const getValidDeposits = async (): Promise<ValidDeposit[]> => {
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (!connection) return [];

  provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pContract.filters.DepositAdded(null);
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);

  const depositList = await Promise.all(
    eventsDeposits
      .map(async (deposit) => {
        const mappedDeposit: (any | undefined) = await mapDeposits(deposit.args?.depositID);
        let validDeposit = {};

        if (mappedDeposit) {
          const validDeposit: ValidDeposit = {
            blockNumber: deposit.blockNumber,
            depositID: deposit.args?.depositID,
            remaining: formatBigNumber(mappedDeposit.remaining),
            seller: mappedDeposit.seller,
            pixKey: mappedDeposit.pixTarget,
          };
          return validDeposit
        }

        return validDeposit;
      })
      .filter((deposit) => deposit)
  );

  return depositList as ValidDeposit[];
};
// Update events at store methods
const updateValidDeposits = async () => {
  const etherStore = useEtherStore();
  const deposits = await getValidDeposits();
  if (deposits !== undefined) etherStore.setDepositsValidList(deposits);
};

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
  const eventsDeposits:any = await p2pContract.queryFilter(filterDeposits);

  etherStore.setDepositsAddedList(eventsDeposits);
  console.log("DEPOSITS", eventsDeposits);
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
  console.log("LOCKS", eventsLocks);
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

  const filterReleases = p2pContract.filters.LockReleased(null);
  const eventsReleases = await p2pContract.queryFilter(filterReleases);
  etherStore.setLocksReleasedList(eventsReleases);
  console.log("RELEASES", eventsReleases);
};

// Provider methods
const connectProvider = async () => {
  const window_ = window as any;
  const connection = window_.ethereum;

  await updateWalletStatus();
  await updateValidDeposits();
  await updateDepositAddedEvents();
  await updateLockAddedEvents();
  await updateLockReleasedEvents();

  connection.on("accountsChanged", async () => {
    await updateWalletStatus();
  });
};

const getProvider = (): ethers.providers.Web3Provider | null => {
  const window_ = window as any;
  const connection = window_.ethereum;

  if (!connection) return null;

  return new ethers.providers.Web3Provider(connection);
};

// Deposit methods
const approveTokens = async (tokenQty: Number) => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();

  const tokenContract = new ethers.Contract(
    addresses.token,
    mockToken.abi,
    signer
  );

  const apprv = await tokenContract.approve(
    addresses.p2pix,
    formatEther(String(tokenQty))
  );
  await apprv.wait();
  return apprv;
};

// Gets value and pix key from user's form to create a deposit in the blockchain
const addDeposit = async (tokenQty: Number, pixKey: String) => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const deposit = await p2pContract.deposit(
    addresses.token,
    formatEther(String(tokenQty)),
    pixKey,
    ethers.utils.formatBytes32String("")
  );
  await deposit.wait();

  await updateWalletStatus();
  await updateDepositAddedEvents();
  await updateValidDeposits();
};

const mockDeposit = async (tokenQty: Number, pixKey: String) => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();

  const tokenContract = new ethers.Contract(
    addresses.token,
    mockToken.abi,
    signer
  );

  const apprv = await tokenContract.approve(
    addresses.p2pix,
    formatEther(String(tokenQty))
  );
  await apprv.wait();

  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const deposit = await p2pContract.deposit(
    addresses.token,
    formatEther(String(tokenQty)),
    pixKey,
    ethers.utils.formatBytes32String("")
  );
  await deposit.wait();

  await updateWalletStatus();
  await updateValidDeposits();
  await updateDepositAddedEvents();
};

// cancel a deposit by its Id
const cancelDeposit = async (depositId: BigNumber): Promise<Boolean> => {
  const provider = getProvider();

  if (!provider) return false;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  await contract.cancelDeposit(depositId);

  await updateWalletBalance();
  await updateValidDeposits();
  return true;
};

// withdraw a deposit by its Id
const withdrawDeposit = async (depositId: BigNumber): Promise<Boolean> => {
  const provider = getProvider();

  if (!provider) return false;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  await contract.withdraw(depositId, []);

  await updateWalletBalance();
  await updateValidDeposits();
  return true;
};

// Get specific deposit data by its ID
const mapDeposits = async (depositId: BigNumber): Promise<any | undefined> => {
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const deposit: ValidDeposit = await contract.mapDeposits(depositId);

  return deposit;
};

// Lock methods
// Gets value from user's form to create a lock in the blockchain
const addLock = async (depositId: BigNumber, amount: Number) => {
  const etherStore = useEtherStore();
  const provider = getProvider();

  if (!provider) return;
  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  // Make lock
  const oldEventsLen = etherStore.locksAddedList.length;
  const lock = await p2pContract.lock(
    depositId, // BigNumber
    etherStore.walletAddress, // String "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" (Example)
    ethers.constants.AddressZero, // String "0x0000000000000000000000000000000000000000"
    0,
    formatEther(String(amount)), // BigNumber
    [],
    []
  );
  lock.wait();

  while (etherStore.locksAddedList.length === oldEventsLen) {
    await updateLockAddedEvents();
    await updateValidDeposits();
  }

  return lock;
};

// Get specific lock data by its ID
const mapLocks = async (lockId: string) => {
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const lock = await contract.mapLocks(lockId);

  return lock;
};

// Releases lock by specific ID and other additional data
const releaseLock = async (
  pixKey: string,
  amount: Number,
  e2eId: string,
  lockId: string
) => {
  const provider = getProvider();
  if (!provider) return;

  const mockBacenSigner = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const messageToSign = ethers.utils.solidityKeccak256(
    ["string", "uint256", "bytes32"],
    [
      pixKey,
      formatEther(String(amount)),
      ethers.utils.formatBytes32String(e2eId),
    ]
  );

  const messageHashBytes = ethers.utils.arrayify(messageToSign);
  const flatSig = await mockBacenSigner.signMessage(messageHashBytes);
  const sig = ethers.utils.splitSignature(flatSig);

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const release = await p2pContract.release(
    lockId,
    ethers.constants.AddressZero,
    ethers.utils.formatBytes32String(e2eId),
    sig.r,
    sig.s,
    sig.v
  );
  release.wait();
  await updateLockReleasedEvents();
  await updateValidDeposits();

  return release;
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
  updateWalletStatus,
  splitTokens,
  listValidDepositTransactionsByWalletAddress,
  listAllTransactionByWalletAddress,
  listReleaseTransactionByWalletAddress,
  listDepositTransactionByWalletAddress,
  listLockTransactionByWalletAddress,
  approveTokens,
  addDeposit,
  cancelDeposit,
  withdrawDeposit,
  mockDeposit,
  mapDeposits,
  formatBigNumber,
  addLock,
  mapLocks,
  releaseLock,
  updateLockAddedEvents,
  updateValidDeposits,
  getValidDeposits,
};
