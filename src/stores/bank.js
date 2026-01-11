import { ref } from 'vue'
import { defineStore } from 'pinia'

import BankService from '@/services/bankaccount.service'

export const useBankStore = defineStore('bank', () => {
    const account = ref(null);
    const accountTransactions = ref([]);
    const accountNumberState = ref(0);

    async function getAccount(number) {
        let response = await BankService.getAccount(number);
        if (response.error === 0) {
            account.value = response.data;
            accountNumberState.value = 1;
            await getTransactions(account.value._id);
        } else {
            console.log(response.data);
            accountNumberState.value = -1;
            account.value = null;
        }
        return response;
    }

    async function getTransactions(idAccount) {
        let response = await BankService.getTransactions(idAccount);
        if (response.error === 0) {
            accountTransactions.value = response.data;
        } else {
            console.log(response.data);
            accountTransactions.value = [];
        }
    }

    async function createWithdraw(amount) {
        if (!account.value) return;
        let response = await BankService.createWithdraw(account.value._id, amount);
        if (response.error === 0) {
            account.value.amount = response.data.amount;
            await getTransactions(account.value._id);
        }
        return response;
    }

    async function createPayment(amount, destNumber) {
        if (!account.value) return;
        let response = await BankService.createPayment(account.value._id, amount, destNumber);
        if (response.error === 0) {
            account.value.amount = response.data.amount;
            await getTransactions(account.value._id);
        }
        return response;
    }

    function logout() {
        account.value = null;
        accountTransactions.value = [];
        accountNumberState.value = 0;
    }

    return {
        account,
        accountTransactions,
        accountNumberState,
        getAccount,
        getTransactions,
        createWithdraw,
        createPayment,
        logout
    };
});
