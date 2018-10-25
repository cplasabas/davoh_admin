<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap justify-end>
        <v-flex lg2 >
            <v-dialog v-model="dialog.show_add" scrollable @keydown.esc="dialog.show_add = false" persistent max-width="700px">
              <v-btn color="primary" dark slot="activator">
                <v-icon >add</v-icon>
                add
              </v-btn>
              <v-card>
                <v-form method="post" action="#" id="prodcutForm" v-model="productFormValid">
                  <v-card-title>
                    <span class="headline">New Product</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs6 sm6 md6>
                          <v-text-field prefix="#" v-model="product.code" label="Product Code" hint="*Code of the Product" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm6>
                          <v-select
                            prepend-icon="layers"
                            label="Category"
                            required
                            v-model="product.category_id"
                            :items="categories"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-textarea v-model="product.description" name="description" label="Description" hint="*Description of the product"
                          clearable ></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm3 md3>
                          <v-text-field type="number" v-model="product_details.gold_weight" label="Gold" hint="*Gold Weight" suffix="gm" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm3 md3>
                          <v-text-field type="number" v-model="product_details.gold_touch" label="Gold Touch" hint="*Gold Touch" suffix="K" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm3 md3>
                          <v-text-field type="number" v-model="product_details.diamond_weight" label="Diamond" hint="*Diamond Weight" suffix="ct" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                      <!-- <v-flex xs12 sm4 lg4>
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
                      </v-flex> -->
                      <v-flex xs4 sm6 lg6>
                        <v-text-field v-model="product.price" label="SRP" hint="*Selling Price" prefix="₱" :rules="[rules.required]" clearable></v-text-field>
                      </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                    <v-btn color="primary" flat @click="add_product()" :disabled="!productFormValid">Add</v-btn>
                  </v-card-actions>
                </v-form>
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
                :headers="products.headers"
                :search="search"
                :items="products.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"              
                >
                <template slot="items" slot-scope="props">         
                  <td class="text-xs-center">
                    <v-avatar size="32">
                      <img :src="props.item.image" alt="">
                    </v-avatar> 
                  </td>
                  <td>{{ props.item.code }}</td>
                  <td>{{ props.item.category.name}}</td>
                  <td>{{ props.item.product_detail.gold_weight }}gm</td>
                  <td>{{ props.item.product_detail.gold_touch }}K</td>
                  <td>{{ props.item.product_detail.diamond_weight }}ct</td>
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

export default {
  data () {
    return {
      search: '',
      categories: [],
      products: {
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
            value: 'category'
          },
          {
            text: 'Gold (gm)',
            value: 'gold_weight'
          },
          {
            text: 'Gold Touch (K)',
            value: 'gold_touch'
          },
          {
            text: 'Diamond (ct)',
            value: 'diamond_weight'
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
      product: {
        code: '',
        description: '',
        category_id: null,
        price: null
      },
      product_details: {
        gold_weight: null,
        diamond_weight: null
      },
      delete_id: null,
      productFormValid: false,
      rules: {
        required: value => !!value || 'Required.',
      }
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

        await Api().post('product', this.product, config).then(response => {
          this.add_product_details(response.data.product.id);
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('PRODUCT_ADDED_FAIL');
      }
    },
    async add_product_details (id) {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };
        await Api().put('product_details/' + id, this.product_details, config).then(response => {
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
    this.get_products();
    this.get_categories();
  },
};
</script>
