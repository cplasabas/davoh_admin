import Vue from 'vue';
import store from '@/store/store';
import Router from 'vue-router';
import paths from './paths';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use(Router);
const router =  new Router({
  base: '/',
  mode: 'history',
  linkActiveClass: 'active',
  routes: paths
});

// router guards
router.beforeEach((to, from, next) => {
  if (!to.name) {
    next({
      path: '/404'
    });
  } else if ((to.meta.requiresAuth && !store.state.isUserLogged) || 
    (to.meta.requiresAdmin && store.state.user.type === 2)) {
    next({
      path: '/403'
    });
  } else {
    next();
  }
});

export default router;
