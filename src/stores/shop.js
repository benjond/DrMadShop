import { onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

import ShopService from '@/services/shop.service'

export const useShopStore = defineStore('shop', () => {

  const viruses = ref([]);
  const shopUser = ref(null);
  const basket = ref({
    items: []
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
    let response = await ShopService.shopLogin(data);
    if (response.error === 0) {
      shopUser.value = response.data;
      await getBasket();
    }
    else {
      console.log(response.data);
    }
    return response
  }

  async function getAllViruses() {
    let response = await ShopService.getAllViruses();
    if (response.error === 0) {
      viruses.value = response.data;
    }
    else {
      console.log(response.data);
    }
    return response
  }

  async function getBasket() {
    if (!shopUser.value) return;
    let response = await ShopService.getBasket({ _id: shopUser.value._id });
    if (response.error === 0) {
      basket.value = response.data;
      shopUser.value.basket = response.data;
    } else {
      console.error(response.data);
    }
    return response;
  }

  async function addToBasket(item, amount) {
    if (!shopUser.value.basket) {
      shopUser.value.basket = { items: [] };
    }
    if (!shopUser.value.basket.items || !Array.isArray(shopUser.value.basket.items)) {
      shopUser.value.basket.items = [];
    }

    const currentItems = shopUser.value.basket.items;


    const itemId = item._id || item;

    const existingItemIndex = currentItems.findIndex(i => {
      const iId = i.item._id || i.item;
      return iId === itemId;
    });

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].amount += amount;
    } else {
      currentItems.push({ item: itemId, amount });
    }

    try {
      const response = await ShopService.updateBasket({ _id: shopUser.value._id, basket: shopUser.value.basket });
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

  async function removeFromBasket(index) {
    if (!shopUser.value || !shopUser.value.basket || !shopUser.value.basket.items) return;

  x
    shopUser.value.basket.items.splice(index, 1);

    try {
      const response = await ShopService.updateBasket({ _id: shopUser.value._id, basket: shopUser.value.basket });
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
    if (!shopUser.value) return;

    shopUser.value.basket = { items: [] };

    try {
      const response = await ShopService.updateBasket({ _id: shopUser.value._id, basket: shopUser.value.basket });
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

  // Commandes

  async function createOrder() {
    if (!shopUser.value || !shopUser.value.basket) return { error: 1, data: 'No user or basket' };

    let response = await ShopService.orderBasket(shopUser.value._id, shopUser.value.basket);
    if (response.error === 0) {
      basket.value = { items: [] };
      shopUser.value.basket = { items: [] };
    }
    return response;
  }

  async function getAllOrders() {
    if (!shopUser.value) return;

    let response = await ShopService.getAllOrders(shopUser.value._id);
    if (response.error === 0) {
      shopUser.value.orders = response.data;
    }
    return response;
  }

  async function payOrder(uuid, transactionUuid) {
    if (!shopUser.value) return;
    let response = await ShopService.payOrder(uuid, shopUser.value._id, transactionUuid);
    if (response.error === 0) {
      await getAllOrders();
    }
    return response;
  }

  async function cancelOrder(uuid) {
    if (!shopUser.value) return;
    let response = await ShopService.cancelOrder(uuid, shopUser.value._id);
    if (response.error === 0) {
      await getAllOrders();
    }
    return response;
  }

  return {
    viruses,
    shopUser,
    basket,
    shopLogin,
    getAllViruses,
    addToBasket,
    removeFromBasket,
    clearBasket,
    createOrder,
    getAllOrders,
    payOrder,
    cancelOrder
  };
})
