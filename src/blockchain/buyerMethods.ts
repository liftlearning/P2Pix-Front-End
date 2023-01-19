import { useEtherStore } from "@/store/ether";

import { getProvider } from "./provider";
import { getP2PixAddress } from "./addresses";

import p2pix from "../utils/smart_contract_files/P2PIX.json";

import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";

// Buyer Flow methods //

// Make lock
const addLock = async (depositId: BigNumber, amount: number): Promise<any> => {
  const etherStore = useEtherStore();

  const provider = getProvider();
  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);

  const lock = await p2pContract.lock(
    depositId, // BigNumber
    etherStore.walletAddress, // String "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" (Example)
    ethers.constants.AddressZero, // String "0x0000000000000000000000000000000000000000"
    0,
    parseEther(String(amount)), // BigNumber
    [],
    []
  );
  lock.wait();

  return lock;
};

// Release lock
const releaseLock = async (
  pixKey: string,
  amount: Number,
  e2eId: string,
  lockId: string
): Promise<any> => {
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
  const provider = getProvider();

  const sig = ethers.utils.splitSignature(flatSig);

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);

  const release = await p2pContract.release(
    lockId,
    ethers.constants.AddressZero,
    ethers.utils.formatBytes32String(e2eId),
    sig.r,
    sig.s,
    sig.v
  );
  release.wait();

  return release;
};

const cancelDeposit = async (depositId: BigNumber): Promise<boolean> => {
  const provider = getProvider();

  const signer = provider.getSigner();
  const contract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);
  await contract.cancelDeposit(depositId);

  // await updateWalletBalance();
  // await updateValidDeposits();
  return true;
};

const withdrawDeposit = async (depositId: BigNumber): Promise<boolean> => {
  const provider = getProvider();

  if (!provider) return false;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);
  await contract.withdraw(depositId, []);

  // // await updateWalletBalance();
  // await updateValidDeposits();
  return true;
};

// Releases lock by specific ID and other additional data

export { cancelDeposit, withdrawDeposit, addLock, releaseLock };
