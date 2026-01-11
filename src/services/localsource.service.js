import { items, shopusers, bankaccounts, transactions } from '@/datasource/data.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

/**
 * @param data
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: {_id: string | *, name: string | *, login: string | *, email: string | *, session}}}
 */
function shopLogin(data) {
    if ((!data.login) || (!data.password)) return { error: 1, status: 404, data: 'aucun login/pass fourni' }
    let user = shopusers.find(e => e.login === data.login)
    if (!user) return { error: 1, status: 404, data: 'login/pass incorrect' }
    try {
        const match = bcrypt.compareSync(data.password, user.password)
        if (!match) return { error: 1, status: 404, data: 'login/pass incorrect' }
    }
    catch (err) {
        return { error: 1, status: 500, data: 'erreur serveur lors de la vérification du mot de passe' }
    }
    if (!user.session) {
        user.session = uuidv4()
    }
    let u = {
        _id: user._id,
        name: user.name,
        login: user.login,
        email: user.email,
        session: user.session
    }
    return { error: 0, status: 200, data: u }
}

/**
 * @returns {{error: number, data}}
 */
function getAllViruses() {
    return { error: 0, data: items }
}

/**
 * @param number
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: number | *}}
 */
function getAccountAmount(number) {
    if (!number) {
        return { error: 1, status: 404, data: 'numéro de compte inconnu / vide ' }
    }
    const account = bankaccounts.find(a => a.number === number)
    if (!account) {
        return { error: 1, status: 404, data: 'numéro de compte inconnu' }
    }
    return { error: 0, status: 200, data: account.amount }
}

/**
 * @param number
 * @returns {{error: number, status: number, data: ({_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string})[]}|{error: number, status: number, data: string}}
 */
function getAccountTransactions(number) {
    if (!number) {
        return { error: 1, status: 404, data: 'numéro de compte inconnu' }
    }
    const account = bankaccounts.find(a => a.number === number)
    if (!account) {
        return { error: 1, status: 404, data: 'numéro de compte inconnu' }
    }
    const transaction = transactions.filter(t => t.account === account._id)
    return { error: 0, status: 200, data: transaction }
}

/**
 * @param {_id: string, basket: any} data
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: any}}
 */
function updateBasket(data) {
    if (!data || !data._id || typeof data.basket === 'undefined') {
        return { error: 1, status: 400, data: 'Paramètres manquants (_id ou basket)' }
    }
    let user = shopusers.find(u => u._id === data._id)
    if (!user) {
        return { error: 1, status: 404, data: 'Utilisateur non trouvé' }
    }

    // Save the basket as is (with IDs or objects, we just store it)
    // Ideally we store IDs.
    // Ensure we store properly structured data for persistence if this was a real DB.
    // For local source, let's just assign.
    user.basket = data.basket

    // BUT return a POPULATED basket for the frontend
    let populatedBasket = JSON.parse(JSON.stringify(user.basket));
    if (populatedBasket.items) {
        populatedBasket.items.forEach(basketItem => {
            // If item is just an ID, resolve it. If it's already an object, refresh it/ensure it's valid.
            let itemId = basketItem.item._id || basketItem.item;
            let fullItem = items.find(i => i._id === itemId);
            if (fullItem) {
                basketItem.item = JSON.parse(JSON.stringify(fullItem));
            }
        });
    }

    return { error: 0, status: 200, data: populatedBasket }
}

/**
 * @param {{_id: string}} data
 * @returns {{error: number, status: number, data: any}|{error: number, status: number, data: string}}
 */
function getBasket(data) {
    if (!data || !data._id) {
        return { error: 1, status: 400, data: 'Paramètre _id manquant' };
    }
    let user = shopusers.find(u => u._id === data._id);
    if (!user) {
        return { error: 1, status: 404, data: 'Utilisateur non trouvé' };
    }
    if (user.basket == null) user.basket = { items: [] }; // Ensure object structure

    // Populate items
    let basket = JSON.parse(JSON.stringify(user.basket));
    if (!basket.items) basket.items = [];

    basket.items.forEach(basketItem => {
        let itemId = basketItem.item._id || basketItem.item;
        let fullItem = items.find(i => i._id === itemId);
        if (fullItem) {
            basketItem.item = JSON.parse(JSON.stringify(fullItem));
        }
    });

    return { error: 0, status: 200, data: basket };
}

