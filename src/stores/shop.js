import { onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

import ShopService from '@/services/shop.service'

export const useShopStore = defineStore('shop', () => {

  const viruses = ref([]);
  const shopUser = ref(null);
  const basket = ref({
    items: [{
      item: {type: String, required: true, ref: 'Item'},
      amount: {type: Number, required: true, min:0}, 
    }]
  });

  onBeforeMount(() => {
    if (shopUser.value) {
      updateBasket(shopUser.value.basket);
    }
  })

  async function updateBasket(data) {
    let response = await ShopService.updateBasket(data);
    if (response.error === 0) {
      basket.value = response.data;
    }
    else {
      console.log(response.data);
    }
    return response
  }

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

  async function addToBasket(item, amount) {
    if (!shopUser.value) {
      console.warn('User not logged in, cannot add to basket');
      return;
    }

    if (!shopUser.value.basket) {
      shopUser.value.basket = { items: [] };
    }

    const existingItem = shopUser.value.basket.items.find(i => i.item._id === item._id);
    if (existingItem) {
      existingItem.amount += amount;
    } else {
      shopUser.value.basket.items.push({ item, amount });
    }

    // Update basket in backend or local storage
    try {
      const response = await ShopService.updateBasket(shopUser.value.basket);
      if (response.error === 0) {
        basket.value = response.data;
        shopUser.value.basket = response.data;
      } else {
        console.error(response.data);
      }
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  async function removeFromBasket(itemId) {
    if (!shopUser.value) {
      console.warn('User not logged in, cannot remove from basket');
      return;
    }

    if (!shopUser.value.basket) {
      shopUser.value.basket = { items: [] };
    }

    shopUser.value.basket.items = shopUser.value.basket.items.filter(i => i.item._id !== itemId);

    try {
      const response = await ShopService.updateBasket(shopUser.value.basket);
      if (response.error === 0) {
        basket.value = response.data;
        shopUser.value.basket = response.data;
      } else {
        console.error(response.data);
      }
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  async function clearBasket() {
    if (!shopUser.value) {
      console.warn('User not logged in, cannot clear basket');
      return;
    }

    shopUser.value.basket = { items: [] };

    try {
      const response = await ShopService.updateBasket(shopUser.value.basket);
      if (response.error === 0) {
        basket.value = response.data;
        shopUser.value.basket = response.data;
      } else {
        console.error(response.data);
      }
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  return { viruses, shopUser, basket, shopLogin, getAllViruses, addToCart, addToBasket, removeFromBasket, clearBasket };
})
