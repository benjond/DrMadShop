<template>
  <div>
    <button
      v-for="(item, index) in titles"
      :key="index"
      :style="{ backgroundColor: item.color }"
      @click="emit('menu-clicked', index)"
    >
      {{ item.text }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  titles: Array
})

const emit = defineEmits(['menu-clicked'])

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

button {
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

</style>