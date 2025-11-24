import LocalSource from "@/services/localsource.service.js";

async function getAccountAmountFromLocalSource(number) {
    // récupération auprès de la source locale
    return LocalSource.getAccountAmount(number)
}

async function getAccountAmount(number) {
    let response = null;
    try {
        response = await getAccountAmountFromLocalSource(number)
    }
    catch(err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le solde du compte'  }
    }
    return response
}

async function getAccountTransactions(number) {
    let response = null;
    try {
        response = await getAccountTransactionsFromLocalSource(number)
    }
    catch(err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les transactions du compte'  }
    }
    return response
}

async function getAccountTransactionsFromLocalSource(number) {
    return LocalSource.getAccountTransactions(number)
}

export default {
    getAccountAmount,
    getAccountTransactions,
}