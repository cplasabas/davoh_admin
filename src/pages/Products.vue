<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap justify-end>
        <v-flex lg2 >
            <v-dialog v-model="dialog.show_add" v-show="isAdmin" scrollable @keydown.esc="dialog.show_add = false" persistent max-width="700px">
              <v-btn color="primary" dark slot="activator">
                <v-icon >add</v-icon>
                add
              </v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">New Product</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field v-model="product.code" label="Product Code" hint="Code of the Product" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-textarea v-model="product.description" name="description" label="Description" hint="Description of the product"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-autocomplete
                          label="Category"
                          required
                          v-model="product.category_id"
                          :items="categories"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm4 md4>
                        <v-text-field v-model="product.carat" label="Carat" hint="Carat Count"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm4 md4>
                        <v-text-field v-model="product.gold" label="Gold" hint="Gold Count"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm4 md4>
                        <v-text-field v-model="product.diamond" label="Diamond" hint="Diamond Count"></v-text-field>
                      </v-flex>
                     <v-flex xs12 sm4 lg4>
                      <v-menu
                        class="pr-2"
                        ref="statDate"
                        lazy
                        :close-on-content-click="false"
                        v-model="manufacture_date_menu"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-bottom="-22"
                        max-width="290px"
                        :return-value.sync="manufacture_date"
                      >
                        <v-text-field
                          slot="activator"
                          label="Manufacture Date"
                          v-model="manufacture_date"
                          append-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="manufacture_date" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="manufacture_date_menu = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.statDate.save(manufacture_date)">OK</v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm4 lg 4>
                      <v-text-field v-model="product.manufacture_cost" label="Manufacture Cost" value="00.00" prefix="$"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 lg 4>
                      <v-text-field v-model="product.labor" label="Labor" value="00.00" prefix="$"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 lg 12>
                      <v-text-field v-model="product.price" label="Price" value="00.00" prefix="$"></v-text-field>
                    </v-flex>
                    </v-layout>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                  <v-btn color="primary" flat @click="add_product()">Add</v-btn>
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
                :headers="products.adminHeaders"
                :search="search"
                :items="products.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                select-all
                v-show="isAdmin"
                v-model="products.selected"
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
                  <td>{{ props.item.code }}</td>
                  <td>{{ props.item.category.name }}</td>
                  <!-- <td>{{ props.item.labor | currency }}</td> -->
                  <td>{{ props.item.manufacture_cost | currency }}</td>
                  <!-- <td>{{ props.item.manufacture_date | moment("MMMM Do YYYY") }}</td> -->
                  <td>{{ props.item.price | currency }}</td>
                  <td>{{ props.item.product_status.status}}</td>
                  <td class="text-xs-center">
                    <v-btn @click="view_product(props.item.id)" depressed outline icon fab dark color="green" small>
                      <v-icon>remove_red_eye</v-icon>
                    </v-btn>
                    <v-btn @click="view_delete(props.item.id)" depressed outline icon fab dark color="pink" slot="activator" small>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="products.nonAdminHeaders"
                :search="search"
                :items="products.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                select-all
                v-show="isNotAdmin"
                v-model="products.selected"
                
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
                  <td>{{ props.item.code }}</td>
                  <td>{{ props.item.category.name}}</td>
                  <td>{{ props.item.gold }}</td>
                  <td>{{ props.item.diamond }}</td>
                  <td>{{ props.item.price | currency }}</td>
                  <td>{{ props.item.product_status.status}}</td>
                  <td>
                    <v-btn @click="view_product(props.item.id)" depressed outline icon fab dark color="green" small>
                      <v-icon>remove_red_eye</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <v-dialog v-model="dialog.show_delete" scrollable @keydown.esc="dialog.show_delete = false" persistent max-width="700px">
            <v-card>
              <v-card-title>
                <span class="headline">Delete Product</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the product?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_product()" class="v-btn theme--dark red">
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
import moment from 'moment';

export default {
  data () {
    return {
      search: '',
      categories: [],
      products: {
        selected: [],
        adminHeaders: [
          {
            text: 'Image',
            value: 'image',
          },
          {
            text: 'Code',
            value: 'code'
          },
          {
            text: 'Category',
            value: 'category'
          },
          // {
          //   text: 'Labor',
          //   value: 'labor'
          // },
          {
            text: 'Manufacture Cost',
            value: 'manufacture_cost'
          },
          // {
          //   text: 'Manufacture Date',
          //   value: 'manufacture_date'
          // },
          {
            text: 'Price',
            value: 'price'
          },
          {
            text: 'Status',
            value: 'status'
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'center'
          },
        ],
        nonAdminHeaders: [
          {
            text: 'Image',
            value: 'image',
          },
          {
            text: 'Code',
            value: 'code'
          },
          {
            text: 'Category',
            value: 'category'
          },
          {
            text: 'Diamond (kg)',
            value: 'diamond'
          },
          {
            text: 'Gold (kg)',
            value: 'gold'
          },
          {
            text: 'Price',
            value: 'price'
          },
          {
            text: 'Status',
            value: 'status'
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
      manufacture_date_menu: false,
      manufacture_date: null,
      product: {
        code: '',
        description: '',
        category_id: null,
        carat: null,
        gold: null,
        diamond: null,
        manufacture_date: null,
        manufacture_cost: null,
        labor: null,
        price: null
      },
      delete_id: null,
      isAdmin: false,
      isNotAdmin: false
    };
  },
  methods: {
    view_delete (product_id) {
      this.delete_id = product_id;
      this.dialog.show_delete = true;
    },
    async delete_product () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('product/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_products();
          window.getApp.$emit('PRODUCT_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('PRODUCT_DELETED_FAIL');
      }

    },
    view_product (product_id) {
      this.$router.push('/products/' + product_id);
    },
    get_products () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('product', config).then(response => {
        if (store.state.user.level === 0) {
          this.products.items = response.data.products;
        } else {
          this.products.items = response.data.products.filter(function (product) {
            return product.product_status.status !== 'Manufactured';
          });
        }
      });
    },
    get_categories () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('category', config).then(response => {
        response.data.categories.map((val) => {
          this.categories.push({
            text: val.name,
            value: val.id
          });
          return true;
        });
      });
    },
    async add_product () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        this.product.manufacture_date = moment(this.manufacture_date).format();
        await Api().post('product', this.product, config).then(response => {
          this.dialog.show_add = false;
          this.get_products();
          window.getApp.$emit('PRODUCT_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('PRODUCT_ADDED_FAIL');
      }
    }
  },
  // eslint-disable-next-line
  created: function () {

    if (store.state.user.level === 0) {
      this.isAdmin = true;
      this.isNotAdmin = false;
    } else {
      this.isNotAdmin = true;
      this.isAdmin = false;
    }

    this.get_products();
    this.get_categories();
  },
};
</script>
