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
                  <span class="headline">New Customer</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-form method="post" action="#" id="customerForm" v-model="customerFormValid">
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-text-field prepend-icon="perm_identity" v-model="customer.name" label="Name" hint="Name" :rules="[rules.required]"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field prepend-icon="mail_outline" v-model="customer.email" label="Email" hint="Email"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field prepend-icon="phone" v-model="customer.contact" label="Contact" hint="Contact"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field prepend-icon="place" v-model="customer.address" label="Address" hint="Address"
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
                  <v-btn color="primary" v-if="is_edit" flat @click="edit_customer()" :disabled="!customerFormValid">EDIT</v-btn>
                  <v-btn color="primary" v-else flat @click="add_customer()" :disabled="!customerFormValid">Add</v-btn>
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
                :headers="customers.customerHeaders"
                :search="search"
                :items="customers.items"
                :rows-per-page-items="[5,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.contact }}</td> 
                  <td>{{ props.item.address }}</td> 
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
                <span class="headline">Customer products</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-data-table
                  :headers="customer_products.headers"
                  :search="search"
                  :items="customer_products.items" 
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
                <span class="headline">Delete Customer</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the customer?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_customer()" class="v-btn theme--dark red">
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
      customers: {
        selected: [],
        customerHeaders: [
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
            text: 'Address',
            value: 'address'
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
      customer: {
        name: '',
        email: '',
        contact: '',
        address: '',
      },
      products: [],
      customer_products: {
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
      customerFormValid: false,
      delete_id: null,
      is_edit: false,
      edit_id: null
    };
  },
  methods: {
    view_products (id) {
      this.customer_products.items = this.products.filter(u => u.product_status.customer_id === id);

      for (let key in this.customer_products.items) {
        if (this.customer_products.items.hasOwnProperty(key)) {
          this.customer_products.items[key].image_url = '';
          if (this.customer_products.items[key].product_images.length > 0) {
            this.customer_products.items[key].image_url = this.customer_products.items[key].product_images[0].url;
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
    async delete_customer () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('customer/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_customers();
          window.getApp.$emit('CUSTOMER_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('CUSTOMER_DELETED_FAIL');
      }

    },
    view_add (id) {

      this.dialog.show_add = true;
      this.is_edit = false;

      for (let key in this.customer) {
        if (this.customer.hasOwnProperty(key)) {
          this.customer[key] = '';
        }
      }
    },
    view_edit (id) {
      this.dialog.show_add = true;
      this.edit_id = id;
      this.is_edit = true;

      let customer = this.customers.items.filter(u => u.id === id);
      
      for (let key in customer[0]) {
        if (customer[0].hasOwnProperty(key)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            this.customer[key] = customer[0][key];
          }
        }
      }
    },
    async edit_customer () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('customer/' + this.edit_id, this.customer, config).then(response => {
          this.dialog.show_add = false;
          this.get_customers();
          window.getApp.$emit('CUSTOMER_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('CUSTOMER_EDIT_FAIL');
      }
    },
    get_customers () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('customer', config).then(response => {

        let customers = response.data.customers;
       
        this.customers.items = customers;
      });
    },
    async add_customer () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().post('customer', this.customer, config).then(response => {
          this.dialog.show_add = false;
          this.get_customers();
          window.getApp.$emit('CUSTOMER_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('CUSTOMER_ADDED_FAIL');
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

    this.get_customers();
    this.get_products();
  },
};
</script>
