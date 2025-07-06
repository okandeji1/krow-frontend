<template>
  <footer class="w-full border-t border-border-color py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-foreground">
    <p class="text-sm text-center md:text-left">
      © {{ year }} Theokandeji. All rights reserved.
    </p>

    <UNavigationMenu :items="items" variant="link" color="neutral" highlight
    highlight-color="foreground" class="flex-wrap justify-center md:justify-start" />

    <div class="flex gap-2">
      <UButton
        icon="i-simple-icons-facebook"
        variant="ghost"
        color="foreground"
        to="#"
        aria-label="Facebook"
      />
      <UButton
        icon="i-simple-icons-x"
        variant="ghost"
        color="foreground"
        to="#"
        aria-label="X (Twitter)"
      />
      <UButton
        icon="i-simple-icons-telegram"
        variant="ghost"
        color="foreground"
        to="#"
        aria-label="Telegram"
      />
      <UButton
        icon="i-simple-icons-instagram"
        variant="ghost"
        color="foreground"
        to="#"
        aria-label="Instagram"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Terms of Use',
    to: '#',
    target: '_blank'
  },
  {
    label: 'Privacy Policy',
    to: '#'
  },
  {
    label: 'FAQ',
    to: '#',
    target: '_blank'
  },
  {
    label: 'Contact',
    to: '#',
    target: '_blank'
  }
]

const year = new Date().getFullYear()
</script>