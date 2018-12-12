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
                  <span class="headline">New Shipment</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-form method="post" action="#" id="shipmentForm" v-model="shipmentFormValid">
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs4 sm4 md4>
                          <v-text-field prefix="#" v-model="shipment.code" label="Code" hint="Code of the Shipment" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs8 sm8 md8>
                          <v-select
                            prepend-icon="layers"
                            label="Supplier"
                            v-model="shipment.supplier_id"
                            :items="suppliers"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm4 lg4>
                          <v-menu
                            class="pr-2"
                            ref="statDate"
                            lazy
                            :close-on-content-click="false"
                            v-model="date_menu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-bottom="-22"
                            max-width="290px"
                            :return-value.sync="shipment.date"
                          >
                            <v-text-field
                              slot="activator"
                              label="Date"
                              v-model="shipment.date"
                              append-icon="event"
                              readonly
                              :rules="[rules.required]"
                            ></v-text-field>`
                            <v-date-picker v-model="shipment.date" no-title scrollable>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="date_menu = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.statDate.save(shipment.date)">OK</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                  <v-btn color="primary" v-if="is_edit" flat @click="edit_shipment()" :disabled="!shipmentFormValid">EDIT</v-btn>
                  <v-btn color="primary" v-else flat @click="add_shipment()" :disabled="!shipmentFormValid">Add</v-btn>
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
                :headers="shipments.shipmentHeaders"
                :search="search"
                :items="shipments.items"
                :rows-per-page-items="[5,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.code }}</td>
                  <td>{{ props.item.supplier.name }}</td>
                  <td>{{ props.item.date | moment("MMMM D, YYYY") }}</td> 
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
                <span class="headline">shipment products</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-data-table
                  :headers="shipment_products.headers"
                  :search="search"
                  :items="shipment_products.items" 
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
                <span class="headline">Delete shipment</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the shipment?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_shipment()" class="v-btn theme--dark red">
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
      shipments: {
        selected: [],
        shipmentHeaders: [
          {
            text: 'Code',
            value: 'code'
          },
          {
            text: 'Supplier',
            value: 'supplier'
          },
          {
            text: 'Date',
            value: 'date'
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
      date_menu: false,
      date: null,
      shipment: {
        code: null,
        supplier_id: null,
        date: null
      },
      products: [],
      suppliers: [],
      shipment_products: {
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
      shipmentFormValid: false,
      delete_id: null,
      is_edit: false,
      edit_id: null
    };
  },
  methods: {
    view_products (id) {
      this.shipment_products.items = this.products.filter(u => u.shipment_id === id);

      for (let key in this.shipment_products.items) {
        if (this.shipment_products.items.hasOwnProperty(key)) {
          this.shipment_products.items[key].image_url = '';
          if (this.shipment_products.items[key].product_images.length > 0) {
            this.shipment_products.items[key].image_url = this.shipment_products.items[key].product_images[0].url;
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
    async delete_shipment () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('shipment/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_shipments();
          window.getApp.$emit('shipment_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('shipment_DELETED_FAIL');
      }

    },
    view_add (id) {

      this.dialog.show_add = true;
      this.is_edit = false;

      for (let key in this.shipment) {
        if (this.shipment.hasOwnProperty(key)) {
          this.shipment[key] = '';
        }
      }
    },
    view_edit (id) {
      this.dialog.show_add = true;
      this.edit_id = id;
      this.is_edit = true;

      let shipment = this.shipments.items.filter(u => u.id === id);
      
      for (let key in shipment[0]) {
        if (shipment[0].hasOwnProperty(key)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            this.shipment[key] = shipment[0][key];
          }
        }
      }
    },
    async edit_shipment () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('shipment/' + this.edit_id, this.shipment, config).then(response => {
          this.dialog.show_add = false;
          this.get_shipments();
          window.getApp.$emit('shipment_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('shipment_EDIT_FAIL');
      }
    },
    get_shipments () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('shipment', config).then(response => {
        let shipments = response.data.shipments;
       
        this.shipments.items = shipments;
      });
    },
    async add_shipment () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().post('shipment', this.shipment, config).then(response => {
          this.dialog.show_add = false;
          this.get_shipments();
          window.getApp.$emit('shipment_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('shipment_ADDED_FAIL');
      }
    },
    get_products () {

      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('product', config).then(response => {
        this.products = response.data.products;
      });
    },
    get_suppliers () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('supplier', config).then(response => {

        response.data.suppliers.map((val) => {
          this.suppliers.push({
            text: val.name,
            value: val.id
          });
          return true;
        });
      });
    },
  },
  // eslint-disable-next-line
  created: function () {

    this.get_shipments();
    this.get_products();
    this.get_suppliers();
  },
};
</script>
