<template>
  <UContainer class="py-10">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">🚀 Crowdfunding DApp</h1>
      </template>

      <div class="space-y-4">
        <UProgress :value="progress" size="lg" color="primary" />

        <div class="flex justify-between text-sm">
          <span>Goal: {{ formatEther(fundingGoal) }} ETH</span>
          <span>Contributed: {{ formatEther(totalContributed) }} ETH</span>
          <span>Time Left: {{ timeLeft }}s</span>
        </div>

        <UInput
          v-model="contributeAmount"
          placeholder="ETH to contribute"
          type="number"
          class="w-full"
        />
        <UButton block color="primary">Contribute</UButton>

        <div class="grid grid-cols-2 gap-2">
          <UButton color="green">Withdraw (Owner)</UButton>
          <UButton color="yellow" >Refund</UButton>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <UButton color="red">Pause</UButton>
          <UButton color="purple" >Resume</UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { ethers, BrowserProvider } from 'ethers'

// @ts-ignore
const toast = useToast()
const history = ref<{ type: string; from: string; amount: string; tx: string }[]>([])

const fundingGoal = ref('0')
const totalContributed = ref('0')
const timeLeft = ref(0)
const contributeAmount = ref<number>()

const progress = computed(() => {
  if (fundingGoal.value === '0') return 0
  const goal = Number(ethers.formatEther(fundingGoal.value))
  const total = Number(ethers.formatEther(totalContributed.value))
  return Math.min((total / goal) * 100, 100)
})

// const loadContractData = async () => {
//   fundingGoal.value = (await contract.value!.fundingGoal()).toString()
//   totalContributed.value = (await contract.value!.totalContributed()).toString()
//   timeLeft.value = Number(await contract.value!.getTimeLeft())
// }

// const connect = async () => {
//   await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
//   const s = await provider.getSigner()
//   signer.value = s;
//   const addr = await s.getAddress()
//     connectedAccount.value = addr
//     isConnected.value = true
//   contract.value = new ethers.Contract(contractAddress, contractABI, signer.value)
//   await loadContractData()
// }

// const connectWallet = async () => {
//   try {
//     await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
//     const s = await provider.getSigner()
//     signer.value = s
//     const addr = await s.getAddress()
//     connectedAccount.value = addr
//     isConnected.value = true
//     contract.value = new ethers.Contract(contractAddress, contractABI, signer.value)

//     await loadContractData()
//     await loadMilestones()
//     listenToEvents()
//   } catch (e) {
//     toast.add({ title: 'Connection failed', color: 'red' })
//     console.error(e)
//   }
// }

// // Actions
// const contribute = async () => {
//   try {
//     const tx = await contract.value!.contribute({
//       value: ethers.parseEther(contributeAmount.value!.toString())
//     })
//     await tx.wait()
//     toast.add({ title: 'Contribution successful!', color: 'primary', position: "top-right", })
//     await loadContractData()
//   } catch (e) {
//     toast.add({ title: 'Contribution failed', color: 'red', position: "top-right", })
//     console.error(e)
//   }
// }

// const withdraw = async () => {
//   try {
//     const tx = await contract.value!.withdraw()
//     await tx.wait()
//     toast.add({ title: 'Withdraw successful', color: 'green', position: "top-right", })
//     await loadContractData()
//   } catch (e) {
//     toast.add({ title: 'Withdraw failed', color: 'red', position: "top-right", })
//     console.error(e)
//   }
// }

// const refund = async () => {
//   try {
//     const tx = await contract.value!.refund()
//     await tx.wait()
//     toast.add({ title: 'Refund successful', color: 'yellow', position: "top-right", })
//     await loadContractData()
//   } catch (e) {
//     toast.add({ title: 'Refund failed', color: 'red', position: "top-right", })
//     console.error(e)
//   }
// }

// const pause = async () => {
//   try {
//     const tx = await contract.value!.pause()
//     await tx.wait()
//     toast.add({ title: 'Campaign paused', color: 'red', position: "top-right", })
//   } catch (e) {
//     toast.add({ title: 'Pause failed', color: 'red', position: "top-right", })
//     console.error(e)
//   }
// }

// const resume = async () => {
//   try {
//     const tx = await contract.value!.resume()
//     await tx.wait()
//     toast.add({ title: 'Campaign resumed', color: 'purple', position: "top-right", })
//   } catch (e) {
//     toast.add({ title: 'Resume failed', color: 'red', position: "top-right", })
//     console.error(e)
//   }
// }

// const listenToEvents = async () => {
//   contract.value!.on('Contribution', (contributor, amount, event) => {
//     history.value.unshift({
//       type: 'Contribution',
//       from: contributor,
//       amount: ethers.formatEther(amount),
//       tx: event.transactionHash
//     })
//   })

//   contract.value!.on('Refund', (contributor, amount, event) => {
//     history.value.unshift({
//       type: 'Refund',
//       from: contributor,
//       amount: ethers.formatEther(amount),
//       tx: event.transactionHash
//     })
//   })

//   contract.value!.on('Withdrawal', (owner, amount, event) => {
//     history.value.unshift({
//       type: 'Withdrawal',
//       from: owner,
//       amount: ethers.formatEther(amount),
//       tx: event.transactionHash
//     })
//   })
// }


// onMounted(() => {
//   connect()
//   // Auto refresh
//   setInterval(loadContractData, 5000)
// });

// onUnmounted(() => {
//   contract.value?.removeAllListeners()
// })

const formatEther = (val: string) => ethers.formatEther(val)
</script>
