import { useAccountStore } from "~/stores/account";
import { connect } from "~/utils/utility";

export const connectAccount = async () => {
  const accountStore = useAccountStore();
  try {
    const account = await connect();

    accountStore.setAccount(account);

    return window.location.reload();

  } catch (error) {
    console.error("Error connecting to account:", error);
  }
};
