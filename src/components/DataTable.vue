<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  headers: { type: Array, required: true },
  itemCheck: Boolean,
  itemButton: Boolean,
  tableButton: Boolean
});

const emit = defineEmits(['itemClicked', 'tableClicked']);

const checkedIndices = ref([]);

function toggleCheck(index) {
  if (checkedIndices.value.includes(index)) {

    const i = checkedIndices.value.indexOf(index);
    if (i > -1) {
        checkedIndices.value.splice(i, 1);
    }
  } else {
    checkedIndices.value.push(index);
  }
}

function handleItemClick(item) {
  emit('itemClicked', item);
}

function handleTableClick() {
  const selectedItems = [];
  for (let i = 0; i < props.items.length; i++) {
    if (checkedIndices.value.includes(i)) {
      selectedItems.push(props.items[i]);
    }
  }
  emit('tableClicked', selectedItems);
}

</script>

<template>
  <div class="data-table-container">
    <table>
      <thead>
        <tr>
          <!-- Checkbox column header -->
          <th v-if="itemCheck">select.</th>
          
          <!-- Data columns headers -->
          <th v-for="header in headers" :key="header.name">
            {{ header.label }}
          </th>
          
          <!-- Actions column header -->
          <th v-if="itemButton">actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <!-- Checkbox cell -->
          <td v-if="itemCheck">
            <input type="checkbox" @change="toggleCheck(index)" />
          </td>
          
          <!-- Data cells -->
          <td v-for="header in headers" :key="header.name">
            {{ item[header.name] }}
          </td>
          
          <!-- Button cell -->
          <td v-if="itemButton">
            <button @click="handleItemClick(item)">
              <slot name="item-button">Action</slot>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="tableButton" class="table-actions">
      <button @click="handleTableClick">
        <slot name="table-button">Action Table</slot>
      </button>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
.table-actions {
  text-align: right;
}
</style>
