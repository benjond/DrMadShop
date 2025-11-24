import { ref } from 'vue'
import { defineStore } from 'pinia'

import BankService from '@/services/bankaccount.service'

export const useBankStore = defineStore('bank', () => {
    const accountAmount = ref(0); // Correction: use ref for reactivity
    const accountTransactions = ref([]); // Champ tableau pour les transactions
    const accountNumberState = ref(0); // État du numéro de compte : 0 = pas renseigné, 1 = valide, -1 = erreur

    async function getAccountAmount(number) {
        console.log('récupération du solde du compte');
        let response = await BankService.getAccountAmount(number);
        if (response.error === 0) {
            accountAmount.value = response.data;
            accountNumberState.value = 1;
        } else {
            console.log(response.data);
            accountNumberState.value = -1;
        }
    }

    async function getAccountTransactions(number) {
        console.log('récupération des transactions du compte');
        let response = await BankService.getAccountTransactions(number);
            accountNumberState.value = 1;
        if (response.error === 0) {
            accountTransactions.value = response.data;
            accountNumberState.value = -1;
        } else {
            console.log(response.data);
        }
    }

    return { accountAmount, accountTransactions, accountNumberState, getAccountAmount, getAccountTransactions };
});
