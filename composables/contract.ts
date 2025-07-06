import { ethers } from "ethers";
import { ethereum, getEthereumContract } from "~/utils/utility";

export const contribute = async (amount: any) => {
  if (!ethereum) return alert("Please install metamask!");

  try {
    const contract: any = await getEthereumContract();
    const tx = await contract!.contribute({
      value: ethers.parseEther(amount!.toString()),
    });
    await tx.wait();
  } catch (e) {
    console.error(e);
  }
};

export const getContributors = async () => {
  try {
    const contract: any = await getEthereumContract();
    const contributors = await contract!.getContributors();
    await contributors.wait();
    return contributors;
  } catch (error) {}
};

const withdraw = async () => {
  try {
    const contract: any = getEthereumContract();
    const tx = await contract!.withdraw();
    await tx.wait();
    // toast.add({
    //   title: "Withdraw successful",
    //   color: "green",
    //   position: "top-right",
    // });
    // await loadContractData();
  } catch (e) {
    // toast.add({
    //   title: "Withdraw failed",
    //   color: "red",
    //   position: "top-right",
    // });
    console.error(e);
  }
};

const refund = async () => {
  try {
    const contract: any = getEthereumContract();
    const tx = await contract!.refund();
    await tx.wait();
    // toast.add({
    //   title: "Refund successful",
    //   color: "yellow",
    //   position: "top-right",
    // });
    // await loadContractData();
  } catch (e) {
    // toast.add({ title: "Refund failed", color: "red", position: "top-right" });
    console.error(e);
  }
};

const pause = async () => {
  try {
    const contract: any = getEthereumContract();
    const tx = await contract!.pause();
    await tx.wait();
    // toast.add({
    //   title: "Campaign paused",
    //   color: "red",
    //   position: "top-right",
    // });
  } catch (e) {
    // toast.add({ title: "Pause failed", color: "red", position: "top-right" });
    console.error(e);
  }
};

const resume = async () => {
  try {
    const contract: any = getEthereumContract();

    const tx = await contract!.resume();
    await tx.wait();
    // toast.add({
    //   title: "Campaign resumed",
    //   color: "purple",
    //   position: "top-right",
    // });
  } catch (e) {
    // toast.add({ title: "Resume failed", color: "red", position: "top-right" });
    console.error(e);
  }
};

const listenToEvents = async () => {
  const contract: any = getEthereumContract();

  const history: any = "";
  contract!.on("Contribution", (contributor: any, amount: any, event: any) => {
    history.value.unshift({
      type: "Contribution",
      from: contributor,
      amount: ethers.formatEther(amount),
      tx: event.transactionHash,
    });
  });

  contract.value!.on("Refund", (contributor: any, amount: any, event: any) => {
    history.value.unshift({
      type: "Refund",
      from: contributor,
      amount: ethers.formatEther(amount),
      tx: event.transactionHash,
    });
  });

  contract.value!.on(
    "Withdrawal",
    (contributor: any, amount: any, event: any) => {
      history.value.unshift({
        type: "Withdrawal",
        from: "owner", // Owner address
        amount: ethers.formatEther(amount),
        tx: event.transactionHash,
      });
    }
  );
};
