import Vue from 'vue';
import App from './App';
import Vuetify from 'vuetify';
import moment from 'vue-moment';
import VueCurrencyFilter from 'vue-currency-filter';
import router from './router';
import 'font-awesome/css/font-awesome.css';  
import './theme/default.styl';
import VeeValidate from 'vee-validate';
import Truncate from 'lodash.truncate';
import money from 'v-money';
Vue.config.productionTip = false;
import store from '@/store/store';

// Helpers
// Global filters
Vue.filter('truncate', Truncate);
Vue.use(VeeValidate, { fieldsBagName: 'formFields' });
Vue.use(moment);

Vue.use(money, { precision: 2 });

Vue.use(VueCurrencyFilter,
  {
    symbol: '₱',
    thousandsSeparator: ',',
    fractionCount: 2,
    fractionSeparator: '.',
    symbolPosition: 'front',
    symbolSpacing: true
  });

Vue.use(Vuetify, {
  theme: {
    primary: '#e4b23a',
    secondary: '#2d2d2d', // #FFCDD2
    accent: '#e4b23a' // #3F51B5
  },
  options: {
    themeVariations: ['primary', 'secondary', 'accent'],
    extra: {
      mainToolbar: {
        color: 'primary',
      },
      sideToolbar: {
      },
      sideNav: 'primary',
      mainNav: 'primary lighten-1',
      bodyBg: '',
    }
  }
});
// Bootstrap application components


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
