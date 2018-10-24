<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap justify-end>
        <v-flex lg2 >
            <v-dialog v-model="dialog.show_add" scrollable @keydown.esc="dialog.show_add = false" persistent max-width="700px">
              <v-btn @click="view_add" color="primary" dark slot="activator">
                <v-icon >add</v-icon>
                add
              </v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">New User</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs6 sm6 md6>
                        <v-text-field v-model="user.first_name" label="First Name" hint="First Name" required></v-text-field>
                      </v-flex>
                      <v-flex xs6 sm6 md6>
                        <v-text-field v-model="user.last_name" label="Last Name" hint="Last Name"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6 sm6 md6>
                        <v-text-field v-model="user.username" label="Username" hint="Username" required></v-text-field>
                      </v-flex>
                      <v-flex xs6 sm6 md6>
                        <v-text-field :type="'password'" v-model="user.password" label="Password" hint="Password"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6 sm6 md6>
                        <v-text-field v-model="user.email" label="Email" hint="Email"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6 sm6 md6>
                        <v-text-field v-model="user.contact" label="Contact" hint="Contact"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field v-model="user.address" label="Address" hint="Address"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                  <v-btn color="primary" v-if="is_edit" flat @click="edit_user()">EDIT</v-btn>
                  <v-btn color="primary" v-else flat @click="add_user()">Add</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
              flat
              solo
              prepend-icon="search"
              placeholder="Type something"
              v-model="search"
              hide-details
              class="hidden-sm-and-down"
              ></v-text-field>     
              <v-btn icon>
                <v-icon>filter_list</v-icon>
              </v-btn>         
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="users.userHeaders"
                :search="search"
                :items="users.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                select-all
                v-model="users.selected"
                
                >
                <template slot="items" slot-scope="props">
                <td>
                  <v-checkbox
                    primary
                    hide-details
                    v-model="props.selected"
                  ></v-checkbox>
                </td>              
                  <td>
                    <v-avatar size="32">
                      <img :src="props.item.image" alt="">
                    </v-avatar> 
                  </td>
                  <td>{{ props.item.first_name }}</td>
                  <td>{{ props.item.last_name}}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.contact }}</td>
                  <td class="text-xs-center">
                    <v-btn @click="view_edit(props.item.id)" depressed outline icon fab dark color="green" small>
                      <v-icon>create</v-icon>
                    </v-btn>
                    <v-btn @click="view_delete(props.item.id)" depressed outline icon fab dark color="pink" slot="activator" small>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <v-dialog v-model="dialog.show_delete" scrollable @keydown.esc="dialog.show_delete = false" persistent max-width="700px">
            <v-card>
              <v-card-title>
                <span class="headline">Delete User</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the user?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_user()" class="v-btn theme--dark red">
                        <div class="v-btn__content">Delete</div>
                      </button>
                    </div>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="dialog.show_delete = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>  
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Api from '@/api/api';
import store from '@/store/store';

export default {
  data () {
    return {
      search: '',
      users: {
        selected: [],
        userHeaders: [
          {
            text: 'Image',
            value: 'image',
          },
          {
            text: 'First Name',
            value: 'first_name'
          },
          {
            text: 'Last Name',
            value: 'last_name'
          },
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'Contact',
            value: 'contact'
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'center'
          },
        ],
        items: []
      },
      dialog: { 
        show_add: false,
        show_delete: false
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
      },
      delete_id: null,
      isAdmin: false,
      is_edit: false,
      edit_id: null
    };
  },
  methods: {
    view_delete (id) {
      this.delete_id = id;
      this.dialog.show_delete = true;
    },
    async delete_user () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('user/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_users();
          window.getApp.$emit('USER_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('PRODUCT_DELETED_FAIL');
      }

    },
    view_user (user_id) {
      this.$router.push('/user/' + user_id);
    },
    view_add (id) {

      this.dialog.show_add = true;
      this.is_edit = false;

      for (let key in this.user) {
        if (this.user.hasOwnProperty(key)) {
          this.user[key] = '';
        }
      }
      this.user.level = 1;
    },
    view_edit (id) {
      this.dialog.show_add = true;
      this.edit_id = id;
      this.is_edit = true;

      let user = this.users.items.filter(u => u.id === id);

      for (let key in user[0]) {
        if (user[0].hasOwnProperty(key)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            this.user[key] = user[0][key];
          }
        }
      }
      this.user.password = '';
    },
    async edit_user () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('user/' + this.edit_id, this.user, config).then(response => {
          this.dialog.show_add = false;
          this.get_users();
          window.getApp.$emit('USER_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('USER_EDIT_FAIL');
      }
    },
    get_users () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('user', config).then(response => {
        this.users.items = response.data.users.filter(u => u.level !== 0);
      });
    },
    async add_user () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().post('register', this.user, config).then(response => {
          this.dialog.show_add = false;
          this.get_users();
          window.getApp.$emit('USER_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('USER_ADDED_FAIL');
      }
    }
  },
  // eslint-disable-next-line
  created: function () {
    
    if (store.state.user.level === 0) {
      this.isAdmin = true;
    }

    this.get_users();
  },
};
</script>
