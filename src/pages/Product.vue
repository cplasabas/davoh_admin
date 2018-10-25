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
                    <v-flex xs2 sm3 md3>
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
                      <div class="display-2 grey--text text--darken-1">Product Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <div class="headline grey--text text--darken-1">Diamond Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-model="product_detail.diamond_weight" label="D Weight" hint="Diamond Weight" suffix="ct" :rules="[rules.required]" clearable></v-text-field>
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
                      <v-text-field type="number" v-model="product_detail.gold_weight" label="G Weight" hint="Gold Weight" suffix="gm" :rules="[rules.required]" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-model="product_detail.gold_touch" label="G Touch" hint="Gold Touch" suffix="K" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.gold_gross_weight" label="G Gross Weight" hint="Gold Gross Weight" suffix="gm" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.gold_net_weight" label="G Net Weight" hint="Gold Net Weight" suffix="gm" clearable></v-text-field>
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
                    <v-flex xs12 sm12 md12 v-show="is_sold">
                      <div class="display-2 grey--text text--darken-1">Payment Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm4 md4 v-show="is_sold">
                      <v-text-field v-model="product_status.seller" label="Client" hint="Client" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs3 sm3 md3 v-show="is_sold">
                      <v-select
                        label="Payment Type"
                        required
                        v-model="product_status.type"
                        :items="type"
                      ></v-select>
                    </v-flex>
                    <v-flex xs3 sm3 md3 v-show="is_sold">
                      <v-select
                        label="Term"
                        required
                        v-model="product_status.term_id"
                        :items="terms"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm3 md3 v-show="is_sold">
                      <v-text-field v-model="product_status.selling_price" label="Sold Price" hint="Sold Price" prefix="₱"></v-text-field>
                    </v-flex>
                     <v-flex xs12 sm1 md1 v-show="is_sold">
                      <v-text-field type="number" v-model="commission_rate" label="Rate" hint="Rate" suffix="%" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm3 md3 v-show="is_sold">
                      <v-text-field v-model="product_status.commission" label="Commission" hint="Commission" prefix="₱" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm3 lg3 v-show="is_sold">
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
                    <v-flex xs12 sm12 md12 v-show="is_sold && is_term">
                      <div class="headline grey--text text--darken-1">Term Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm2 md2 v-show="is_sold && is_term">
                      <v-text-field v-model="product_status.paid" label="Paid" hint="Paid" prefix="₱"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 v-show="is_sold && is_term">
                      <v-text-field v-model="balance" label="Balance" hint="Balance" prefix="₱" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm1 md1 v-show="is_sold && is_term">
                      <v-text-field type="number" v-model="interest" label="Interest" hint="Interest" suffix="%" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 v-show="is_sold && is_term">
                      <v-text-field v-model="payment_amount" label="Amount" hint="Amount" prefix="₱" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm3 md3 v-show="is_sold && is_term">
                      <v-text-field append-icon="event" v-model="due_date" label="Due Date" hint="Due Date" readonly></v-text-field>
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
      type: [
        {
          text: 'Without Agent',
          value: 0
        },
        {
          text: 'With Agent',
          value: 1
        }
      ],
      original_categories: [],
      categories: [],
      original_terms: [],
      terms: [],
      product: {
        code: '',
        description: '',
        category_id: null,
        price: null
      },
      product_detail: {
        diamond_party: '',
        diamond_cost: 0,
        diamond_size: 0,
        diamond_weight: 0,
        gold_weight: 0,
        gold_gross_weight: 0,
        gold_touch: 0,
        gold_cost: 0,
        labor: 0,
        manufacture_cost: 0,
        manufacture_date: 0,
      },
      product_status: {
        status: null,
        seller: null,
        selling_price: 0,
        commission: 0,
        sold_date: 0,
        term_id: null,
        paid: null,
      },
      sold_date_menu: false,
      sold_date: null,
      rules: {
        required: value => !!value || 'Required.',
      },
      is_sold: false,
      is_term: false,
      isAdmin: false,
      due_date: null,
      commission_rate: 0,
      commission: 0,
      balance: 0,
      interest: 0,
      payment_amount: 0,
      money: {
        decimal: '.',
        thousands: ',',
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  computed: {
    product_category () {
      return this.product.category_id;
    },
    product_price () {
      return this.product_status.selling_price;
    },
    product_sold_date () {
      return this.product_status.sold_date;
    },
    payment_status () {
      return this.product_status.status;
    },
    payment_term () {
      return this.product_status.term_id;
    },
    payment_paid () {
      return this.product_status.paid;
    }
  },
  watch: {
    sold_date () {
      this.product_status.sold_date = moment(this.sold_date).format('MMMM D, YYYY');
    },
    product_category () {
      setTimeout(function () {
        let category = this.original_categories.filter(u => u.id === this.product.category_id);

        this.commission_rate = category[0].commission_rate;

      }.bind(this), 100);
    },
    commission_rate () {
      if (this.commission_rate && this.product_status.selling_price) {
        this.product_status.commission = this.product_status.selling_price * (this.commission_rate / 100);
      }
    },
    product_price () {
      if (this.commission_rate && this.product_status.selling_price) {
        this.product_status.commission = this.product_status.selling_price * (this.commission_rate / 100);
        
        let term = this.original_terms.filter(u => u.id === this.product_status.term_id);

        let days = term[0].days + (term[0].months * 30) + ((term[0].years * 12) * 30);

        let payment_amount = this.product_status.selling_price / days;

        if (term[0].interest) {
          let interest_amount = payment_amount * (term[0].interest / 100);
          payment_amount += interest_amount;
        }

        this.payment_amount = payment_amount.toFixed(2);
      }
    },
    payment_status () {
      if (this.product_status.status === 'Sold') {
        this.is_sold = true;
      } else {
        this.is_sold = false;
      }
    },
    payment_term () {

      setTimeout(function () {
        let term = this.original_terms.filter(u => u.id === this.product_status.term_id);
        if (typeof term !== 'undefined' && term[0].name !== 'Cash') {
          this.interest = term[0].interest;
          this.is_term = true;

          let days = term[0].days + (term[0].months * 30) + ((term[0].years * 12) * 30);

          let payment_amount = this.product_status.selling_price / days;

          if (term[0].interest) {
            let interest_amount = payment_amount * (term[0].interest / 100);
            payment_amount += interest_amount;
          }

          this.payment_amount = payment_amount.toFixed(2);
        } else {
          this.is_term = false;
        }

      }.bind(this), 100);
    },
    payment_paid () {
      if (this.product_status.paid) {
        this.balance = this.product_status.selling_price - this.product_status.paid;
      }
    },
    product_sold_date () {
      setTimeout(function () {
        let term = this.original_terms.filter(u => u.id === this.product_status.term_id);

        this.due_date = moment(this.product_status.sold_date)
          .add(term[0].years, 'years')
          .add(term[0].months, 'months')
          .add(term[0].days, 'days')
          .format('MMMM D, YYYY');

      }.bind(this), 100);
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
        
        if (this.product_status.sold_date) {
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
        this.original_categories = response.data.categories;
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
        this.original_terms = response.data.terms;
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
