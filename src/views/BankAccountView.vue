<template>
  <div>
    <h1>Login</h1>

    <span>Id compte</span><input v-model="number">
    <button @click="bankStore.getAccountAmount(number)" :disabled="!isValidAccountNumber">Voir compte</button>
    <button @click="bankStore.getAccountTransactions(number)" :disabled="!isValidAccountNumber">Voir transactions</button>
    <button @click="reset">Reset</button>

    <!-- Affichage en fonction de accountNumberState -->
    <p v-if="bankStore.accountNumberState === -1" style="color: red;">Numéro de compte erroné</p>

    <div v-if="bankStore.accountNumberState === 1">
      <p v-if="bankStore.accountAmount">{{bankStore.accountAmount}}</p>
      <ul v-if="bankStore.accountTransactions">
        <li v-for="(transaction, index) in bankStore.accountTransactions" :key="index">
          {{ new Date(transaction.date.$date).toLocaleString() }} : {{transaction.amount}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from "vue";
import {useBankStore} from "@/stores/bank.js";

const number = ref('')
const bankStore = useBankStore();

const isValidAccountNumber = computed(() => {
  const regex = /^FR[A-Z]+\d{14}-\d{7}$/;
  return regex.test(number.value);
});

const reset = () => {
  number.value = '';
  bankStore.accountAmount = null;
  bankStore.accountTransactions = null;
  bankStore.accountNumberState = 0;
}

console.log('Bank store:', bankStore);
</script>

<style scoped>
h1 {
  color: #ff9800;
  border-bottom: 3px solid #ff5722;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

span {
  font-weight: bold;
  color: #555;
  margin-right: 10px;
}

input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
}

button {
  margin: 5px;
  padding: 8px 16px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #ff5722;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

p {
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
  margin: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  background-color: #f5f5f5;
  margin: 5px 0;
  padding: 10px;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
}
</style>

