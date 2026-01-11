<script setup>
import { ref } from 'vue';
import { useBankStore } from '@/stores/bank.js';

const bankStore = useBankStore();

const amount = ref(0);
const recipientChecked = ref(false);
const recipientAccount = ref('');
const message = ref('');

async function validateOperation() {
  message.value = '';
  
  if (amount.value <= 0) {
    alert("Le montant doit être positif");
    return;
  }

  let response;
  if (recipientChecked.value) {
    if (!recipientAccount.value) {
      alert("Veuillez entrer un compte destinataire");
      return;
    }
    response = await bankStore.createPayment(amount.value, recipientAccount.value);
  } else {
    response = await bankStore.createWithdraw(amount.value);
  }

  if (response && response.error === 0) {
    message.value = `L'opération est validée avec le n° : ${response.data.uuid}. Vous pouvez la retrouver dans l'historique`;
    setTimeout(() => {
      message.value = '';
    }, 5000);
  } else {
    alert(response ? response.data : "Erreur inconnue");
  }
}
</script>

<template>
  <div class="bank-operation card">
    <h2 class="form-title">
      <slot name="operation-title">Débit / Virement</slot>
    </h2>
    
    <div class="form-content">
        <div class="form-group">
          <label>Montant (€) :</label>
          <input type="number" v-model="amount" class="input-field" placeholder="0.00" />
        </div>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="recipientChecked" class="checkbox-input" />
            Virement à un destinataire
          </label>
          <div v-if="recipientChecked" class="recipient-slide">
              <input 
                type="text" 
                v-model="recipientAccount" 
                placeholder="FR..." 
                class="input-field"
              />
          </div>
        </div>
        
        <button @click="validateOperation" class="btn-validation">Valider l'opération</button>
        
        <div v-if="message" class="message-box success">
          {{ message }}
        </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  max-width: 600px;
}

.form-title {
    margin-top: 0;
    color: var(--primary-color);
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: #4b5563;
}

.input-field {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-field:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.checkbox-input {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.btn-validation {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;
  margin-top: 1rem;
}

.btn-validation:hover {
  background-color: var(--primary-hover);
}

.message-box.success {
  background-color: #ecfdf5;
  color: #047857;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #a7f3d0;
}
</style>
