import { useEtherStore } from "@/store/ether";
import { Contract, ethers } from "ethers";

import p2pix from "../utils/smart_contract_files/P2PIX.json";
import { formatEther } from "ethers/lib/utils";
import { getContract } from "./provider";
import type { ValidDeposit } from "@/model/ValidDeposit";

const getNetworksLiquidity = async (): Promise<void> => {
  const etherStore = useEtherStore();
  console.log("Loading events");

  const goerliProvider = new ethers.providers.JsonRpcProvider(
    import.meta.env.VITE_GOERLI_API_URL,
    5
  ); // goerli provider
  const mumbaiProvider = new ethers.providers.JsonRpcProvider(
    import.meta.env.VITE_MUMBAI_API_URL,
    80001
  ); // mumbai provider

  const p2pContractGoerli = new ethers.Contract(
    "0x2414817FF64A114d91eCFA16a834d3fCf69103d4",
    p2pix.abi,
    goerliProvider
  );
  const p2pContractMumbai = new ethers.Contract(
    "0x4A2886EAEc931e04297ed336Cc55c4eb7C75BA00",
    p2pix.abi,
    mumbaiProvider
  );

  const depositListGoerli = await getValidDeposits(
    "0x4A2886EAEc931e04297ed336Cc55c4eb7C75BA00",
    p2pContractGoerli
  );

  const depositListMumbai = await getValidDeposits(
    "0xC86042E9F2977C62Da8c9dDF7F9c40fde4796A29",
    p2pContractMumbai
  );

  etherStore.setDepositsValidListGoerli(depositListGoerli);
  console.log(depositListGoerli);

  etherStore.setDepositsValidListMumbai(depositListMumbai);
  console.log(depositListMumbai);
};

const getValidDeposits = async (
  token: string,
  contract?: Contract
): Promise<ValidDeposit[]> => {
  let p2pContract: Contract;

  if (contract) {
    p2pContract = contract;
  } else {
    p2pContract = getContract(true);
  }

  const filterDeposits = p2pContract.filters.DepositAdded(null);
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);

  if (!contract) p2pContract = getContract(); // get metamask provider contract
  const depositList: { [key: string]: ValidDeposit } = {};

  await Promise.all(
    eventsDeposits.map(async (deposit) => {
      // Get liquidity only for the selected token
      if (deposit.args?.token != token) return null;

      const mappedBalance = await p2pContract.getBalance(
        deposit.args?.seller,
        token
      );

      const mappedPixTarget = await p2pContract.getPixTarget(
        deposit.args?.seller,
        token
      );

      let validDeposit: ValidDeposit | null = null;

      if (mappedBalance._hex) {
        validDeposit = {
          token: token,
          blockNumber: deposit.blockNumber,
          remaining: Number(formatEther(mappedBalance._hex)),
          seller: deposit.args?.seller,
          pixKey: Number(mappedPixTarget._hex),
        };
      }

      if (validDeposit)
        depositList[deposit.args?.seller + token] = validDeposit;
    })
  );

  return Object.values(depositList);
};

export { getValidDeposits, getNetworksLiquidity };
