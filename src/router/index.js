import { createRouter, createWebHistory } from 'vue-router'
import VirusesView from "@/views/VirusesView.vue";

const routes = [
    // route pour afficher la liste des virus
    {
        path: '/shop/items',
        name: 'shopitems',
        component: VirusesView
    },
    // route pour se loguer
    {
        path: '/shop/login',
        name: 'shoplogin',
        component: () => import('@/views/ShopLoginView.vue')
    },
    //route shop racine et ses childrens
    {
        path: '/shop',
        name: 'shop',
        component: () => import('@/views/ShopView.vue'),
        children: [
            {
                path: 'home',
                name: 'shop.home',
                components: { shopmain: () => import('@/views/ShopHomeView.vue') },
                alias: ''

            },
            {
                path: 'login',
                name: 'shop.login',
                components: { shopmain: () => import('@/views/ShopLoginView.vue') }
            },
            {
                path: 'buy',
                name: 'shop.buy',
                components: { shopmain: () => import('@/views/ShopBuyView.vue') }
            },
            {
                path: 'pay/:orderUuid?',
                name: 'shop.pay',
                components: { shopmain: () => import('@/views/ShopPayView.vue') },
                props: { shopmain: true }
            },
            {
                path: 'orders',
                name: 'shop.orders',
                components: { shopmain: () => import('@/views/ShopOrdersView.vue') }
            }
        ]
    },
    {
        path: '/bank',
        name: 'bank',
        component: () => import('@/views/BankView.vue'),
        children: [
            {
                path: 'home',
                name: 'bank.home',
                alias: '',
                components: { bankmain: () => import('@/views/BankHomeView.vue') }
            },
            {
                path: 'account',
                name: 'bank.account',
                components: { bankmain: () => import('@/views/BankAccountView.vue') }
            },
            {
                path: 'amount',
                name: 'bank.amount',
                components: { bankmain: () => import('@/views/BankAmountView.vue') }
            },
            {
                path: 'operation',
                name: 'bank.operation',
                components: { bankmain: () => import('@/views/BankOperationView.vue') }
            },
            {
                path: 'history',
                name: 'bank.history',
                components: { bankmain: () => import('@/views/BankHistoryView.vue') }
            },
            {
                path: 'logout',
                name: 'bank.logout',
                components: { bankmain: () => import('@/views/BankLogoutView.vue') }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

export default router
