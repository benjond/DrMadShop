<template>
  <div class="vertical-menu">
    <div v-for="(item, index) in items" :key="index" class="menu-item">
      
      <div v-if="item.type === 'title'" class="menu-title">
        <slot name="menu-title" :label="item.label">{{ item.label }}</slot>
      </div>

      <span 
        v-else-if="item.type === 'link'" 
        class="menu-link-wrapper" 
        @click="goTo(item.to)"
      >
        <div class="menu-link">
          <slot name="menu-link" :label="item.label">
            <button class="nav-btn">{{ item.label }}</button>
          </slot>
        </div>
      </span>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const router = useRouter();

function goTo(path) {
  if (path) {
    router.push(path);
  }
}
</script>

<style scoped>
.vertical-menu {
  display: flex;
  flex-direction: column;
  width: 240px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-right: 20px;
}

.menu-item {
  margin-bottom: 8px;
}

.menu-title {
  color: #6b7280;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1rem 0 0.5rem 0.5rem;
  font-weight: 600;
}

.nav-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  color: #374151;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  box-shadow: none !important;
}

.nav-btn:hover {
  background-color: #f3f4f6;
  color: var(--primary-color);
  transform: translateX(4px);
}
</style>
