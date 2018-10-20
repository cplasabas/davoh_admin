<template>
  <v-layout row class="align-center layout px-4 pt-4 app--page-header">
    <div class="page-header-left">
      <h3 class="pr-3">{{title}}</h3>
    </div>
    <v-breadcrumbs divider="-">
      <v-breadcrumbs-item>
      <v-icon larg>home</v-icon>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item v-for="(item,key) in breadcrumbs" :key="key">
      {{ item }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-spacer></v-spacer>
    <div class="page-header-right">
      <v-btn icon>
        <v-icon class="text--secondary">refresh</v-icon>
      </v-btn>
    </div>
  </v-layout>  
</template>

<script>
import adminMenu from '@/api/adminMenu';
import nonAdminMenu from '@/api/nonAdminMenu';
import store from '@/store/store';

export default {
  data () {
    return {
      title: '',
      menus: nonAdminMenu
    };
  },
  computed: {
    breadcrumbs: function () {
      let breadcrumbs = [];
      this.menus.forEach(item => {
        if (item.items) {
          let child =  item.items.find(i => {
            return i.component === this.$route.name;
          });
          if (child) {
            breadcrumbs.push(item.title);
            breadcrumbs.push(child.title);
            this.title = child.title;
          }
        } else {
          if (item.name === this.$route.name) {
            this.title = item.title;
            breadcrumbs.push(item.title);
          }
        }
      });
      return breadcrumbs;
    },    
  },
  created () {
    if (store.state.user.level === 0) {
      this.menus = adminMenu;
    } else {
      this.menus = nonAdminMenu;
    }
  },
};
</script>
