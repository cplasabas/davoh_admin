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
                <v-card-title>
                  <span class="headline">New Product</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-form method="post" action="#" id="prodcutForm" v-model="productFormValid">
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 md12 lg12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                          <img :src="imageUrl" height="150" v-if="imageUrl"/>
                          <v-text-field label="Select Image" @click="pickFile" v-model="imageName" prepend-icon="attach_file" :rules="[rules.required]"></v-text-field>
                          <input
                            type="file"
                            style="display: none"
                            ref="image"
                            accept="image/*"
                            @change="onFilePicked"
                          >
                        </v-flex>
                        <v-flex xs3 sm3 md3>
                          <v-text-field prefix="#" v-model="product.code" label="Product Code" hint="*Code of the Product" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs3 sm3>
                          <v-select
                            prepend-icon="local_offer"
                            label="Category"
                            required
                            v-model="product.category_id"
                            :items="categories"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-flex>
                        <v-flex xs3 sm3>
                          <v-select
                            prepend-icon="layers"
                            label="Supplier"
                            required
                            v-model="product.supplier_id"
                            :items="suppliers"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-flex>
                        <v-flex xs3 sm3>
                          <v-select
                            prepend-icon="local_shipping"
                            label="Shipment Code"
                            required
                            v-model="product.shipment_id"
                            :items="shipments"
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
                          <v-select
                            label="Gold Touch"
                            hint="*Gold Touch"
                            v-model="product_details.gold_touch"
                            :items="gold_touches"
                            :rules="[rules.required]"
                            suffix="K"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm3 md3>
                          <v-text-field type="number" v-model="product_details.diamond_weight" label="Diamond" hint="Diamond Weight" suffix="ct" clearable></v-text-field>
                        </v-flex>
                      <v-flex xs4 sm6 lg6>
                        <v-text-field v-model="priceFormatted" label="SRP" hint="*Selling Price" prefix="₱" :rules="[rules.required]" clearable></v-text-field>
                      </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-form>
                </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="dialog.show_add = false" :disabled="is_adding">Close</v-btn>
                <v-btn color="primary" flat @click="add_product()" :disabled="!productFormValid || is_adding">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs2 sm2>
          <v-select
            prepend-icon="filter_list"
            label="Status"
            required
            v-model="product_status_filter"
            :items="product_status"
          ></v-select>
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
                :pagination.sync="pagination"
                :items="products.items" 
                :rows-per-page-items="[5]"
                class="elevation-1"
                item-key="name"             
                :disable-page-reset="true"
                >
                <template slot="items" slot-scope="props">         
                  <tr style="cursor: pointer" @click="view_product(props.item.id)">
                    <td class="text-xs-center">
                      <v-avatar size="32">
                        <img :src="props.item.image_url" alt="">
                      </v-avatar> 
                    </td>
                    <td>{{ props.item.code }}</td>
                    <td>{{ props.item.category.name}}</td>
                    <td>{{ props.item.product_detail.gold_weight }}mg</td>
                    <td>{{ props.item.product_detail.gold_touch }}K</td>
                    <td>{{ props.item.product_detail.diamond_weight }}ct</td>
                    <td>{{ props.item.price | currency }}</td>
                    <td>{{ props.item.product_status.selling_price | currency }}</td>
                    <td>{{ props.item.product_status.status}}</td>
                    <td class="text-xs-center">
                      <v-btn @click="view_delete(props.item.id)" depressed outline icon fab dark color="pink" slot="activator" small>
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
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
import NProgress from 'nprogress';

