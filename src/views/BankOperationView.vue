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
    // "sinon, une boîte de dialogue apparaît avec un message d'erreur"
    alert(response ? response.data : "Erreur inconnue");
  }
}
</script>

<template>
  <div class="bank-operation">
    <h2>
      <slot name="operation-title">Débit / Virement</slot>
    </h2>
    
    <div class="form-group">
      <label>Montant :</label>
      <input type="number" v-model="amount" />
    </div>
    
    <div class="form-group">
      <label>
        <input type="checkbox" v-model="recipientChecked" />
        Destinataire
      </label>
      <input 
        v-if="recipientChecked" 
        type="text" 
        v-model="recipientAccount" 
        placeholder="N° de compte" 
      />
    </div>
    
    <button @click="validateOperation">Valider</button>
    
    <div v-if="message" class="message">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
.message {
  margin-top: 10px;
  color: green;
  font-weight: bold;
}
</style>
