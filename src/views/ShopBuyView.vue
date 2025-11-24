<script setup>
import ItemsList from '@/components/ItemsList.vue';
import BasketList from '@/components/BasketList.vue';
</script>

<template>
  <div>
    <div style="display: flex; gap: 32px;">
      <div style="flex: 1;">
      <ItemsList />
      </div>
      <div style="flex: 1;">
      <BasketList />
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

</style>