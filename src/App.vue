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

/* Global Styles */
:root {
  --primary-color: #059669; /* Emerald 600 */
  --primary-hover: #047857; /* Emerald 700 */
  --secondary-color: #3b82f6; /* Blue 500 */
  --accent-color: #8b5cf6; /* Violet 500 */
  --error-color: #ef4444; /* Red 500 */
  --success-color: #10b981; /* Emerald 500 */
  --background-color: #f3f4f6; /* Gray 100 */
  --text-color: #1f2937; /* Gray 800 */
  --card-bg: #ffffff;
  --border-color: #e5e7eb; /* Gray 200 */
}

body {
  margin: 0;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 30px;
  animation: fadeIn 0.5s ease-out;
}

h1, h2, h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

/* Premium Button Styles */
button:not(.text-btn) {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

button:active {
  transform: translateY(0);
}

input[type="text"],
input[type="number"],
input[type="password"],
input[type="date"] {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

tr:last-child td {
  border-bottom: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
