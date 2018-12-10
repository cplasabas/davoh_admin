<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap justify-end>
        <v-flex lg2 >
            <v-dialog v-model="dialog.show_add" scrollable @keydown.esc="dialog.show_add = false" persistent max-width="500px">
              <v-btn @click="view_add" color="primary" dark slot="activator">
                <v-icon >add</v-icon>
                add
              </v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">New Agent</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-form method="post" action="#" id="agentForm" v-model="agentFormValid">
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-text-field prepend-icon="perm_identity" v-model="agent.name" label="Name" hint="Name" :rules="[rules.required]"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field prepend-icon="mail_outline" v-model="agent.email" label="Email" hint="Email"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field prepend-icon="phone" v-model="agent.contact" label="Contact" hint="Contact"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                  <v-btn color="primary" v-if="is_edit" flat @click="edit_agent()" :disabled="!agentFormValid">EDIT</v-btn>
                  <v-btn color="primary" v-else flat @click="add_agent()" :disabled="!agentFormValid">Add</v-btn>
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
                :headers="agents.agentHeaders"
                :search="search"
                :items="agents.items"
                :rows-per-page-items="[5,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.contact }}</td> 
                  <td class="text-xs-center">
                    <v-btn @click="view_products(props.item.id)" depressed outline icon fab dark color="green" small>
                      <v-icon>remove_red_eye</v-icon>
                    </v-btn>
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
          <v-dialog v-model="dialog.show_products" scrollable @keydown.esc="dialog.show_products = false" persistent max-width="700px">
            <v-card>
              <v-card-title>
                <span class="headline">Agent products</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-data-table
                  :headers="agent_products.headers"
                  :search="search"
                  :items="agent_products.items" 
                  :rows-per-page-items="[5]"
                  class="elevation-1"
                  item-key="name"              
                  >
                  <template slot="items" slot-scope="props">         
                    <td class="text-xs-center">
                      <v-avatar size="32">
                        <img :src="props.item.image_url" alt="">
                      </v-avatar> 
                    </td>
                    <td>{{ props.item.code }}</td>
                    <td>{{ props.item.category.name}}</td>
                    <td>{{ props.item.price | currency }}</td>
                    <td class="text-xs-center">
                      <v-btn @click="view_product(props.item.id)" depressed outline icon fab dark color="green" small>
                        <v-icon>remove_red_eye</v-icon>
                      </v-btn>
                    </td>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="dialog.show_products = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog.show_delete" scrollable @keydown.esc="dialog.show_delete = false" persistent max-width="700px">
            <v-card>
              <v-card-title>
                <span class="headline">Delete Agent</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the agent?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_agent()" class="v-btn theme--dark red">
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
      agents: {
        selected: [],
        agentHeaders: [
          {
            text: 'Name',
            value: 'name'
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
        show_delete: false,
        show_products: false
      },
      agent: {
        name: '',
        email: '',
        contact: ''
      },
      products: [],
      agent_products: {
        headers: [
          {
            text: 'Image',
            value: 'image',
            align: 'center'
          },
          {
            text: 'Code',
            value: 'code'
          },
          {
            text: 'Category',
            value: 'category.name'
          },
          {
            text: 'Price',
            value: 'price'
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'center'
          },
        ],
        items: []
      },
      rules: {
        required: value => !!value || 'Required.',
      },
      agentFormValid: false,
      delete_id: null,
      is_edit: false,
      edit_id: null
    };
  },
  methods: {
    view_products (id) {
      this.agent_products.items = this.products.filter(u => u.product_status.agent_id === id);

      for (let key in this.agent_products.items) {
        if (this.agent_products.items.hasOwnProperty(key)) {
          this.agent_products.items[key].image_url = '';
          if (this.agent_products.items[key].product_images.length > 0) {
            this.agent_products.items[key].image_url = this.agent_products.items[key].product_images[0].url;
          }
        } 
      }

      this.dialog.show_products = true;
    },
    view_product (product_id) {
      this.$router.push('/products/' + product_id);
    },
    view_delete (id) {
      this.delete_id = id;
      this.dialog.show_delete = true;
    },
    async delete_agent () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('agent/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_agents();
          window.getApp.$emit('agent_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('agent_DELETED_FAIL');
      }

    },
    view_add (id) {

      this.dialog.show_add = true;
      this.is_edit = false;

      for (let key in this.agent) {
        if (this.agent.hasOwnProperty(key)) {
          this.agent[key] = '';
        }
      }
    },
    view_edit (id) {
      this.dialog.show_add = true;
      this.edit_id = id;
      this.is_edit = true;

      let agent = this.agents.items.filter(u => u.id === id);
      
      for (let key in agent[0]) {
        if (agent[0].hasOwnProperty(key)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            this.agent[key] = agent[0][key];
          }
        }
      }
    },
    async edit_agent () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('agent/' + this.edit_id, this.agent, config).then(response => {
          this.dialog.show_add = false;
          this.get_agents();
          window.getApp.$emit('agent_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('agent_EDIT_FAIL');
      }
    },
    get_agents () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('agent', config).then(response => {

        let agents = response.data.agents;
       
        this.agents.items = agents;
      });
    },
    async add_agent () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().post('agent', this.agent, config).then(response => {
          this.dialog.show_add = false;
          this.get_agents();
          window.getApp.$emit('agent_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('agent_ADDED_FAIL');
      }
    },
    get_products () {

      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('product', config).then(response => {
        this.products = response.data.products.filter(function (product) {
          return product.product_status.status === 'Sold';
        });
      });
    },
  },
  // eslint-disable-next-line
  created: function () {

    this.get_agents();
    this.get_products();
  },
};
</script>
