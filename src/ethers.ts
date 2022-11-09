import { ethers } from "ethers";

const getProvider = async (): Promise<ethers.providers.Web3Provider> => {
    const window_ = window as any;

    if(window_.ethereum){

        const provider = new ethers.providers.Web3Provider(window_.ethereum)

        const walletAddress = await provider.send("eth_requestAccounts", []);
        const balance = await provider.getBalance(walletAddress[0]);
        console.log(walletAddress);
        console.log(ethers.utils.formatEther(balance));

        return provider
    }
    else
        console.log("Browser não suporta conexão com metamask")
};

export default { getProvider };