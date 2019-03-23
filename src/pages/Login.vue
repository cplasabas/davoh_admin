<template>
  <v-app id="login">
    <v-content >
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="/static/img/logo_text.png" alt="davoh" width="240" height="240">
                </div>
                <v-alert v-show="error" type="error" :value="true">
                  {{ error }}
                </v-alert>                
                <v-text-field prepend-icon="person" name="login" label="Login" type="text" v-model="username"></v-text-field>
                <v-text-field prepend-icon="lock" @keyup.enter="login" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="login" @keyup.enter="login" :loading="loading">Login</v-btn>
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
          this.$store.dispatch('setToken', response.data.token);
          this.$store.dispatch('setUser', response.data.data);
          this.$router.push('/products');
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

<style scoped lang="css">
  #login {
    background-color: #fcf1dd;
    background-image: url("~/static/img/backdrop-single.png");
    background-size: 30px;  
  }
</style>