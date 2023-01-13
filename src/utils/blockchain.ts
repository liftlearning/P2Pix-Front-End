import { useEtherStore } from "@/store/ether";
import { BigNumber, ethers } from "ethers";

// Smart contract imports
import mockToken from "./smart_contract_files/MockToken.json";
import p2pix from "./smart_contract_files/P2PIX.json";
import addresses from "./smart_contract_files/localhost.json";
// Mock wallets import
import { wallets } from "./smart_contract_files/wallets.json";
import { getProvider } from "../blockchain/provider";

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
    // updateWalletStatus();
  }
};

// get all wallet transactions
const listAllTransactionByWalletAddress = async (
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

// get wallet's deposit transactions
const listDepositTransactionByWalletAddress = async (
  walletAddress: string
): Promise<any[]> => {
  const provider = getProvider();
  if (!provider) return [];

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pContract.filters.DepositAdded([walletAddress]);
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);

  return eventsDeposits.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });
};

// get wallet's deposit transactions
const listValidDepositTransactionsByWalletAddress = async (
  walletAddress: string
): Promise<any[]> => {
  const walletDeposits = await getValidDeposits();
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
): Promise<any[] | undefined> => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterAddedLocks = p2pContract.filters.LockAdded([walletAddress]);
  const eventsAddedLocks = await p2pContract.queryFilter(filterAddedLocks);

  return eventsAddedLocks.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });
};

// get wallet's release transactions
const listReleaseTransactionByWalletAddress = async (
  walletAddress: string
): Promise<any[] | undefined> => {
  const provider = getProvider();
  if (!provider) return;

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterReleasedLocks = p2pContract.filters.LockReleased([walletAddress]);
  const eventsReleasedLocks = await p2pContract.queryFilter(
    filterReleasedLocks
  );

  return eventsReleasedLocks.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });
};

//get valid deposits
const getValidDeposits = async (): Promise<any[] | undefined> => {
  const window_ = window as any;
  const connection = window_.ethereum;
  let provider: ethers.providers.Web3Provider | null = null;

  if (!connection) return [];

  provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);

  const filterDeposits = p2pContract.filters.DepositAdded(null);
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);

  const depositList: any[] = await Promise.all(
    eventsDeposits
      .map(async (deposit) => {
        const mappedDeposit = await mapDeposits(deposit.args?.depositID);
        let validDeposit = {};

        if (mappedDeposit.valid) {
          validDeposit = {
            blockNumber: deposit.blockNumber,
            depositID: deposit.args?.depositID,
            remaining: formatBigNumber(mappedDeposit.remaining),
            seller: mappedDeposit.seller,
            pixKey: mappedDeposit.pixTarget,
          };
        }

        return validDeposit;
      })
      .filter((deposit) => deposit)
  );

  return depositList;
};

// Update events at store methods
const updateValidDeposits = async () => {
  const etherStore = useEtherStore();
  const deposits = await getValidDeposits();
  if (deposits) etherStore.setDepositsValidList(deposits);
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
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);

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

  // await updateWalletStatus();
  await updateValidDeposits();
  await updateDepositAddedEvents();
};

// Get specific deposit data by its ID
const mapDeposits = async (depositId: BigNumber): Promise<any> => {
  const provider = getProvider();

  if (!provider) return;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(addresses.p2pix, p2pix.abi, signer);
  const deposit = await contract.mapDeposits(depositId);

  return deposit;
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
  formatEther,
  splitTokens,
  listValidDepositTransactionsByWalletAddress,
  listAllTransactionByWalletAddress,
  listReleaseTransactionByWalletAddress,
  listDepositTransactionByWalletAddress,
  listLockTransactionByWalletAddress,
  mockDeposit,
  mapDeposits,
  formatBigNumber,
  mapLocks,
  updateLockAddedEvents,
  updateValidDeposits,
  getValidDeposits,
  updateLockReleasedEvents,
};
