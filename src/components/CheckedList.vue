<template>
  <div class="checked-list">
    <table v-if="data && data.length > 0">
      <tbody>
        <tr v-for="(item, index) in data" :key="index" class="list-item">
          <td v-if="itemCheck" class="checkbox-cell">
            <input
              type="checkbox"
              :checked="checked && checked[index]"
              @change="emit('checked-changed', index)"
            />
          </td>

          <!-- Affichage des champs demandés -->
          <td v-for="field in fields" :key="field" class="data-cell">
            {{ item[field] }}
          </td>

          <!-- Bouton d'item si itemButton.show est true -->
          <td v-if="itemButton && itemButton.show" class="button-cell">
            <input 
              v-if="itemAmount" 
              type="number" 
              v-model="amounts[index]" 
              min="1" 
              class="amount-input"
            >
            <button @click="itemButtonClicked(index)">
              {{ itemButton.text }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button
      v-if="listButton && listButton.show"
      @click="listButtonClicked"
      class="list-button"
    >
      {{ listButton.text }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  data: Array,
  fields: Array, 
  itemCheck: Boolean,
  checked: Array, 
  itemButton: Object,
  listButton: Object,
  itemAmount: Boolean,
})

const emit = defineEmits(['checked-changed', 'item-button-clicked', 'list-button-clicked'])

const amounts = ref([]);

watch(() => props.data, (newData) => {
  if (newData) {
    amounts.value = new Array(newData.length).fill(1);
  }
}, { immediate: true });

function itemButtonClicked(index) {
  if (props.itemAmount) {
    emit('item-button-clicked', { index, amount: amounts.value[index] });
  } else {
    emit('item-button-clicked', index);
  }
}

function listButtonClicked() {
  if (props.itemAmount) {
    const selected = [];
    if (props.checked) {
      props.checked.forEach((isChecked, index) => {
        if (isChecked) {
          selected.push({ index, amount: amounts.value[index] });
        }
      });
    }
    emit('list-button-clicked', selected);
  } else {
    emit('list-button-clicked');
  }
}
</script>

<style scoped>
.checked-list {
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.list-item {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.checkbox-cell {
  width: 40px;
  text-align: center;
  padding: 10px;
}

.checkbox-cell input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.data-cell {
  padding: 10px 15px;
  color: #333;
}

.button-cell {
  padding: 10px;
  text-align: center;
}

.button-cell button {
  padding: 6px 12px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.button-cell button:hover {
  background-color: #1976D2;
}

.list-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.list-button:hover {
  background-color: #388E3C;
}

.amount-input {
  width: 60px;
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>