/**
 * @param {string} userId
 * @param {Object} basket
 * @returns {{error: number, status: number, data: {uuid: string}}}
 */
function orderBasket(userId, basket) {
    if (!userId || !basket) return { error: 1, status: 400, data: 'Paramètres manquants' };
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: 'Utilisateur inconnu' };

    const orderItems = [];
    let total = 0;

    for (const basketItem of basket.items) {
        const originalItem = items.find(i => i._id === (basketItem.item._id || basketItem.item));
        if (originalItem) {
            let price = originalItem.price;
            if (originalItem.promotion && originalItem.promotion.length > 0) {
            }

            orderItems.push({
                item: JSON.parse(JSON.stringify(originalItem)),
                amount: basketItem.amount
            });
            total += price * basketItem.amount;
        }
    }

    const newOrder = {
        items: orderItems,
        date: new Date(),
        total: total,
        status: 'waiting_payment',
        uuid: uuidv4()
    };

    if (!user.orders) user.orders = [];
    user.orders.push(newOrder);

    user.basket = { items: [] };

    return { error: 0, status: 200, data: { uuid: newOrder.uuid } };
}

/**
 * @param {string} uuid
 * @param {string} userId
 * @returns {{error: number, status: number, data: Object}}
 */
function getOrder(uuid, userId) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: 'Utilisateur inconnu' };

    if (!user.orders) return { error: 1, status: 404, data: 'Aucune commande trouvée' };

    const order = user.orders.find(o => o.uuid === uuid);
    if (!order) return { error: 1, status: 404, data: 'Commande inconnue' };

    return { error: 0, status: 200, data: JSON.parse(JSON.stringify(order)) };
}

/**
 * @param {string} uuid
 * @param {string} userId
 * @param {string} transactionUuid
 * @returns {{error: number, status: number, data: string}}
 */
function payOrder(uuid, userId, transactionUuid) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: 'Utilisateur inconnu' };

    if (!user.orders) return { error: 1, status: 404, data: 'Aucune commande trouvée' };

    const order = user.orders.find(o => o.uuid === uuid);
    if (!order) return { error: 1, status: 404, data: 'Commande inconnue' };

    if (order.status !== 'waiting_payment') {
        return { error: 1, status: 400, data: 'Commande déjà traitée ou annulée' };
    }

    if (!transactionUuid) return { error: 1, status: 400, data: 'UUID de transaction manquant' };

    const transaction = transactions.find(t => t.uuid === transactionUuid);
    if (!transaction) return { error: 1, status: 404, data: 'Transaction bancaire inconnue' };

    const SHOP_ACCOUNT_ID = "65d721c44399ae9c8321832c";

    if (transaction.amount !== -order.total) {
        return { error: 1, status: 400, data: 'Montant de transaction incorrect' };
    }

    if (transaction.destination !== SHOP_ACCOUNT_ID) {
        return { error: 1, status: 400, data: 'Destinataire de transaction incorrect' };
    }

    order.status = 'finalized';
    return { error: 0, status: 200, data: 'Commande payée' };
}

/**
 * @param {string} userId
 * @returns {{error: number, status: number, data: Array}}
 */
function getAllOrders(userId) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: 'Utilisateur inconnu' };

    const orders = user.orders || [];
    return { error: 0, status: 200, data: JSON.parse(JSON.stringify(orders)) };
}

/**
 * @param {string} uuid
 * @param {string} userId
 * @returns {{error: number, status: number, data: string}}
 */
