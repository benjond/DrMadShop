import LocalSource from "@/services/localsource.service.js";

async function shopLoginFromLocalSource(data) {
  // récupération auprès de la source locale
  return LocalSource.shopLogin(data)
}
/*
async function shopLoginFromAPI(data) {
  // a écrire quand l'API est fonctionnelle
  return {}
}
 */

async function getAllVirusesFromLocalSource() {
  // récupération auprès de la source locale
  return LocalSource.getAllViruses()
}

/*
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/

async function getBasketFromLocalSource(data) {
  return LocalSource.getBasket(data);
}

async function updateBasketFromLocalSource(data) {
  return LocalSource.updateBasket(data);
}


async function orderBasketFromLocalSource(userId, basket) {
  return LocalSource.orderBasket(userId, basket);
}

async function getOrderFromLocalSource(uuid, userId) {
  return LocalSource.getOrder(uuid, userId);
}

async function payOrderFromLocalSource(uuid, userId, transactionUuid) {
  return LocalSource.payOrder(uuid, userId, transactionUuid);
}

async function getAllOrdersFromLocalSource(userId) {
  return LocalSource.getAllOrders(userId);
}

async function cancelOrderFromLocalSource(uuid, userId) {
  return LocalSource.cancelOrder(uuid, userId);
}

async function shopLogin(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await shopLoginFromLocalSource(data)
  }
  // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de se loguer' }
  }
  return response
}


async function getAllViruses() {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getAllVirusesFromLocalSource()
  }
  // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la liste des viruses' }
  }
  return response
}

async function getBasket(data) {
  let response = null;
  try {
    response = await getBasketFromLocalSource(data);
  } catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la liste du panier utilisateur' }
  }
  return response;
}

async function updateBasket(data) {
  let response = null;
  try {
    response = await updateBasketFromLocalSource(data);
  } catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de mettre à jour la liste du panier utilisateur' }
  }
  return response;
}

async function orderBasket(userId, basket) {
  let response = null;
  try {
    response = await orderBasketFromLocalSource(userId, basket);
  } catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de passer la commande' }
  }
  return response;
}

async function getOrder(uuid, userId) {
  let response = null;
  try {
    response = await getOrderFromLocalSource(uuid, userId);
  } catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la commande' }
  }
  return response;
}

async function payOrder(uuid, userId, transactionUuid) {
  let response = null;
  try {
    response = await payOrderFromLocalSource(uuid, userId, transactionUuid);
  } catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de payer la commande' }
  }
  return response;
}

async function getAllOrders(userId) {
  let response = null;
  try {
    response = await getAllOrdersFromLocalSource(userId);
  } catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les commandes' }
  }
  return response;
}

async function cancelOrder(uuid, userId) {
  let response = null;
  try {
    response = await cancelOrderFromLocalSource(uuid, userId);
  } catch (err) {
    response = { error: 1, status: 404, data: 'erreur réseau, impossible d\'annuler la commande' }
  }
  return response;
}


export default {
  shopLogin,
  getAllViruses,
  getBasket,
  updateBasket,
  orderBasket,
  getOrder,
  payOrder,
  getAllOrders,
  cancelOrder
}