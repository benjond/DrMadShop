<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CheckedList from "@/components/CheckedList.vue";
import { useShopStore } from "@/stores/shop";

const shopStore = useShopStore();
const router = useRouter();
const selectedIndices = ref([]);

async function handleBuy() {
  const response = await shopStore.createOrder();
  if (response.error === 0) {
    // Redirection vers la page de paiement avec l'uuid
    router.push(`/shop/pay/${response.data.uuid}`);
  } else {
    alert("Erreur lors de la création de la commande : " + response.data);
  }
}

async function handleClear() {
  await shopStore.clearBasket();
}

async function handleRemoveItem(index) {
  await shopStore.removeFromBasket(index);
}

</script>

<template>
  <div class="basket-list">
    <h2>Votre Panier</h2>
    <div v-if="shopStore.basket && shopStore.basket.items && shopStore.basket.items.length > 0">
      <CheckedList
        :data="shopStore.basket.items"
        :fields="['item.name', 'item.price', 'amount']"
        :itemCheck="false"
        :itemButton="{ show: true, text: 'Supprimer' }"
        :itemAmount="false"
        @item-button-clicked="handleRemoveItem"
      />
      
      <div class="actions">
        <button @click="handleClear" class="clear-btn">Vider le panier</button>
        <button @click="handleBuy" class="buy-btn">Acheter</button>
      </div>
    </div>
    <div v-else>
      <p>Votre panier est vide.</p>
    </div>
  </div>
</template>

<style scoped>
.basket-list {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.clear-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.buy-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>