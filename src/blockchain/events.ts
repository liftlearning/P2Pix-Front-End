import { useEtherStore } from "@/store/ether";
import { Contract, ethers } from "ethers";

import p2pix from "../utils/smart_contract_files/P2PIX.json";
import { formatEther } from "ethers/lib/utils";
import { getProvider } from "./provider";
import { getP2PixAddress } from "./addresses";
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
    "0x5f3EFA9A90532914545CEf527C530658af87e196",
    p2pix.abi,
    goerliProvider
  );
  const p2pContractMumbai = new ethers.Contract(
    "0x5f3EFA9A90532914545CEf527C530658af87e196",
    p2pix.abi,
    mumbaiProvider
  );

  const depositListGoerli = await getValidDeposits(p2pContractGoerli);

  const depositListMumbai = await getValidDeposits(p2pContractMumbai);

  etherStore.setDepositsValidListGoerli(depositListGoerli);
  console.log(depositListGoerli);

  etherStore.setDepositsValidListMumbai(depositListMumbai);
  console.log(depositListMumbai);
};

const getValidDeposits = async (contract?: Contract): Promise<ValidDeposit[]> => {
  let p2pContract: Contract;

  if (contract) {
    p2pContract = contract;
  } else {
    const provider = getProvider();
    const signer = provider.getSigner();

    p2pContract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);
  }

  const filterDeposits = p2pContract.filters.DepositAdded(null);
  const eventsDeposits = await p2pContract.queryFilter(filterDeposits);

  const depositList = await Promise.all(
    eventsDeposits
      .map(async (deposit) => {
        const mappedDeposit = await p2pContract.mapDeposits(
          deposit.args?.depositID
        );
        let validDeposit = {};

        if (mappedDeposit.valid) {
          validDeposit = {
            blockNumber: deposit.blockNumber,
            depositID: deposit.args?.depositID,
            remaining: formatEther(mappedDeposit.remaining),
            seller: mappedDeposit.seller,
            pixKey: mappedDeposit.pixTarget,
          };
        }

        return validDeposit;
      })
      .filter((deposit) => deposit)
  );

  return depositList as ValidDeposit[];
};

export { getValidDeposits, getNetworksLiquidity };
