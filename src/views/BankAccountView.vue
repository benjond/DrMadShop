<script setup>
import { ref } from 'vue';
import { useBankStore } from '@/stores/bank.js';
import { useRouter } from 'vue-router';

const bankStore = useBankStore();
const router = useRouter();

const accountNumber = ref('FRDRMAD578901234567890-0000666');
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
  <div class="bank-account-container">
    <div class="login-card">
        <div class="card-header">
            <h2>🏦 Accès Compte</h2>
            <p class="subtitle">Veuillez vous identifier</p>
        </div>
        
        <div class="login-form">
          <div class="form-group">
              <label>Numéro de compte</label>
              <input 
                v-model="accountNumber" 
                type="text" 
                placeholder="FR..." 
                class="input-account" 
              />
          </div>
          <button @click="login" class="btn-primary">Valider</button>
        </div>
        <p v-if="errorMsg" class="error-message">
            ⚠️ {{ errorMsg }}
        </p>
    </div>
  </div>
</template>

<style scoped>
.bank-account-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.card-header {
    margin-bottom: 2rem;
}

.card-header h2 {
    color: var(--primary-color);
    margin: 0;
    font-size: 1.8rem;
}

.subtitle {
    color: #6b7280;
    margin-top: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
}

.input-account {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  transition: border-color 0.2s;
}

.input-account:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 10px;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
