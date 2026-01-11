<script setup>
import { computed } from 'vue';
import { useBankStore } from '@/stores/bank.js';

const bankStore = useBankStore();

const amount = computed(() => bankStore.account ? bankStore.account.amount : 0);
const isNegative = computed(() => amount.value < 0);
</script>

<template>
  <div class="bank-amount">
    <h2>Solde du compte</h2>
    <div class="amount-display">
      <slot name="account-amount" :amount="amount">
         <input 
            readonly 
            :value="amount + ' €'" 
            class="amount-input"
            :class="{ 'negative': isNegative, 'positive': !isNegative }"
         >
      </slot>
    </div>
  </div>
</template>

<style scoped>
.amount-display {
  margin-top: 20px;
}
.amount-input {
  font-size: 24px;
  padding: 10px;
  font-weight: bold;
  text-align: right;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.negative {
  color: red;
}
.positive {
  color: green;
}
</style>
