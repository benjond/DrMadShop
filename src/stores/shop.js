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
    // If user is already loaded/persisted, we might want to fetch their basket
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
      // Fetch basket for logged in user
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
    if (!shopUser.value) {
      console.warn('User not logged in, cannot add to basket');
      return;
    }

    // Ensure basket structure exists
    if (!shopUser.value.basket) {
      shopUser.value.basket = { items: [] };
    }
    // Clone local basket to avoid direct mutation issues before save, or just use it.
    // The previous implementation was modifying shopUser.value.basket directly then saving it.

    // Check if item already in basket
    const existingItemIndex = shopUser.value.basket.items.findIndex(i => (i.item._id === item._id) || (i.item === item._id));

    if (existingItemIndex !== -1) {
      shopUser.value.basket.items[existingItemIndex].amount += amount;
    } else {
      shopUser.value.basket.items.push({ item: item._id, amount }); // Store only ID as per spec? Local source seems to handle objects or IDs. Storing ID is safer for persistence consistency.
    }

    // Update basket in backend or local storage
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
    if (!shopUser.value || !shopUser.value.basket) return;

    // Remove item at specific index
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

  // Order actions

  async function createOrder() {
    if (!shopUser.value || !shopUser.value.basket) return { error: 1, data: 'No user or basket' };

    let response = await ShopService.orderBasket(shopUser.value._id, shopUser.value.basket);
    if (response.error === 0) {
      // Clear basket locally as well since the backend does it
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
      // Refresh orders to update status
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
