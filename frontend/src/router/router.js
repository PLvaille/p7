import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from "../vues/LoginPage";
import HomePage from "../vues/HomePage";
import UserProfile from "../components/UserProfil";
import NotFound from "../components/NotFound";


const routes = [{
    name: 'LoginPage',
    path: '/',
    component: LoginPage,
},
{
    name: 'HomePage',
    path: '/posts',
    component: HomePage,
},
{
    name: 'UserProfile',
    path: '/user/:id',
    component: UserProfile,
},
{
    name: '404',
    path: '/:pathMatch(.*)*',
    component: NotFound,
},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    // scrollBehavior(to, from, savedPosition) {
    //     if (savedPosition) {
    //       return savedPosition;
    //     } else {
    //       return {
    //         el: to.hash,
    //         behavior: "smooth",
    //       };
    //     }
    // }
});

export default router;