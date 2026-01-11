<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBankStore } from '@/stores/bank.js';

const bankStore = useBankStore();
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    bankStore.logout();
    router.push('/bank/home');
  }, 1000);
});
</script>

<template>
  <div class="logout-view">
    <h2>Déconnexion du compte...</h2>
  </div>
</template>

<style scoped>
.logout-view {
  text-align: center;
  margin-top: 50px;
  color: #666;
}
</style>
