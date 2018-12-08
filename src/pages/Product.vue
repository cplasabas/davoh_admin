<template>
  <div id="productView">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
         <v-flex sm6>
          <dd>
            <div class="display-3 grey--text text--darken-1">{{product.code}}</div>
          </dd>
          <dd>
            <div class="body-1 grey--text text--darken-1">{{product.description}}</div>
          </dd>
          <dd>
            <v-flex >
              <v-btn v-if="is_image_add" @click="show_upload()" color="primary" right>
                Upload Image
                <v-icon right dark>cloud_upload</v-icon>
              </v-btn>
            </v-flex>
          </dd>
        </v-flex>     
        <v-flex v-for="(image,key) in product.product_images" :key="key" xs2 md2 lg2>
          <v-card class="elevation-0 transparent">
            <v-btn @click="show_delete(image.id)" v-if="is_image_delete" absolute right outline icon fab dark color="pink" small>
              <v-icon>clear</v-icon>
            </v-btn>
            <v-card-media height="150px" width="150px">
              <img :src="image.url" alt="">
            </v-card-media>
          </v-card>
        </v-flex>
          
        <v-flex lg12 sm12>
          <v-card>
            <v-form method="post" action="#" id="prodcutForm" v-model="productFormValid">
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs3 sm3 md3 offset-xs9 offset-sm9 offset-md9 >
                      <v-select
                        prepend-icon="assignment"
                        label="Status"
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
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.diamond_weight" label="D Weight" hint="Diamond Weight" suffix="ct" :rules="[rules.required]" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field v-if="isAdmin" v-model="diamondWeightPriceFormatted" label="D Price" hint="Diamond Cost per Carat" prefix="$" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field v-if="isAdmin" v-model="diamondCostFormatted" label="D Total Cost" hint="Diamond Total Cost" prefix="$" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field v-if="isAdmin" v-model="product_detail.diamond_party" label="D Party" hint="Diamond Party" clearable></v-text-field>
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
                      <v-select
                        label="Gold Touch"
                        required
                        v-model="product_detail.gold_touch"
                        :items="gold_touches"
                        suffix="K"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.gold_gross_weight" label="G Gross Weight" hint="Gold Gross Weight" suffix="gm" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field type="number" v-if="isAdmin" v-model="product_detail.gold_net_weight" label="G Net Weight" hint="Gold Net Weight" suffix="gm" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2>
                      <v-text-field v-if="isAdmin" v-model="goldCostFormatted" label="G Cost" hint="Gold Cost" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <div class="headline grey--text text--darken-1">Totals</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-if="isAdmin" v-model="laborFormatted" label="Labor" hint="Labor" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-if="isAdmin" v-model="manufactureCostFormatted" label="Total Cost" hint="Total Cost" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-model="priceFormatted" label="SRP" hint="Selling Price" prefix="₱" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12 v-show="is_sold">
                      <div class="display-2 grey--text text--darken-1">Payment Details</div>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs3 sm3 md3 v-show="is_sold">
                      <v-select
                        label="Client"
                        required
                        v-model="product_status.customer_id"
                        :items="customers"
                      ></v-select>
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
                      <v-text-field v-model="soldPriceFormatted" label="Sold Price" hint="Sold Price" prefix="₱"></v-text-field>
                    </v-flex>
                     <v-flex xs12 sm1 md1 v-show="is_sold">
                      <v-text-field type="number" v-model="commission_rate" label="Rate" hint="Rate" suffix="%" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm3 md3 v-show="is_sold">
                      <v-text-field v-model="commissionFormatted" label="Commission" hint="Commission" prefix="₱" readonly></v-text-field>
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
                      <v-text-field v-model="paidFormatted" label="Paid" hint="Paid" prefix="₱"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 v-show="is_sold && is_term">
                      <v-text-field v-model="balanceFormatted" label="Balance" hint="Balance" prefix="₱" readonly></v-text-field>
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
          <v-dialog v-model="dialog.show_delete" scrollable @keydown.esc="dialog.show_delete = false" persistent max-width="700px">
            <v-card>
              <v-card-title>
                <span class="headline">Delete Product</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the image?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_image()" class="v-btn theme--dark red">
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
          <v-dialog v-model="dialog.show_upload" scrollable persistent max-width="700px">
            <v-card>
              <v-card-title>
                <span class="headline">Upload Image</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Select an image you want to upload?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <img :src="imageUrl" height="150" v-if="imageUrl"/>
                      <v-text-field label="Image" @click="pickFile" v-model="imageName" prepend-icon="attach_file"></v-text-field>
                      <input
                        type="file"
                        style="display: none"
                        ref="image"
                        accept="image/*"
                        @change="onFilePicked"
                      >
                    </div>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="dialog.show_upload = false" :disabled="is_image_uploading">Close</v-btn>
                <v-btn color="primary" flat @click="upload_image()" :disabled="is_image_uploading">Upload</v-btn>
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
import NProgress from 'nprogress';

