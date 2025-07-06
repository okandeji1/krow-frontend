<template>
  <lazy-navbar />
  <section
    class="min-h-screen flex flex-col items-center justify-center text-white p-6 space-y-8"
    style="
      background: radial-gradient(
          at 0% 0%,
          hsla(253, 16%, 7%, 1) 0,
          transparent 50%
        ),
        radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
        radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
    "
  >
    <div class="text-center max-w-2xl mx-auto space-y-4">
      <h1 class="text-4xl font-bold mb-2">Crowd Funding</h1>
      <p class="leading-relaxed">
        Together, we can create meaningful change. This campaign is dedicated to
        supporting vital initiatives that uplift communities, provide essential
        resources, and build a brighter future for those in need. Every
        contribution, no matter the size, brings us closer to our goal and helps
        make a real difference. Join us on this journey — your support matters,
        and together we can achieve something extraordinary.
      </p>
    </div>

    <div class="flex flex-col items-center">
      <div class="relative mb-2">
        <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="white"
            stroke-width="10"
            fill="transparent"
            opacity="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="white"
            stroke-width="10"
            fill="transparent"
            stroke-dasharray="283"
            :stroke-dashoffset="dashOffset"
            stroke-linecap="round"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-bold">{{ progress }}%</span>
        </div>
      </div>
      <p>Complete</p>
    </div>

    <div class="flex justify-center space-x-8 text-lg font-semibold">
      <div>
        <p>Contributed</p>
        <p>{{ formatEther(totalContributed) }} ETH</p>
      </div>
      <div>
        <p>Goal</p>
        <p>{{ formatEther(fundingGoal) }} ETH</p>
      </div>
    </div>

    <div class="flex justify-center space-x-2 mt-4">
      <UForm
        :schema="schema"
        :state="state"
        @submit="handleContribute"
        class="space-y-4 flex flex-col items-center justify-center"
      >
        <UFormField name="amount">
          <UInput
            highlight
            color="neutral"
            size="xl"
            v-model="state.amount"
            type="number"
            placeholder="Enter amount"
            class="rounded-lg p-2 text-black"
          />
        </UFormField>
        <UButton
          type="submit"
          class="cursor-pointer p-3 w-64 font-bold text-xl"
          color="neutral"
          icon="i-lucide-rocket"
          variant="solid"
          :loading="loading"
          >Fund
        </UButton>
      </UForm>
    </div>

    <!-- Only Owner -->
    <div v-if="isOwner">
      <div class="grid grid-cols-2 gap-2">
        <UButton color="green">Withdraw (Owner)</UButton>
        <UButton color="yellow">Refund</UButton>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <UButton color="red">Pause</UButton>
        <UButton color="purple">Resume</UButton>
      </div>
    </div>

    <div class="w-full max-w-2xl mt-8">
      <UCard>
        <UTable :data="contributors" :columns="columns" sticky class="flex-1">
          <template #amount-cell="{ row }">
            <span>{{ formatEther(row.original.amount) }}</span>
          </template>
        </UTable>
      </UCard>
    </div>
  </section>
  <lazy-footer />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { ethers } from "ethers";
import { useAccountStore } from "~/stores/account";
import { formatTimestamp, getEthereumContract } from "~/utils/utility";
import { connectAccount } from "~/composables/accountAuth";
import Joi from "joi";
import { contribute } from "~/composables/contract";
import type { FormSubmitEvent } from "@nuxt/ui/.";

const accountStore = useAccountStore();

// @ts-ignore
const toast = useToast();

const fundingGoal = ref("0");
const totalContributed = ref("0");
const timeLeft = ref(0);
const contributors = ref([]);
const columns = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }: { row: { index: number } }) => row.index + 1,
  },
  {
    accessorKey: "contributor",
    header: "Contributors",
    cell: ({ row }: { row: { getValue: (key: string) => any } }) =>
      row.getValue("contributor"),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: { row: { getValue: (key: string) => any } }) =>
      row.getValue("amount"),
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }: { row: { getValue: (key: string) => any } }) => {
      return formatTimestamp(row.getValue("timestamp"));
    },
  },
];
const loading = ref(false);

const schema = Joi.object({
  amount: Joi.number().positive().greater(0).required(),
});

const state = reactive({
  amount: null as number | null,
});

const ownerAddress = ref<string | null>(null);
const isOwner = computed(() => {
  return (
    accountStore?.account?.toLowerCase() === ownerAddress.value?.toLowerCase()
  );
});

const progress: any = computed(() => {
  if (fundingGoal.value === "0") return 0;
  const goal = Number(ethers.formatEther(fundingGoal.value));
  const total = Number(ethers.formatEther(totalContributed.value));
  return Math.min(Math.round((total / goal) * 100), 100);
});

const dashOffset = computed(() => {
  const circumference = 2 * Math.PI * 45;
  return circumference - (progress / 100) * circumference;
});

const loadOwner = async () => {
  const contract = await getEthereumContract();
  ownerAddress.value = await contract!.owner();
};

const loadContractData = async () => {
  const contract: any = await getEthereumContract();
  fundingGoal.value = (await contract!.fundingGoal()).toString();
  totalContributed.value = (await contract!.totalContributed()).toString();
  timeLeft.value = Number(await contract!.getTimeLeft());
  contributors.value = await contract!.getContributors();
};

const handleContribute = async (event: FormSubmitEvent<typeof state>) => {
  loading.value = true;
  try {
    await contribute(state.amount);
    toast.add({
      title: "Success!",
      description: `You contributed ${state.amount} ETH.`,
      color: "success",
      icon: "i-lucide-check",
      position: "top-right",
    });
    state.amount = null;
    loadContractData();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Contribution failed. Please try again.",
      icon: "i-lucide-check",
      color: "danger",
      position: "top-right",
    });
  }finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadOwner();
  connectAccount();
  // Auto refresh
  loadContractData();
});

// onUnmounted(() => {
//   contract?.removeAllListeners();
// });

const formatEther = (val: any) => ethers.formatEther(val);
</script>
