import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: null as any,
  }),

  actions: {
    setAccount(account: any) {
      this.account = account;
    },
  },
});