export default {
  data () {
    return {
      productFormValid: false,
      status: [
        {
          text: 'Created',
          value: 'Created'
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
      original_categories: [],
      categories: [],
      original_terms: [],
      terms: [],
      original_customers: [],
      customers: [],
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
        diamond_weight_price: 0,
        gold_weight: 0,
        gold_gross_weight: 0,
        gold_touch: 0,
        gold_cost: 0,
        labor: 0,
        manufacture_cost: 0,
        manufacture_date: null,
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
      dialog: {
        show_delete: false,
        show_upload: false
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
      imageName: '',
      imageUrl: '',
      product_image: '',
      image_count: 0,
      is_image_add: true,
      is_image_delete: true,
      is_image_uploading: false,
      delete_id: 0
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
    },
    manufactureCostFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_detail.manufacture_cost, 0);
      },
      set: function (newValue) {
        this.product_detail.manufacture_cost = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    laborFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_detail.labor, 0);
      },
      set: function (newValue) {
        this.product_detail.labor = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    diamondWeightPriceFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_detail.diamond_weight_price, 0);
      },
      set: function (newValue) {
        this.product_detail.diamond_weight_price = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    diamondCostFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_detail.diamond_cost, 0);
      },
      set: function (newValue) {
        this.product_detail.diamond_cost = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    goldCostFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_detail.gold_cost, 0);
      },
      set: function (newValue) {
        this.product_detail.gold_cost = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    soldPriceFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_status.selling_price, 0);
      },
      set: function (newValue) {
        this.product_status.selling_price = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    commissionFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_status.commission, 0);
      },
      set: function (newValue) {
        this.product_status.commission = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    paidFormatted: {
      get: function () {
        return this.formatAsCurrency(this.product_status.paid, 0);
      },
      set: function (newValue) {
        this.product_status.paid = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    balanceFormatted: {
      get: function () {
        return this.formatAsCurrency(this.balance, 0);
      },
      set: function (newValue) {
        this.balance = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
    product_category () {
      return this.product.category_id;
    },
    diamond_weight_price () {
      return this.product_detail.diamond_weight_price;
    },
    diamond_weight () {
      return this.product_detail.diamond_weight;
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
    },
    payment_type () {
      return this.product_status.type;
    }
  },
  watch: {
    image_count () {
      if (this.image_count >= 3) {
        this.is_image_add = false;
      } else {
        this.is_image_add = true;
      }

      if (this.image_count <= 1) {
        this.is_image_delete = false;
      } else {
        this.is_image_delete = true;
      }

    },
    sold_date () {
      this.product_status.sold_date = moment(this.sold_date).format('MMMM D, YYYY');
    },
    product_category () {
      setTimeout(function () {
        let category = this.original_categories.filter(u => u.id === this.product.category_id);
        
        let commission_rate = category[0].commission_rate;

        if (this.product_status.type === 1) {
          commission_rate *= 2;
        } 
        
        this.commission_rate = commission_rate;

      }.bind(this), 100);
    },
    payment_type () {
      setTimeout(function () {
        let category = this.original_categories.filter(u => u.id === this.product.category_id);
          
        let commission_rate = category[0].commission_rate;

        if (this.product_status.type === 1) {
          commission_rate *= 2;
        }
        
        this.commission_rate = commission_rate;

        if (this.commission_rate && this.product_status.selling_price) {
          this.product_status.commission = this.product_status.selling_price * (this.commission_rate / 100);
          
          let term = this.original_terms.filter(u => u.id === this.product_status.term_id);

          let days = term[0].days + (term[0].months * 30) + ((term[0].years * 12) * 30);

          let payment_amount = this.product_status.selling_price / days;

          if (term[0].interest) {
            let interest_amount = payment_amount * (term[0].interest / 100);
            payment_amount += interest_amount;
          }

          this.payment_amount = this.formatAsCurrency(payment_amount, 0);
        }
      }.bind(this), 100);
    },
    diamond_weight () {
      this.product_detail.diamond_cost = this.product_detail.diamond_weight * this.product_detail.diamond_weight_price;
    },
    diamondWeightPriceFormatted () {
      this.product_detail.diamond_cost = this.product_detail.diamond_weight * this.product_detail.diamond_weight_price;
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

        this.payment_amount = this.formatAsCurrency(payment_amount, 0);
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

        if (term[0]) {
          this.due_date = moment(this.product_status.sold_date)
            .add(term[0].years, 'years')
            .add(term[0].months, 'months')
            .add(term[0].days, 'days')
            .format('MMMM D, YYYY');
        }
        
      }.bind(this), 100);
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
    show_upload (id) {
      this.dialog.show_upload = true;
    },
    show_delete (id) {
      this.delete_id = id;
      this.dialog.show_delete = true;
    },
    upload_image (id) {
      this.is_image_uploading = true;
      this.add_product_image();
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
    async add_product_image () {
      try {
        this.is_image_uploading = true;
        NProgress.start();
        let config = {
          headers: { 
            'Authorization': this.$store.state.token,
            'Content-Type': 'multipart/form-data'
          }
        };

        let formData = new FormData();
        formData.append('image', this.product_image);

        await Api().post('product/' + this.product.id + '/image', formData, config).then(response => {
          this.is_image_uploading = false;
          this.dialog.show_upload = false;
          this.get_product();
          this.product_image = '';
          this.imageName = '';
          window.getApp.$emit('IMAGE_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.is_image_uploading = false;
        window.getApp.$emit('IMAGE_ADDED_FAIL');
      }
    },
    async delete_image () {
      try {
        NProgress.start();
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('product/' + this.product.id + '/image/' + this.delete_id, config).then(response => {
          this.get_product();
          this.dialog.show_delete = false;
          window.getApp.$emit('IMAGE_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('IMAGE_DELETED_FAIL');
      }
    },
    get_product () {
      NProgress.start();
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

        this.image_count = this.product.product_images.length;
        NProgress.done();
      });
    },
    async update_product () { 
      try {
        NProgress.start();
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
    get_customers () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('customer', config).then(response => {
        this.original_customers = response.data.customers;
        response.data.customers.map((val) => {
          this.customers.push({
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
    this.get_customers();
  },
};
</script>
