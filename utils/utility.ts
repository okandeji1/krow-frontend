import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const ethereum = (window as any)?.ethereum;

export const shortenAddress = (address: any) =>
  `${address?.slice(0, 5)}...${address?.slice(address.length - 4)}`;

export const getEthereumContract = async () => {
  try {
    if (!ethereum) return alert("Please install metamask!");

    // Local deployment
    // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
    if (typeof window !== "undefined") {
      // Safe to use window, self, ethers, MetaMask
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract: ethers.Contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      return contract;
    }
  } catch (e) {
    console.error(e);
  }
};

export const connect = async () => {
  try {
    if (!ethereum) return alert("Please install metamask!");

    const accounts = await ethereum?.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    throw new Error("No ethereum object connected!");
  }
};

export const formatTimestamp = (bigintTs: bigint): string => {
  const date = new Date(Number(bigintTs) * 1000);
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
