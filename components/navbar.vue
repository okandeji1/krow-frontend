<template>
  <nav
    class="w-full flex items-center justify-between p-4 bg-transparent shadow-md ... text-white"
  >
    <!-- Left: Logo + Name -->
    <div class="flex items-center space-x-2">
      <!-- You can replace with actual logo image or SVG -->
      <!-- <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
      </svg> -->
      <div class="md:flex-[0.5] flex-initial justify-center items-center">
        <img
          src="~/assets/images/logo.png"
          alt="Logo"
          class="w-32 cursor-pointer"
        />
      </div>
      <span class="font-bold text-lg">Theokandeji</span>
    </div>

    <!-- Desktop Nav: Login button -->
    <div class="hidden md:flex">
      <UButton
        color="white"
        variant="outline"
        v-if="!accountStore.account"
        @click="connectWallet"
        >Connect Wallet</UButton
      >
      <span v-else class="text-sm text-gray-500">
        Connected: {{ shortenAddress(accountStore.account) }}
      </span>
    </div>

    <!-- Hamburger (mobile) -->
    <button @click="toggleMenu" class="md:hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div
    v-if="menuOpen"
    class="md:hidden bg-black bg-opacity-80 text-white p-4 space-y-2"
  >
    <UButton
      color="white"
      variant="outline"
      v-if="!accountStore.account"
      @click="connectWallet"
      >Connect Wallet</UButton
    >
    <span v-else class="text-sm text-gray-500">
      Connected: {{ shortenAddress(accountStore.account) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { shortenAddress } from "~/utils/utility";
import { useAccountStore } from "~/stores/account";
import { connectAccount } from "~/composables/accountAuth";

const accountStore = useAccountStore();

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const connectWallet = async () => {
  await connectAccount();
};
</script>
