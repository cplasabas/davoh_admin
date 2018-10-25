<template>
  <div id="productView">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
         <v-flex sm12>
          <dd>
            <div class="display-3 grey--text text--darken-1">{{product.code}}</div>
          </dd>
          <dd>
            <div class="caption grey--text text--darken-1">{{product.description}}</div>
          </dd>
        </v-flex>        
        <v-flex lg12 sm12>
          <v-card>
            <v-form method="post" action="#" id="prodcutForm" v-model="productFormValid">
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs3 sm3 md3 offset-xs9 offset-sm9 offset-md9>
                      <v-select
                        prepend-icon="assignment"
                        label="Status"
                        required
                        v-model="product_status.status"
                        :items="status"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-flex>
                    <v-flex xs2 sm2 md2>
                      <v-text-field prefix="#" v-model="product.code" label="Product Code" hint="*Code of the Product" :rules="[rules.required]" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs2 sm2 md2>
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
                    <v-flex xs12 sm12 md12>
                      <div class="display-2 grey--text text--darken-1">Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <div class="headline grey--text text--darken-1">Diamond Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-model="product_detail.diamond_weight" label="D Weight" hint="Diamond Weight" suffix="kg" :rules="[rules.required]" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field v-if="isAdmin" v-model="product_detail.diamond_party" label="D Party" hint="Diamond Party" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field v-if="isAdmin" v-model="product_detail.diamond_cost" label="D Cost" hint="Diamond Cost" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.diamond_size" label="D Size" hint="Diamond Size" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <div class="headline grey--text text--darken-1">Gold Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-model="product_detail.gold_weight" label="G Weight" hint="Gold Weight" suffix="kg" :rules="[rules.required]" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.gold_gross_weight" label="G Gross Weight" hint="Gold Gross Weight" suffix="kg" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.gold_net_weight" label="G Net Weight" hint="Gold Net Weight" suffix="kg" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.gold_touch" label="G Touch" hint="Gold Touch" suffix="K" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field v-if="isAdmin" v-model="product_detail.gold_cost" label="G Cost" hint="Gold Cost" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <div class="headline grey--text text--darken-1">Totals</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-if="isAdmin" v-model="product_detail.labor" label="Labor" hint="Labor" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-if="isAdmin" v-model="product_detail.manufacture_cost" label="Total Cost" hint="Total Cost" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-model="product.price" label="SRP" hint="Selling Price" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <div class="display-2 grey--text text--darken-1">Status</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm3 md3>
                      <v-text-field v-model="product_status.seller" label="Client" hint="Client" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-model="product_status.commission_rate" label="Rate" hint="Rate" suffix="%" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm3 md3>
                      <v-text-field v-model="product_status.commission" label="Commission" hint="Commission" prefix="₱" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-select
                        label="Term"
                        required
                        v-model="product_status.term_id"
                        :items="terms"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm3 md3>
                      <v-text-field v-model="product_status.selling_price" label="Sold Price" hint="Sold Price" prefix="₱"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 lg4>
                      <v-menu
                        class="pr-2"
                        ref="statDate"
                        lazy
                        :close-on-content-click="false"
                        v-model="sold_date_menu"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-bottom="-22"
                        max-width="290px"
                        :return-value.sync="product_status.sold_date"
                      >
                        <v-text-field
                          slot="activator"
                          label="Sold Date"
                          v-model="product_status.sold_date"
                          append-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="sold_date" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="sold_date_menu = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.statDate.save(product_status.sold_date)">OK</v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="update_product()" :disabled="!productFormValid">UPDATE</v-btn>
              </v-card-actions>   
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Api from '@/api/api';
import store from '@/store/store';
import moment from 'moment';
import { VMoney } from 'v-money';

export default {
  data () {
    return {
      productFormValid: false,
      status: [
        {
          text: 'Manufactured',
          value: 'Manufactured'
        },
        {
          text: 'On Hand',
          value: 'On Hand'
        },
        {
          text: 'Sold',
          value: 'Sold'
        }
      ],
      categories: [],
      terms: [],
      product: {
        code: '',
        description: '',
        category_id: null,
        price: null
      },
      product_detail: {
        diamond_party: '',
        diamond_cost: null,
        diamond_size: null,
        diamond_weight: null,
        gold_weight: null,
        gold_gross_weight: null,
        gold_touch: null,
        gold_cost: null,
        labor: null,
        manufacture_cost: null,
        manufacture_date: null,
      },
      product_status: {
        status: null,
        sellet: null,
        commission_rate: null,
        commission: null,
        selling_price: null,
        sold_date: null,
        term_id: null
      },
      sold_date_menu: false,
      sold_date: null,
      rules: {
        required: value => !!value || 'Required.',
      },
      isAdmin: false,
      money: {
        decimal: '.',
        thousands: ',',
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  computed: {
    commission_rate () {
      return this.product_status.commission_rate;
    },
    product_price () {
      return this.product.price;
    }
  },
  watch: {
    sold_date () {
      this.product_status.sold_date = moment(this.sold_date).format('MMMM D, YYYY');
    },
    commission_rate () {
      if (this.commission_rate) {
        this.product_status.commission = this.product.price * (this.commission_rate / 100);
      }
    },
    product_price () {
      if (this.commission_rate) {
        this.product_status.commission = this.product.price * (this.commission_rate / 100);
      }
    }
  },
  methods: {
    get_product () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('product/' + this.$route.params.product_id, config).then(response => {
        let product = response.data.data[0];

        this.product_detail = product.product_detail;
        delete product.product_detail;

        this.product_status = product.product_status;
        delete product.product_status;
        
        if(this.product_status.sold_date){
          this.product_status.sold_date = moment(this.product_status.sold_date).format('MMMM D, YYYY');
        }
        
        this.product = product;
      });
    },
    async update_product () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };
       
        await Api().put('product/' + this.$route.params.product_id, this.product, config).then(response => {
          this.update_product_details();
        });
      } catch (error) { 
        window.getApp.$emit('PRODUCT_UPDATE_FAIL');
      }
    },
    async update_product_details () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('product_details/' + this.$route.params.product_id, this.product_detail, config).then(response => {
          this.update_product_status();
        });
      } catch (error) { 
        window.getApp.$emit('PRODUCT_UPDATE_FAIL');
      }
    },
    async update_product_status () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('product_status/' + this.$route.params.product_id, this.product_status, config).then(response => {
          this.get_product();
          window.getApp.$emit('PRODUCT_UPDATE_SUCCESS');
        });
      } catch (error) { 
        window.getApp.$emit('PRODUCT_UPDATE_FAIL');
      }
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
    get_terms () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('term', config).then(response => {
        response.data.terms.map((val) => {
          this.terms.push({
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

    if (store.state.user.level === 0) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.get_product();
    this.get_categories();
    this.get_terms();
  },
};
</script>
