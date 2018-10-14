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
      store.watch((state, getters) => getters.getLogged, (isUserLogged) => {
        if (isUserLogged) {
          next();
        }
        else {
          next({
            name: 'Root'
          });
        }
      });
    } else if (store.state.isUserLogged) {
      next();
    } else {
      next({
        name: 'Root'
      });
    } 
  } else if (to.meta.requiresAdmin) {
    if (!this.$store.state.isUserLogged) {
      next({
        name: 'Root'
      });
    }
  } else {
    next();
  }
  
});

router.afterEach((to, from) => {

  NProgress.done();
});

export default router;
