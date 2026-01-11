<script setup>
import { ref } from 'vue';
import { useBankStore } from '@/stores/bank.js';
import { useRouter } from 'vue-router';

const bankStore = useBankStore();
const router = useRouter();

const accountNumber = ref('FRDRMAD578901234567890-0000666'); // Default for testing
const errorMsg = ref('');

async function login() {
  if (!accountNumber.value) {
    errorMsg.value = "Veuillez entrer un numéro de compte";
    return;
  }
  
  const response = await bankStore.getAccount(accountNumber.value);
  if (response.error === 0) {
    router.push('/bank/amount');
  } else {
    errorMsg.value = response.data;
  }
}
</script>

<template>
  <div class="bank-account">
    <h2>Accès à votre compte</h2>
    <div class="login-form">
      <label>Numéro de compte :</label>
      <input v-model="accountNumber" type="text" placeholder="FR..." class="input-account" />
      <button @click="login">Valider</button>
    </div>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.bank-account {
  max-width: 400px;
  margin: 0 auto;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.input-account {
  padding: 8px;
  font-family: monospace;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
