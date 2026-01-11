<script setup>
import { ref, computed } from 'vue';
import { useBankStore } from '@/stores/bank.js';
import DataTable from '@/components/DataTable.vue';

const bankStore = useBankStore();

const filterActive = ref(false);
const dateFrom = ref('');
const dateTo = ref('');

const headers = [
  { label: "Montant", name: "amountDisplay" },
  { label: "Date", name: "dateDisplay" },
  { label: "Type", name: "type" }
];

const processedTransactions = computed(() => {
  if (!bankStore.accountTransactions) return [];
  
  let txs = bankStore.accountTransactions.map(t => {
    const isSource = t.amount < 0;
    
    let newItem = {
      _id: t._id,
      amount: t.amount,
      date: t.date,
      uuid: t.uuid,
      account: t.account
    };
    
    newItem.amountDisplay = t.amount + ' €';
    newItem.dateDisplay = new Date(t.date.$date).toLocaleString();
    newItem.rawDate = new Date(t.date.$date);
    newItem.type = isSource ? 'S' : 'D';
    
    return newItem;
  });
  
  txs.sort((a, b) => b.rawDate - a.rawDate);
  
  if (filterActive.value) {
    const from = dateFrom.value ? new Date(dateFrom.value) : null;
    const to = dateTo.value ? new Date(dateTo.value) : null;
    
    if (from && to && from > to) {
        return [];
    }
    
    txs = txs.filter(t => {
      if (from && t.rawDate < from) return false;
      if (to && t.rawDate > to) return false;
      return true;
    });
  }
  
  return txs;
});

function handleDateChange(field) {
    if (!dateFrom.value || !dateTo.value) return;
    
    const d1 = new Date(dateFrom.value);
    const d2 = new Date(dateTo.value);
    
    if (field === 'to' && d2 < d1) {
        dateTo.value = '';
    } else if (field === 'from' && d1 > d2) {
        dateFrom.value = '';
    }
}

function showDetails(item) {
  alert(`UUID Transaction: ${item.uuid}`);
}

function showSelectedDetails(items) {
  const uuids = items.map(i => i.uuid).join('\n');
  alert(`UUIDs Transaction(s):\n${uuids}`);
}

</script>

<template>
  <div class="bank-history">
    <h2>
      <slot name="history-title">Opérations passées</slot>
    </h2>
    
    <div class="filters">
      <label>
        <input type="checkbox" v-model="filterActive" />
        Filtrer par période
      </label>
      
      <div v-if="filterActive" class="date-inputs">
        <label>Du : <input type="date" v-model="dateFrom" @change="handleDateChange('from')" /></label>
        <label>Au : <input type="date" v-model="dateTo" @change="handleDateChange('to')" /></label>
      </div>
    </div>
    
    <DataTable
      :items="processedTransactions"
      :headers="headers"
      itemCheck
      itemButton
      tableButton
      @itemClicked="showDetails"
      @tableClicked="showSelectedDetails"
    >
      <template #item-button>Détails</template>
      <template #table-button>Voir</template>
    </DataTable>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
.date-inputs {
  display: inline-flex;
  gap: 15px;
  margin-left: 20px;
}
</style>
