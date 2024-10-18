import { createRouter, createWebHistory } from 'vue-router'

import PageRegistration from "./views/User/PageRegistration.vue";
import PageLogin from "./views/User/PageLogin.vue";
import PageProfile from "./views/User/PageProfile.vue";
import PageChangePassword from "./views/User/PageChangePassword.vue";
import PageRestorePassword from "./views/User/PageRestorePassword.vue";
import Page404 from "./views/Page404.vue";
import Page from "~/views/Page.vue";

export default function createVueRouter(Store) {
    const routes = [
        {path: '/', name: 'default', component: Page, meta: {noLoginRequired: true}},

        {path: '/register', name: 'register', component: PageRegistration, meta: {noLoginRequired: true}},
        {path: '/login', name: 'login', component: PageLogin, meta: {noLoginRequired: true}},
        {path: '/login/email', name: 'signInByEmail', component: PageLogin, meta: {noLoginRequired: true}},
        {path: '/profile', name: 'profile', component: PageProfile, meta: {loginRequired: true}},
        {path: '/password/change', name: 'changePassword', component: PageChangePassword, meta: {loginRequired: true}},
        {path: '/password/restore', name: 'restorePassword', component: PageRestorePassword, meta: {noLoginRequired: true}},
        // {path: '/admin', name: 'admin', component: PageAdmin, meta: {adminRequired: true}},

        {path: '/:pathMatch(.*)*', name: 'page404', component: Page404},
    ];

    const Router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    let router_got_user = false;
    Router.beforeEach(async (to, from, next) => {
        if (!router_got_user) {
            await Store.dispatch('GET_USER');
            router_got_user = true;
        }

        const notLoginedRedirect = {
            name: 'login'
        }
        const loginedRedirect = {
            name: 'profile',
        }

        if (to.path === '/' || to.path === '') {
            if (Store.state.user.isSignedIn) {
                next(loginedRedirect);
                return;
            }
            next(notLoginedRedirect);
            return;
        }

        // Login required redirects
        if (to.matched.some(record => record.meta.loginRequired === true || record.meta.adminRequired === true)) {
            if (Store.state.user.isSignedIn) {
                next();
                return;
            }
            next(notLoginedRedirect);
            return;
        } else if (to.matched.some(record => record.meta.noLoginRequired === true)) {
            if (!Store.state.user.isSignedIn) {
                next();
                return;
            }
            next(loginedRedirect);
            return;
        }
        if (to.matched.some(record => record.meta.adminRequired === true)) {
            if (Store.state.user.isAdmin) {
                next();
                return;
            }
            next(loginedRedirect);
            return;
        }
        next();
    });

    Router.beforeResolve(async (to) => {
        if (window?.onbeforeunload) {
            if (confirm("Изменения не сохранены. Вы уверены, что хотите покинуть страницу?"))
                window.onbeforeunload = null;
            else
                return false;
        }
    });

    return Router;
}
