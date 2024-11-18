import { createRouter, createWebHistory, Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { type Store } from '~/types/store';

// Components:
import Page from '~/views/Page.vue';
import Page404 from '~/views/Page404.vue';
import PageRegistration from '~/views/User/PageRegistration.vue';
import PageLogin from '~/views/User/PageLogin.vue';
import PageProfile from '~/views/User/PageProfile.vue';
import PageRestorePassword from '~/views/User/PageRestorePassword.vue';
import PageConfirmEmail from '~/views/User/PageConfirmEmail.vue';
import routes from '~/routes';
import { RouteRecordRaw } from 'vue-router';

type MyRoute = RouteRecordRaw & {
  path: keyof typeof routes,
  meta?: {
    noLoginRequired?: boolean
    loginRequired?: boolean
  }
}

export default function createVueRouter(Store: Store): Router {
  const routesList: MyRoute[] = [
    { path: '/', name: 'default', component: Page },

    { path: '/profile', name: 'profile', component: PageProfile },
    { path: '/login', name: 'login', component: PageLogin },
    { path: '/signup', name: 'signup', component: PageRegistration },
    { path: '/password/restore', name: 'restorePassword', component: PageRestorePassword },
    { path: '/password/change', name: 'changePassword', component: PageRestorePassword },
    { path: '/email/confirm', name: 'confirmEmail', component: PageConfirmEmail },

    { path: '/:pathMatch(.*)*', name: 'page404', component: Page404 },
  ];

  const Router = createRouter({
    history: createWebHistory(),
    routes: routesList,
  });

  let router_got_user = false;
  Router.beforeEach(async (to: RouteLocationNormalized, _, next: NavigationGuardNext) => {
    if (!router_got_user) {
      await Store.dispatch('GET_USER');
      router_got_user = true;
    }

    const notLoginedRedirect = {
      name: 'login',
    };
    const loginedRedirect = {
      name: 'profile',
    };

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

  Router.beforeResolve(async () => {
    if (window?.onbeforeunload) {
      if (confirm('Изменения не сохранены. Вы уверены, что хотите покинуть страницу?')) {
        window.onbeforeunload = null;
      } else {
        return false;
      }
    }
  });

  return Router;
}
