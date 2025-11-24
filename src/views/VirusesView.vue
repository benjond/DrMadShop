<template>
  <div>
    <h1>Les virus</h1>
    <p>Le tableau dans le store : {{ shopStore.viruses }}</p>
    <p>sous forme de liste avec certains champs</p>
    <ul>
      <li v-for="(virus, index) in shopStore.viruses" :key="index">{{virus.name}} : {{virus.price}}</li>
    </ul>

    <span>Filtres :</span>
    <label for="filterpriceactive">par prix</label><input type="checkbox" v-model="filterPriceActive" id="filterpriceactive">
    <label for="filternameactive">par nom</label><input type="checkbox" v-model="filterNameActive" id="filternameactive">
    <label for="filterstockactive">par stock</label><input type="checkbox" v-model="filterStockActive" id="filterstockactive">
    <hr />

    <div v-if="filterPriceActive">
      <label for="filterprice">prix inférieur à : </label><input v-model.number="priceFilter" id="filterprice" type="number">
    </div>

    <div v-if="filterNameActive">
      <label for="filtername">Nom contient : </label><input v-model="nameFilter" id="filtername" type="text">
    </div>

    <div v-if="filterStockActive">
      <label for="filterstock">En stock seulement : </label><input type="checkbox" v-model="stockFilter" id="filterstock">
    </div>

    <h2>Liste filtrée</h2>
    <CheckedList
      :data="filteredViruses"
      :fields="['name', 'price']"
      :itemCheck="true"
      :checked="checkedItems"
      :itemButton="{ show: true, text: 'Info' }"
      :listButton="{ show: true, text: 'Voir sélection' }"
      @checked-changed="changeSelection"
      @item-button-clicked="showItemInfo"
      @list-button-clicked="showSelectedItems"
    />
  </div>
</template>

<script setup>
import {ref, computed, watch} from "vue";
import {useShopStore} from "@/stores/shop.js";
import CheckedList from "@/components/CheckedList.vue";
const shopStore = useShopStore();

const filterPriceActive = ref(false);
const filterNameActive = ref(false);
const filterStockActive = ref(false);

const priceFilter = ref(0);
const nameFilter = ref("");
const stockFilter = ref(false);

const selected = ref([]);

const filteredViruses = computed(() => {
  let result = shopStore.viruses;

  if (filterPriceActive.value) {
    const filterValue = Number(priceFilter.value);
    if (!isNaN(filterValue) && filterValue > 0) {
      result = result.filter(v => v.price < filterValue);
    }
  }

  if (filterNameActive.value) {
    const filterValue = nameFilter.value.toLowerCase();
    if (filterValue) {
      result = result.filter(v => v.name.toLowerCase().includes(filterValue));
    }
  }

  if (filterStockActive.value && stockFilter.value) {
    result = result.filter(v => v.stock > 0);
  }

  return result;
});

const checkedItems = computed(() => {
  return filteredViruses.value.map(virus => {
    const fullListIndex = shopStore.viruses.findIndex(v => v._id === virus._id);
    return selected.value.includes(fullListIndex);
  });
});

function changeSelection(idx) {
  const virus = filteredViruses.value[idx];

  const fullListIndex = shopStore.viruses.findIndex(v => v._id === virus._id);

  // If not found, do nothing (prevents adding -1)
  if (fullListIndex === -1) return;

  const selectedIndex = selected.value.indexOf(fullListIndex);
  if (selectedIndex !== -1) {
    selected.value.splice(selectedIndex, 1);
  } else {
    selected.value.push(fullListIndex);
  }
}

function showItemInfo(idx) {
  const virus = filteredViruses.value[idx];
  alert(`Nom: ${virus.name}\nStock: ${virus.stock}\nEn vente: ${virus.stock > 0 ? 'Oui' : 'Non'}`);
}

function showSelectedItems() {
  const selectedNames = selected.value
    .map(index => shopStore.viruses[index]?.name)
    .filter(name => name !== undefined)
    .join(', ');

  if (selectedNames) {
    alert(`Virus sélectionnés: ${selectedNames}`);
  } else {
    alert('Aucun virus sélectionné');
  }
}

watch(filteredViruses, (newFilteredList) => {
  const filteredIndices = newFilteredList.map(virus =>
    shopStore.viruses.findIndex(v => v._id === virus._id)
  );
  selected.value = selected.value.filter(index => filteredIndices.includes(index));
});
</script>

<style scoped>
h1 {
  color: #2c3e50;
  border-bottom: 3px solid #42b983;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

h2 {
  color: #42b983;
  margin-top: 20px;
}

label {
  margin-right: 10px;
  font-weight: bold;
  color: #555;
}

input[type="checkbox"] {
  margin-right: 20px;
  cursor: pointer;
}

input[type="text"], input:not([type="checkbox"]) {
  padding: 5px 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  background-color: #f8f9fa;
  margin: 5px 0;
  padding: 10px;
  border-left: 4px solid #42b983;
  border-radius: 4px;
}

hr {
  border: none;
  border-top: 2px solid #42b983;
  margin: 20px 0;
}

div {
  margin: 10px 0;
}
</style>