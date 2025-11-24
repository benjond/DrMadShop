import { ref } from 'vue'
import { defineStore } from 'pinia'

import ShopService from '@/services/shop.service'

export const useShopStore = defineStore('shop', () => {

  const viruses = ref([]);
  const shopUser = ref(null);
  const basket = ref({
    items: []
  });

  async function shopLogin(data) {
    console.log('login');
    let response = await ShopService.shopLogin(data);
    if (response.error === 0) {
      shopUser.value = response.data;
    }
    else {
      console.log(response.data);
    }
    return response
  }

  async function getAllViruses() {
    console.log('récupération des viruses');
    let response = await ShopService.getAllViruses();
    if (response.error === 0) {
      viruses.value = response.data;
    }
    else {
      console.log(response.data);
    }
    return response
  }

  function addToCart(item, amount) {
    if (shopUser.value) {
      if (!shopUser.value.basket) {
        shopUser.value.basket = { items: [] };
      }

      const existingItem = shopUser.value.basket.items.find(i => i.item._id === item._id);
      if (existingItem) {
        existingItem.amount += amount;
      } else {
        shopUser.value.basket.items.push({ item, amount });
      }
    } else {
      console.warn('User not logged in, cannot add to cart');
    }
  }

  return { viruses, shopUser, basket, shopLogin, getAllViruses, addToCart };
})
