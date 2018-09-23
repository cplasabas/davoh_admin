<template>
  <v-app class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <!-- <img src="/static/m.png" alt="Vue Material Admin" width="120" height="120"> -->
                  <h1 class="flex my-4 secondary--text">DAVOH</h1>
                </div>
                <v-alert v-show="error" type="error" :value="true">
                  {{ error }}
                </v-alert>                
                <v-form>
                  <v-text-field append-icon="person" name="login" label="Login" type="text" v-model="username"></v-text-field>
                  <v-text-field append-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Api from '@/api/api';

export default {
  data: () => ({
    loading: false,
    error: '',
    username: '',
    password: ''
  }),
  methods: {
    async login () { 
      try {
        this.loading = true;
     
        await Api().post('login', {
          username: this.username,
          password: this.password
        }).then(response => {
          this.loading = false;
          this.$router.push('/dashboard');
          this.$store.dispatch('setToken', response.data.token);
          window.getApp.$emit('APP_LOGIN_SUCCESS');
        });
      } catch (error) { 
        this.loading = false;
        this.error = ' ' + error.response.data.message;
      }
    }
  }

};
</script>
