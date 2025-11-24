<template>
  <div>
    <NavBar
      :titles="[
        {text: 'Shop Login', color: '#4CAF50'},
        {text: 'Viruses', color: '#2196F3'},
        {text: 'Compte bancaire', color: '#FF9800'}
      ]"
      @menu-clicked="goTo"
    />
    <h1>Welcome to DrMad app</h1>
    <router-view></router-view>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {useShopStore} from "@/stores/shop.js";
import {useRouter} from "vue-router";
import NavBar from "@/components/NavBar.vue";

const shopStore = useShopStore()
const router = useRouter()

onMounted(() => {
  shopStore.getAllViruses()
})

const goTo = (linkIndex) => {
  const routes = [
    '/shop/login',
    '/shop/items',       // index 1 : Viruses (liste des virus)
    '/bank/account'      // index 2 : Compte bancaire
  ]
  router.push(routes[linkIndex])
}
</script>

<style scoped></style>
