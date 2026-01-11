
import LocalSource from "@/services/localsource.service.js";

async function getAccountFromLocalSource(number) {
    return LocalSource.getAccount({ number: number });
}

async function getTransactionsFromLocalSource(idAccount) {
    return LocalSource.getTransactions({ idAccount: idAccount });
}

async function createWithdrawFromLocalSource(idAccount, amount) {
    return LocalSource.createWithdraw({ idAccount, amount });
}

async function createPaymentFromLocalSource(idAccount, amount, destNumber) {
    return LocalSource.createPayment({ idAccount, amount, destNumber });
}


async function getAccountAmount(number) {
    let response = null;
    try {
        response = await getAccountAmountFromLocalSource(number)
    } catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le solde du compte' }
    }
    return response
}

async function getAccountTransactions(number) {
    let response = null;
    try {
        response = await getAccountTransactionsFromLocalSource(number)
    } catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les transactions du compte' }
    }
    return response
}

async function getAccount(number) {
    let response = null;
    try {
        response = await getAccountFromLocalSource(number);
    } catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le compte' }
    }
    return response;
}

async function getTransactions(idAccount) {
    let response = null;
    try {
        response = await getTransactionsFromLocalSource(idAccount);
    } catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les transactions' }
    }
    return response;
}

async function createWithdraw(idAccount, amount) {
    let response = null;
    try {
        response = await createWithdrawFromLocalSource(idAccount, amount);
    } catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de faire le retrait' }
    }
    return response;
}

async function createPayment(idAccount, amount, destNumber) {
    let response = null;
    try {
        response = await createPaymentFromLocalSource(idAccount, amount, destNumber);
    } catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de faire le virement' }
    }
    return response;
}

export default {
    getAccountAmount,
    getAccountTransactions,
    getAccount,
    getTransactions,
    createWithdraw,
    createPayment
}