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
  
  let txs = [];
  for (let i = 0; i < bankStore.accountTransactions.length; i++) {
    let t = bankStore.accountTransactions[i];
    let isSource = false;
    if (t.amount < 0) {
        isSource = true;
    }
    
    let dateObj = new Date(t.date.$date);
    
    let newItem = {
      _id: t._id,
      amount: t.amount,
      date: t.date,
      uuid: t.uuid,
      account: t.account,
      amountDisplay: t.amount + ' €',
      dateDisplay: dateObj.toLocaleString(),
      rawDate: dateObj,
      type: 'D'
    };
    
    if (isSource) {
        newItem.type = 'S';
    }
    
    txs.push(newItem);
  }
  
  txs.sort((a, b) => {
      return b.rawDate - a.rawDate;
  });
  
  if (filterActive.value) {
    let from = null;
    if (dateFrom.value) {
        from = new Date(dateFrom.value);
    }
    let to = null;
    if (dateTo.value) {
        to = new Date(dateTo.value);
    }
    
    if (from && to && from > to) {
        return [];
    }
    
    let filteredTxs = [];
    for (let i = 0; i < txs.length; i++) {
        let t = txs[i];
        let keep = true;
        
        if (from) {
            if (t.rawDate < from) {
                keep = false;
            }
        }
        if (to) {
            if (t.rawDate > to) {
                keep = false;
            }
        }
        
        if (keep) {
            filteredTxs.push(t);
        }
    }
    return filteredTxs;
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
