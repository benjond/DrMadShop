<script setup>

import CheckedList from "@/components/CheckedList.vue";
import { useShopStore } from "@/stores/shop";
const shopStore = useShopStore();
</script>

<template>
    <span>Basket List Component</span>
    <CheckedList
        :data="shopStore.basket.items"
        :fields="['name', 'price', 'description','promotion','amount']"
        :itemAmount="true"
        :itemButton="{ show: true, text: 'Retirer du panier' }"
        @checked-changed="shopStore.up"
        @item-button-clicked="shopStore.removeFromBasket"
    />
</template>

<style>
</style>