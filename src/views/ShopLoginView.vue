<template>
  <div>
    <h1>Login</h1>

    <span>login</span><input v-model="login">
    <span>password</span><input v-model="password" type="password">
    <button @click="doLogin">Login</button>
    <div v-if="shopStore.shopUser">
        <p>{{shopStore.shopUser.name}} connecté</p>
        <button @click="doLogout" style="background-color: #f44336;">Se déconnecter</button>
    </div>
    <p v-if="errorMessage" style="color:red">{{errorMessage}}</p>
  </div>

</template>

<script setup>
import {ref} from "vue";
import {useShopStore} from "@/stores/shop.js";
import {useRouter} from 'vue-router'

const login = ref('')
const password = ref('')
const shopStore = useShopStore()
const router = useRouter()
const errorMessage = ref('')

const doLogin = async () => {
  errorMessage.value = ''
  const response = await shopStore.shopLogin({login: login.value, password: password.value})
  if (response && response.error === 0) {
    router.push('/shop/buy')
  }
  else {
    // "Afficher un dialogue d'erreur"
    alert(response.data || 'login/pass incorrect');
    errorMessage.value = response.data || 'erreur login';
  }
}

const doLogout = async () => {
    // Basic logout logic: clear shopUser in store.
    // The store doesn't have an explicit 'logout' action in previous files, but we can set shopUser.value = null if we add an action or access it.
    // Wait, shop.js (store) needs a logout action or we manipulate state? 
    // Best to add logout action to store or just reload?
    // Let's add a logout action to store first if needed, likely cleaner. 
    // But for now, let's assume we can add it to the component via store access if public.
    // shopStore.shopUser = null; // Direct mutation if possible, or use a method if defined.
    // Checking store file again... it exposes shopUser. 
    shopStore.shopUser = null;
    shopStore.basket = { items: [] };
    router.push('/shop');
}


</script>

<style scoped>
h1 {
  color: #4caf50;
  border-bottom: 3px solid #388e3c;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

span {
  font-weight: bold;
  color: #555;
  margin-right: 10px;
  display: inline-block;
  min-width: 80px;
}

input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin: 5px 10px 5px 0;
  font-size: 14px;
}

button {
  margin: 5px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #388e3c;
}

p {
  margin-top: 15px;
  padding: 12px;
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
  font-weight: bold;
  color: #2e7d32;
}
</style>
