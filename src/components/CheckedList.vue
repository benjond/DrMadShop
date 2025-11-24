<template>
  <div class="checked-list">
    <!-- Liste des items -->
    <table v-if="data && data.length > 0">
      <tbody>
        <tr v-for="(item, index) in data" :key="index" class="list-item">
          <!-- Case à cocher si itemCheck est true -->
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
            <button @click="emit('item-button-clicked', index)">
              {{ itemButton.text }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bouton de liste si listButton.show est true -->
    <button
      v-if="listButton && listButton.show"
      @click="emit('list-button-clicked')"
      class="list-button"
    >
      {{ listButton.text }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  data: Array, // les données sources
  fields: Array, // le tableau contenant le nom des champs
  itemCheck: Boolean, // s'il y a des case à cocher
  checked: Array, // le tableau des cases cochées
  itemButton: Object, // l'objet pour les boutons d'items
  listButton: Object, // l'objet pour le bouton de liste

})

const emit = defineEmits(['checked-changed', 'item-button-clicked', 'list-button-clicked'])
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
</style>