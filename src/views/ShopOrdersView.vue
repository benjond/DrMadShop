<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '@/stores/shop.js';

const shopStore = useShopStore();
const router = useRouter();

onMounted(async () => {
  await shopStore.getAllOrders();
});

const orders = computed(() => {
  return shopStore.shopUser?.orders || [];
});

function goToPay(uuid) {
  router.push(`/shop/pay/${uuid}`);
}

async function cancelOrder(uuid) {
  if (confirm("Voulez-vous vraiment annuler cette commande ?")) {
    await shopStore.cancelOrder(uuid);
  }
}

function formatDate(dateStr) {
  if (dateStr && dateStr.$date) {
    return new Date(dateStr.$date).toLocaleString();
  }
  return new Date(dateStr).toLocaleString();
}
</script>

<template>
  <div class="orders-view">
    <h1>Vos Commandes</h1>
    
    <div v-if="orders.length === 0" class="no-orders">
      Vous n'avez pas encore passé de commande.
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.uuid" class="order-card">
        <div class="order-header">
          <span class="order-date">{{ formatDate(order.date) }}</span>
          <span class="order-status" :class="order.status">{{ order.status }}</span>
        </div>
        <div class="order-details">
          <p><strong>UUID:</strong> {{ order.uuid }}</p>
          <p><strong>Total:</strong> {{ order.total }} €</p>
          <p><strong>Nb Articles:</strong> {{ order.items.length }}</p>
        </div>
        <div class="order-actions" v-if="order.status === 'waiting_payment'">
          <button @click="goToPay(order.uuid)" class="pay-btn">Payer</button>
          <button @click="cancelOrder(order.uuid)" class="cancel-btn">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-view {
  padding: 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

.order-status.waiting_payment { color: orange; }
.order-status.finalized { color: green; }
.order-status.cancelled { color: red; }

.order-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.pay-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>