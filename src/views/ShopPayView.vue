<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useShopStore } from '@/stores/shop.js';

const route = useRoute();
const router = useRouter();
const shopStore = useShopStore();

const orderUuid = ref('');
const transactionUuid = ref('');
const errorMsg = ref('');

onMounted(() => {
  if (route.params.orderUuid) {
    orderUuid.value = route.params.orderUuid;
  }
});

async function pay() {
  if (!orderUuid.value) {
    errorMsg.value = "UUID de commande manquant";
    return;
  }
  if (!transactionUuid.value) {
    errorMsg.value = "UUID de transaction bancaire manquant";
    return;
  }

  const response = await shopStore.payOrder(orderUuid.value, transactionUuid.value);
  
  if (response.error === 0) {
    router.push('/shop/orders');
  } else {
    errorMsg.value = response.data;
  }
}
</script>

<template>
  <div class="shop-pay">
    <h2>Paiement de la commande</h2>
    
    <div class="form-group">
        <label>UUID Commande :</label>
        <input v-model="orderUuid" type="text" placeholder="UUID Commande" />
    </div>

    <div class="form-group">
        <label>UUID Transaction Bancaire :</label>
        <input v-model="transactionUuid" type="text" placeholder="UUID Transaction" />
    </div>

    <button @click="pay">Payer</button>
    
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.shop-pay {
  max-width: 400px;
  margin: 0 auto;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
}
.form-group input {
    width: 100%;
    padding: 8px;
}
.error {
    color: red;
}
</style>