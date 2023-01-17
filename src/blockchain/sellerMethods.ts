import { getProvider } from "./provider";
import { updateWalletStatus } from "./wallet";
import { getTokenAddress, getP2PixAddress } from "./addresses";
import { parseEther } from "ethers/lib/utils";

import { BigNumber, ethers } from "ethers";

import p2pix from "../utils/smart_contract_files/P2PIX.json";
import mockToken from "../utils/smart_contract_files/MockToken.json";

// Seller Flow methods //

// Approve Tokens
const approveTokens = async (tokenQty: string) => {
  const provider = getProvider();
  const signer = provider.getSigner();

  const tokenContract = new ethers.Contract(
    getTokenAddress(),
    mockToken.abi,
    signer
  );

  const apprv = await tokenContract.approve(
    getP2PixAddress(),
    parseEther(tokenQty)
  );

  await apprv.wait();
  return apprv;
};

// Add deposit
const addDeposit = async (tokenQty: string, pixKey: string) => {
  const provider = getProvider();

  const signer = provider.getSigner();
  const p2pContract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);

  const deposit = await p2pContract.deposit(
    getTokenAddress(),
    parseEther(tokenQty),
    pixKey,
    ethers.utils.formatBytes32String("")
  );

  await deposit.wait();

  await updateWalletStatus();
  // await updateDepositAddedEvents();
  // await updateValidDeposits();
};

// Map deposit
const mapDeposits = async (depositId: BigNumber): Promise<any> => {
  const provider = getProvider();

  const signer = provider.getSigner();
  const contract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);
  const deposit = await contract.mapDeposits(depositId);

  return deposit;
};

export { approveTokens, addDeposit, mapDeposits };
