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
        <span class="menu-link">
          <slot name="menu-link" :label="item.label">
            <button>{{ item.label }}</button>
          </slot>
        </span>
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
  width: 200px;
  /* Basic styling */
}

.menu-item {
  margin-bottom: 10px;
}
</style>
