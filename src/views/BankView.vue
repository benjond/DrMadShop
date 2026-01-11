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
       <!-- Default behavior for Mon compte/Deconnexion handled by changing label in store/logic? 
            Wait, prompt says "l'intitulé du bouton doit devenir 'Deconnexion'".
            The NavBar component uses the link label. So we might need reactive links.
            But simply, let's follow the slot requirement if any.
            Actually, the prompt says "Pour la barre de navigation, on utilise le composant NavBar, auquel on donne en props le tableau [ {label: 'Mon compte', to: '/bank/account'} ]".
            It implies we might not change the prop array dynamically in the simple version, 
            OR we just use the slot to display Deconnexion if connected.
            Re-reading: "l'intitulé du bouton doit devenir 'Deconnexion'".
            And "On ne définit que le contenu du scoped-slot menu-title" logic usually applies to VerticalMenu.
            Let's stick to the slot override I had which was good:
       -->
       <template #nav-button="{ label }">
            <span v-if="label === 'Mon compte' && bankStore.account">Déconnexion</span>
            <span v-else>{{ label }}</span>
       </template>
    </NavBar>

    <div class="bank-body">
        <VerticalMenu :items="menuItems">
          <template #menu-title="{ label }">
            <!-- "afficher la valeur de label en gras, souligné" -->
            <b><u style="text-decoration: underline;">{{ label }}</u></b>
          </template>
          <!-- "Pour le scoped-slot menu-link, on garde le comportement par défaut" -> No slot definition here -->
        </VerticalMenu>
      
      <div class="bank-main">
        <router-view name="bankmain" v-slot="{ Component }">
            <component :is="Component">
                <template #account-amount="{ amount }">
                    <!-- "un champ de saisie non éditable" -->
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