function cancelOrder(uuid, userId) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: 'Utilisateur inconnu' };

    if (!user.orders) return { error: 1, status: 404, data: 'Aucune commande trouvée' };

    const order = user.orders.find(o => o.uuid === uuid);
    if (!order) return { error: 1, status: 404, data: 'Commande inconnue' };

    if (order.status !== 'waiting_payment') {
        return { error: 1, status: 400, data: 'Impossible d\'annuler une commande finalisée' };
    }

    order.status = 'cancelled';
    return { error: 0, status: 200, data: 'Commande annulée' };
}

/**
 * @param {Object} data - { number: string }
 * @returns {{error: number, status: number, data: Object|string}}
 */
function getAccount(data) {
    if (!data || !data.number) return { error: 1, status: 400, data: 'Numéro de compte manquant' };
    const account = bankaccounts.find(a => a.number === data.number);
    if (!account) return { error: 1, status: 404, data: 'Numéro de compte invalide' };
    return { error: 0, status: 200, data: JSON.parse(JSON.stringify(account)) };
}

/**
 * @param {Object} data - { idAccount: string }
 * @returns {{error: number, status: number, data: Array|string}}
 */
function getTransactions(data) {
    if (!data || !data.idAccount) return { error: 1, status: 400, data: 'ID de compte manquant' };
    const accountTransactions = transactions.filter(t => t.account === data.idAccount);

    if (accountTransactions.length === 0) return { error: 1, status: 404, data: 'Aucune transaction pour ce compte' };

    return { error: 0, status: 200, data: JSON.parse(JSON.stringify(accountTransactions)) };
}

/**
 * @param {Object} data - { idAccount: string, amount: number }
 * @returns {{error: number, status: number, data: Object|string}}
 */
function createWithdraw(data) {
    if (!data || !data.idAccount || !data.amount) return { error: 1, status: 400, data: 'Paramètres manquants' };
    const account = bankaccounts.find(a => a._id === data.idAccount);
    if (!account) return { error: 1, status: 404, data: 'ID de compte invalide' };

    const amount = Math.abs(data.amount);
    const newTransaction = {
        _id: uuidv4(),
        amount: -amount,
        account: account._id,
        date: { $date: new Date().toISOString() },
        uuid: uuidv4()
    };

    transactions.push(newTransaction);
    account.amount -= amount;

    return { error: 0, status: 200, data: { uuid: newTransaction.uuid, amount: account.amount } };
}

/**
 * @param {Object} data - { idAccount: string, amount: number, destNumber: string }
 * @returns {{error: number, status: number, data: Object|string}}
 */
function createPayment(data) {
    if (!data || !data.idAccount || !data.amount || !data.destNumber) return { error: 1, status: 400, data: 'Paramètres manquants' };

    const sourceAccount = bankaccounts.find(a => a._id === data.idAccount);
    if (!sourceAccount) return { error: 1, status: 404, data: 'ID de compte invalide' };

    const destAccount = bankaccounts.find(a => a.number === data.destNumber);
    if (!destAccount) return { error: 1, status: 404, data: 'Compte destinataire inexistant' };

    const amount = Math.abs(data.amount);
    const date = { $date: new Date().toISOString() };

    const debitTransaction = {
        _id: uuidv4(),
        amount: -amount,
        account: sourceAccount._id,
        destination: destAccount._id,
        date: date,
        uuid: uuidv4()
    };

    const creditTransaction = {
        _id: uuidv4(),
        amount: amount,
        account: destAccount._id,
        date: date,
        uuid: uuidv4()
    };

    transactions.push(debitTransaction);
    transactions.push(creditTransaction);

    sourceAccount.amount -= amount;
    destAccount.amount += amount;

    return { error: 0, status: 200, data: { uuid: debitTransaction.uuid, amount: sourceAccount.amount } };
}

export default {
    shopLogin,
    getAllViruses,
    getAccountAmount,
    getAccountTransactions,
    getBasket,
    updateBasket,
    orderBasket,
    getOrder,
    payOrder,
    getAllOrders,
    cancelOrder,
    getAccount,
    getTransactions,
    createWithdraw,
    createPayment
}