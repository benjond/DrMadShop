<script setup>
import NavBar from "@/components/NavBar.vue";
import { onMounted } from "vue";
import { useShopStore } from "@/stores/shop.js";

const shopStore = useShopStore();

onMounted(() => {
  shopStore.getAllViruses();
});

const shopLinks = [
  { label: "Login", to: "/shop/login" },
  { label: "Acheter", to: "/shop/buy" },
  { label: "Payer", to: "/shop/pay" },
  { label: "Commandes", to: "/shop/orders" },
];
</script>

<template>
  <div class="shop-view">
    <div class="shop-header-area">
        <NavBar :links="shopLinks">
        <template #nav-button="{ label }">
            {{ label }}
        </template>
        </NavBar>
    </div>

    <div class="shop-content">
      <div class="shop-card">
          <router-view name="shopmain"></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-view {
  background-color: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin-top: 20px;
  min-height: calc(100vh - 120px);
}

.shop-header-area {
    border-bottom: 1px solid #e2e8f0;
    background: white;
}

.shop-content {
  padding: 32px;
}

.shop-card {
    background: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    min-height: 400px;
}
</style>
