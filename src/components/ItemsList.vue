<template>
  <div>
    <h2>Liste des virus</h2>
    <CheckedList
      :data="shopStore.viruses"
      :fields="['name', 'price', 'promotion']"
      :itemCheck="true"
      :checked="checkedItems"
      :itemButton="{ show: true, text: 'Ajouter au panier' }"
      :listButton="{ show: true, text: 'Ajouter sélection au panier' }"
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
  return shopStore.viruses.map((_, index) => selectedIndices.value.includes(index));
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
  // payload is { index, amount } because itemAmount is true
  const { index, amount } = payload;
  const item = shopStore.viruses[index];
  if (item) {
    shopStore.addToCart(item, amount);
    alert(`Ajouté au panier : ${amount} x ${item.name}`);
  }
}

function addAllToCart(payload) {
  // payload is array of { index, amount }
  if (payload && payload.length > 0) {
    payload.forEach(({ index, amount }) => {
      const item = shopStore.viruses[index];
      if (item) {
        shopStore.addToCart(item, amount);
      }
    });
    alert(`${payload.length} articles ajoutés au panier`);
    selectedIndices.value = []; // Deselect items as requested
  } else {
    alert('Aucun article sélectionné');
  }
}
</script>

<style scoped>
h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}
</style>