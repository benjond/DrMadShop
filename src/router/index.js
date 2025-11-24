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
        // import dynamique du composant, plutôt qu'en début de fichier, comme la 1ère route.
        component: () => import('@/views/ShopLoginView.vue')
    },
    {
        path: '/bank/account',
        name: 'bankaccount',
        component: () => import('@/views/BankAccountView.vue')
    },
    //route shop racine et ses childrens
    {
        path: '/shop',
        name: 'shop',
        component: () => import('@/views/ShopView.vue'),
        children: [
            {
                path : 'home',
                name: 'shop.home',
                components: { shopmain: () => import('@/views/ShopHomeView.vue') },
                alias: ''

            },
            {
                path : 'login',
                name: 'shop.login',
                components: { shopmain: () => import('@/views/ShopLoginView.vue') }
            },
            {
                path : 'buy',
                name: 'shop.buy',
                components: { shopmain: () => import('@/views/ShopBuyView.vue') }
            },
            {
                path: 'pay/:orderId',
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
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

export default router
