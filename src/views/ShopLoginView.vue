<template>
  <div class="shop-login-container">
    <div class="login-card">
      <div class="card-header">
        <h1>🔐 Connexion Boutique</h1>
        <p class="subtitle">Identifiez-vous pour accéder à nos produits</p>
      </div>

      <div v-if="!shopStore.shopUser" class="login-form">
        <div class="form-group">
          <label>Identifiant</label>
          <input v-model="login" type="text" placeholder="Votre login" class="input-field">
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="password" type="password" placeholder="Votre mot de passe" class="input-field">
        </div>
        <button @click="doLogin" class="btn-primary">Se connecter</button>
      </div>

      <div v-else class="user-logged">
        <div class="success-message">
          <p>👋 Bonjour, <strong>{{shopStore.shopUser.name}}</strong></p>
          <p class="status-text">Vous êtes connecté</p>
        </div>
        <button @click="doLogout" class="btn-logout">Se déconnecter</button>
      </div>

      <p v-if="errorMessage" class="error-message">⚠️ {{errorMessage}}</p>
    </div>
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
    alert(response.data || 'login/pass incorrect');
    errorMessage.value = response.data || 'erreur login';
  }
}

const doLogout = async () => {
    shopStore.shopUser = null;
    shopStore.basket = { items: [] };
    login.value = '';
    password.value = '';
    errorMessage.value = '';
    router.push('/shop');
}
</script>

<style scoped>
.shop-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.card-header {
  margin-bottom: 2rem;
}

.card-header h1 {
  color: var(--primary-color);
  margin: 0;
  font-size: 1.8rem;
  border: none;
  padding: 0;
}

.subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.login-form, .user-logged {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.input-field {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-logout {
  background-color: #ef4444;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #dc2626;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 6px;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
}

.success-message {
  background-color: #ecfdf5;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #a7f3d0;
}

.success-message p {
  margin: 0;
  color: #065f46;
}

.status-text {
  font-size: 0.9rem;
  margin-top: 0.5rem !important;
  color: #047857;
}
</style>
