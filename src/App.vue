<template>
  <div class="app-container">
    <NavBar :links="links">
      <template #nav-button="{ label }">
        <span v-if="label === 'boutique'" style="font-weight: bold;">{{ label }}</span>
        <!-- Assuming generic icon usage for banque as requested "icône ressemblant à une banque" -->
        <span v-else-if="label === 'banque'">🏦 Banque</span>
        <span v-else>{{ label }}</span>
      </template>
    </NavBar>
    
    <div class="main-content">
      <h1 v-if="isHome">Bienvenue DrMad</h1>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from "@/components/NavBar.vue";

const route = useRoute();

const links = ref([
  { label: "boutique", to: "/shop" },
  { label: "banque", to: "/bank" }
]);

const isHome = computed(() => route.path === '/');
</script>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  color: #2c3e50;
}
.main-content {
    padding: 20px;
    text-align: center;
}
</style>
