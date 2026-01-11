<template>
  <div class="navbar">
    <div class="navbar-content">
      <div class="logo">DrMad</div>
      <div class="nav-links">
        <button
          v-for="(link, index) in links"
          :key="index"
          @click="goTo(link.to)"
          class="nav-button"
          :class="{ active: isActive(link.to) }"
        >
          <slot name="nav-button" :label="link.label">{{ link.label }}</slot>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  links: {
    type: Array,
    required: true,
  }
});

const router = useRouter();
const route = useRoute();

function goTo(path) {
  if (path) {
    router.push(path);
  }
}

function isActive(path) {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
}

.navbar-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-color, #2c3e50);
  margin-right: 40px;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-button {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 1rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-button:hover {
  background-color: #f1f5f9;
  color: var(--primary-color, #2c3e50);
}

.nav-button.active {
  background-color: var(--primary-color, #2c3e50);
  color: #ffffff;
  box-shadow: 0 4px 6px rgba(44, 62, 80, 0.2);
}
</style>