<script setup>
import NavBar from '@/components/NavBar.vue';
import VerticalMenu from '@/components/VerticalMenu.vue';
import { useBankStore } from '@/stores/bank.js';

const bankStore = useBankStore();

const navLinks = [
  { label: "Mon compte", to: "/bank/account" }
];

const menuItems = [
  { type: "title", label: "Opérations" },
  { type: "link", label: "Solde", to: "/bank/amount" },
  { type: "link", label: "Débit/Virement", to: "/bank/operation" },
  { type: "title", label: "États" },
  { type: "link", label: "Historique", to: "/bank/history" },
  { type: "link", label: "Déconnexion", to: "/bank/logout" }
];

</script>

<template>
  <div class="bank-view">
    <NavBar :links="navLinks">
       <template #nav-button="{ label }">
            <span v-if="label === 'Mon compte' && bankStore.account">Déconnexion</span>
            <span v-else>{{ label }}</span>
       </template>
    </NavBar>

    <div class="bank-body">
        <VerticalMenu :items="menuItems">
          <template #menu-title="{ label }">
            <b><u style="text-decoration: underline;">{{ label }}</u></b>
          </template>
        </VerticalMenu>
      
      <div class="bank-main">
        <router-view name="bankmain" v-slot="{ Component }">
            <component :is="Component">
                <template #account-amount="{ amount }">
                    <input 
                        readonly 
                        :value="amount + ' €'"
                        :class="amount < 0 ? 'red-text' : 'green-text'"
                    />
                </template>
                 <template #operation-title>
                    Débit / Virement
                 </template>
                 <template #history-title>
                    Opérations passées
                 </template>
            </component>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bank-view {
  display: flex;
  flex-direction: column;
}

.bank-body {
  display: flex;
  margin-top: 20px;
}

.bank-main {
    flex: 1;
    padding: 20px;
}

.red-text { color: red; }
.green-text { color: green; }
</style>
