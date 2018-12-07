<template>
  <v-toolbar
    color="primary"
    fixed
    dark
    app
    >
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="handleDrawerToggle"></v-toolbar-side-icon>
    </v-toolbar-title>
    <v-container grid-list-xl fluid>
      <v-layout row wrap justify-end>
        <v-flex lg2 >
          <v-dialog v-model="dialog.show_edit" scrollable @keydown.esc="dialog.show_edit = false" persistent max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Edit Profile</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-form method="post" action="#" id="userForm" v-model="userFormValid">
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field prepend-icon="perm_identity" v-model="user.first_name" label="First Name" hint="First Name" :rules="[rules.required]"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field prepend-icon="perm_identity" v-model="user.last_name" label="Last Name" hint="Last Name" :rules="[rules.required]"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field prepend-icon="account_box" v-model="user.username" label="Username" hint="Username" :rules="[rules.required]"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field prepend-icon="lock" :type="'password'" v-model="user.password" label="Password" hint="Password" :rules="[rules.required]"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field prepend-icon="mail_outline" v-model="user.email" label="Email" hint="Email" :rules="[rules.required]"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field prepend-icon="phone" v-model="user.contact" label="Contact" hint="Contact"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field prepend-icon="place" v-model="user.address" label="Address" hint="Address"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <small>*indicates required field</small>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="dialog.show_edit = false">Close</v-btn>
                <v-btn color="primary" flat @click="edit_user()" :disabled="!userFormValid">Edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
    </v-container>

    <v-spacer></v-spacer>
    <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator">
        <v-avatar size="30px">
          <v-icon>settings</v-icon>
        </v-avatar>
      </v-btn>
      <v-list class="pa-0">
        <v-list-tile @click="show_profile()">
          <v-list-tile-action >
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout()">
          <v-list-tile-action >
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import Api from '@/api/api';
import Util from '@/util';
import store from '@/store/store';

export default {
  name: 'app-toolbar',
  data: () => ({
    dialog: { 
      show_edit: false
    },
    userFormValid: false,
    user_id: null,
    rules: {
      required: value => !!value || 'Required.',
    },
    user: {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      contact: '',
      address: '',
      level: 1
    }
  }),
  methods: {
    show_profile () {
      
      this.dialog.show_edit = true;
    },
    async edit_user () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        let edit_id = this.user.id;
        delete this.user.id;

        await Api().put('user/' + edit_id, this.user, config).then(response => {
          this.dialog.show_edit = false;
          window.getApp.$emit('USER_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('USER_EDIT_FAIL');
      }
    },
    logout () {
      store.dispatch('setToken', null);
      window.getApp.$emit('APP_LOGOUT');
    },
    handleDrawerToggle () {
      window.getApp.$emit('APP_DRAWER_TOGGLED');
    },
    handleFullScreen () {
      Util.toggleFullScreen();
    }
  },
  created: function () {
    this.user = store.state.user;
  }
};
</script>
