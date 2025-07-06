import { useAccountStore } from "~/stores/account";
import { connect } from "~/utils/utility";

export const connectAccount = async () => {
  const accountStore = useAccountStore();
  try {
    const account = await connect();

    return accountStore.setAccount(account);

  } catch (error) {
    console.error("Error connecting to account:", error);
    throw error;
  }
};