export default {
  data () {
    return {
      search: '',
      categories: [],
      pagination: {
        page: 1,
        sortBy: 'Code',
        descending: true
      },
      original_products: [],
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
            value: 'category.name'
          },
          {
            text: 'Gold (gm)',
            value: 'product_detail.gold_weight'
          },
          {
            text: 'Gold Touch (K)',
            value: 'product_detail.gold_touch'
          },
          {
            text: 'Diamond (ct)',
            value: 'product_detail.diamond_weight'
          },
          {
            text: 'Price',
            value: 'price'
          },
          {
            text: 'Selling Price',
            value: 'product_status.selling_price'
          },
          {
            text: 'Status',
            value: 'product_status.status'
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'center'
          },
        ],
        items: []
      },
      gold_touches: [
        {
          text: '12',
          value: 12
        },
        {
          text: '14',
          value: 14
        },
        {
          text: '18',
          value: 18
        }
      ],
      product_status: [
        {
          text: 'All',
          value: 0
        },
        {
          text: 'On Hand',
          value: 1
        },
        {
          text: 'Sold',
          value: 2
        }
      ],
      product_status_filter: 0,
      dialog: { 
        show_add: false,
        show_delete: false
      },
      suppliers: [],
      shipments: [],
      product: {
        code: '',
        description: '',
        category_id: null,
        shipment_id: null,
        supplier_id: null,
        price: null
      },
      product_details: {
        gold_weight: null,
        diamond_weight: null
      },
      page_number: null,
      delete_id: null,
      productFormValid: false,
      isAdmin: false,
      imageName: '',
      imageUrl: '',
      product_image: '',
      is_adding: false,
      rules: {
        required: value => !!value || 'Required.',
      }
    };
  },
  computed: {
    priceFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product.price, 0);
      },
      set: function (newValue) {
        this.product.price = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    }
  },
  watch: {
    product_status_filter: function (val) {
      this.products.items = this.original_products;

      if (val === 1) {
        this.products.items = this.original_products.filter(u => u.product_status.status === 'On Hand');
      } else if (val === 2) {
        this.products.items = this.original_products.filter(u => u.product_status.status === 'Sold');
      }
    }
  },
  mounted () {
    if (store.state.page) {
      this.pagination.page = store.state.page;  
      this.$store.dispatch('setPage', null);
    }
  },
  methods: {
    formatAsCurrency (value, dec) {
      dec = dec || 0;

      if (value === null) {
        return 0;
      }
      return value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    },
    pickFile () {
      this.$refs.image.click();
    },
    onFilePicked (e) {
      let files = e.target.files;

      if (files[0] !== undefined) {
        this.imageName = files[0].name;

        if (this.imageName.lastIndexOf('.') <= 0) {
          return;
        }

        const fr = new FileReader();
        fr.readAsDataURL(files[0]);

        fr.addEventListener('load', () => {
          this.imageUrl = fr.result;
          this.product_image = files[0];
        });

      } else {
        this.imageName = '';
        this.product_image = '';
        this.imageUrl = '';
      }
    },
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
      this.$store.dispatch('setPage', this.pagination.page);
      this.$router.push('/products/' + product_id);
    },
    get_products () {
      NProgress.start();
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('product', config).then(response => {
        if (store.state.user.level === 0) {
          this.products.items = response.data.products;
        } else {
          this.products.items = response.data.products.filter(function (product) {
            return product.product_status.status !== 'Created';
          });
        }

        for (let key in this.products.items) {
          if (this.products.items.hasOwnProperty(key)) {
            this.products.items[key].image_url = '';
            if (this.products.items[key].product_images.length > 0) {
              this.products.items[key].image_url = this.products.items[key].product_images[0].url;
            }
          }
        }
        this.original_products = this.products.items;
        NProgress.done();
        this.is_adding = false;
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
        NProgress.start();
        this.is_adding = true;
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        if (this.isAdmin) {
          this.product.status = 'Created';
        } else {
          this.product.status = 'On Hand';
        }
        
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
          this.add_product_image(id);
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('PRODUCT_ADDED_FAIL');
      }
    },
    async add_product_image (id) {
      try {
        let config = {
          headers: { 
            'Authorization': this.$store.state.token,
            'Content-Type': 'multipart/form-data'
          }
        };

        let formData = new FormData();
        formData.append('image', this.product_image);

        await Api().post('product/' + id + '/image', formData, config).then(response => {
          this.dialog.show_add = false;
          this.get_products();
          window.getApp.$emit('PRODUCT_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('PRODUCT_ADDED_FAIL');
      }
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
    get_shipments () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('shipment', config).then(response => {

        response.data.shipments.map((val) => {
          this.shipments.push({
            text: val.code,
            value: val.id
          });
          return true;
        });
      });
    },
  },
  // eslint-disable-next-line
  created: function () {
    if (store.state.user.level === 0) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.get_products();
    this.get_categories();
    this.get_suppliers();
    this.get_shipments();
  },
};
</script>

<style lang="css" scoped>
  .clickable {
    cursor: pointer;
  }
</style>