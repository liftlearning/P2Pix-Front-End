import { useEtherStore } from "@/store/ether";

import { getProvider, getContract } from "./provider";
import { getTokenAddress, possibleChains } from "./addresses";

import mockToken from "../utils/smart_contract_files/MockToken.json";

import { ethers, type Event } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { getValidDeposits } from "./events";
import type { ValidDeposit } from "@/model/ValidDeposit";
import type { Pix } from "@/model/Pix";
import type { UnreleasedLock } from "@/model/UnreleasedLock";

const updateWalletStatus = async (): Promise<void> => {
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

const listValidDepositTransactionsByWalletAddress = async (
  walletAddress: string
): Promise<ValidDeposit[]> => {
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

const listAllTransactionByWalletAddress = async (
  walletAddress: string
): Promise<Event[]> => {
  const p2pContract = getContract();

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

// list all Locks added by wallet adress
const listValidLocksByWalletAddress = async (
  walletAddress: string
): Promise<Event[]> => {
  const p2pContract = getContract(true);

  const filterAddedLocks = p2pContract.filters.LockAdded([walletAddress]);
  const eventsAddedLocks = await p2pContract.queryFilter(filterAddedLocks);

  return eventsAddedLocks;
};

// list all Locks released by wallet adress
const listReleasedLocksByWalletAddress = async (
  walletAddress: string
): Promise<Event[]> => {
  const p2pContract = getContract(true);

  const filterReleasedLocks = p2pContract.filters.LockReleased([walletAddress]);
  const eventsReleasedLocks = await p2pContract.queryFilter(
    filterReleasedLocks
  );
  return eventsReleasedLocks;
};

// check locks added but didnt released
const checkUnreleasedLocks = async (
  walletAddress: string
): Promise<UnreleasedLock | undefined> => {
  const addedLocks = await listValidLocksByWalletAddress(walletAddress);
  const releasedLocks = await listReleasedLocksByWalletAddress(walletAddress);

  const pixData: Pix = {
    pixKey: "",
  };

  // check if there is any addedLock or if all addedLock has been released
  if (addedLocks.length === 0 || addedLocks.length === releasedLocks.length) {
    return;
  }

  const p2pContract = getContract();
  let lock: Event | undefined;
  // check if there is any releasedLock
  if (releasedLocks.length === 0) {
    lock = addedLocks[0];

    const mappedDeposit = await p2pContract.mapDeposits(lock?.args?.depositID);

    const pixTarget = mappedDeposit.pixTarget;
    const amount = formatEther(lock?.args?.amount);
    pixData.pixKey = pixTarget;
    pixData.value = Number(amount);
  } else {
    // pick the first lock added that hasnt been released
    lock = addedLocks.find((addedLock) =>
      releasedLocks.some(
        (releasedLock) => releasedLock?.args?.lockId != addedLock?.args?.lockID
      )
    );

    const mappedDeposit = await p2pContract.mapDeposits(lock?.args?.depositID);

    const pixTarget = mappedDeposit.pixTarget;
    const amount = formatEther(lock?.args?.amount);
    pixData.pixKey = pixTarget;
    pixData.value = Number(amount);
  }

  return {
    lockID: lock?.args?.lockID,
    pix: pixData,
  };
};

export {
  updateWalletStatus,
  listValidDepositTransactionsByWalletAddress,
  listAllTransactionByWalletAddress,
  listValidLocksByWalletAddress,
  listReleasedLocksByWalletAddress,
  checkUnreleasedLocks,
};
