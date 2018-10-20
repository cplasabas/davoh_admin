import Vue from 'vue';
import store from '@/store/store';
import Router from 'vue-router';
import paths from './paths';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use(Router);
const router =  new Router({
  base: '/',
  mode: 'hash',
  linkActiveClass: 'active',
  routes: paths
});

// router guards
router.beforeEach((to, from, next) => {
  NProgress.start();

  if (to.meta.requiresAuth) {
    if (!store.state.isUserLogged) {
      next({
        path: '/'
      });
      NProgress.done();
    } else {
      next();
    } 
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  NProgress.done();
});

export default router;
