<template>
  <div class="items-list-container">
    <h2 class="section-title">🦠 Catalogue de Virus</h2>
    <CheckedList
      :data="shopStore.viruses"
      :fields="['name', 'price', 'promotion']"
      :itemCheck="true"
      :checked="checkedItems"
      :itemButton="{ show: true, text: 'Ajouter' }"
      :listButton="{ show: true, text: 'Ajouter la sélection' }"
      :itemAmount="true"
      @checked-changed="toggleSelection"
      @item-button-clicked="addToCart"
      @list-button-clicked="addAllToCart"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useShopStore } from '@/stores/shop.js';
import CheckedList from '@/components/CheckedList.vue';

const shopStore = useShopStore();
const selectedIndices = ref([]);

const checkedItems = computed(() => {
  // Version débutant : boucle for classique
  let result = [];
  for (let i = 0; i < shopStore.viruses.length; i++) {
    let isChecked = selectedIndices.value.includes(i);
    result.push(isChecked);
  }
  return result;
});

function toggleSelection(index) {
  const selectedIndex = selectedIndices.value.indexOf(index);
  if (selectedIndex === -1) {
    selectedIndices.value.push(index);
  } else {
    selectedIndices.value.splice(selectedIndex, 1);
  }
}

function addToCart(payload) {
  // Pas de destructuration
  const index = payload.index;
  const amount = payload.amount;
  const item = shopStore.viruses[index];
  
  if (item) {
    shopStore.addToCart(item, amount);
  }
}

function addAllToCart(payload) {
  if (payload && payload.length > 0) {
    // Boucle classique au lieu de forEach
    for (let i = 0; i < payload.length; i++) {
        const p = payload[i];
        const index = p.index;
        const amount = p.amount;
        
        const item = shopStore.viruses[index];
        if (item) {
            shopStore.addToCart(item, amount);
        }
    }
    selectedIndices.value = []; 
  }
}
</script>

<style scoped>
.items-list-container {
    background: white;
}

.section-title {
  color: var(--primary-color);
  margin-bottom: 24px;
  font-size: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
}
</style>