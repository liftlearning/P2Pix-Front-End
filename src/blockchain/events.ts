import { useEtherStore } from "@/store/ether";
import { ethers } from "ethers";

import { getProvider } from "./provider";
import { mapDeposits } from "./sellerMethods";
import { getP2PixAddress } from "./addresses";

import p2pix from "../utils/smart_contract_files/P2PIX.json";
import { formatEther } from "ethers/lib/utils";

const getNetworksLiquidity = async () => {
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

  const filterDepositsGoerli = p2pContractGoerli.filters.DepositAdded(null);
  const eventsDepositsGoerli = await p2pContractGoerli.queryFilter(
    filterDepositsGoerli
  );

  const filterDepositsMumbai = p2pContractMumbai.filters.DepositAdded(null);
  const eventsDepositsMumbai = await p2pContractMumbai.queryFilter(
    filterDepositsMumbai
  );

  const depositListGoerli: any[] = await Promise.all(
    eventsDepositsGoerli
      .map(async (deposit) => {
        const mappedDeposit = await p2pContractGoerli.mapDeposits(
          deposit.args?.depositID
        );
        let validDepositGoerli = {};

        if (mappedDeposit.valid) {
          validDepositGoerli = {
            blockNumber: deposit.blockNumber,
            depositID: deposit.args?.depositID,
            remaining: formatEther(mappedDeposit.remaining),
            seller: mappedDeposit.seller,
            pixKey: mappedDeposit.pixTarget,
          };
        }

        return validDepositGoerli;
      })
      .filter((deposit) => deposit)
  );

  const depositListMumbai: any[] = await Promise.all(
    eventsDepositsMumbai
      .map(async (deposit) => {
        const mappedDeposit = await p2pContractMumbai.mapDeposits(
          deposit.args?.depositID
        );
        let validDepositMumbai = {};

        if (mappedDeposit.valid) {
          validDepositMumbai = {
            blockNumber: deposit.blockNumber,
            depositID: deposit.args?.depositID,
            remaining: formatEther(mappedDeposit.remaining),
            seller: mappedDeposit.seller,
            pixKey: mappedDeposit.pixTarget,
          };
        }

        return validDepositMumbai;
      })
      .filter((deposit) => deposit)
  );

  const etherStore = useEtherStore();

  etherStore.setDepositsValidListGoerli(depositListGoerli);
  console.log(depositListGoerli);

  etherStore.setDepositsValidListMumbai(depositListMumbai);
  console.log(depositListMumbai);
};

const getValidDeposits = async (): Promise<any[] | undefined> => {
  const provider = getProvider();
  const signer = provider.getSigner();

  const p2pContract = new ethers.Contract(getP2PixAddress(), p2pix.abi, signer);

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
            remaining: formatEther(mappedDeposit.remaining),
            seller: mappedDeposit.seller,
            pixKey: mappedDeposit.pixTarget,
          };
        }

        return validDeposit;
      })
      .filter((deposit) => deposit)
  );

  // const etherStore = useEtherStore();
  // etherStore.setDepositsValidList(depositList);
  // console.log(depositList)

  return depositList;
};

export { getValidDeposits, getNetworksLiquidity };
