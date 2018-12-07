<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-flex xs12 sm12 md12>
            <v-form method="post" action="#" id="prodcutForm" v-model="filterFormValid">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm2 lg2>
                    <v-menu
                      class="pr-2"
                      ref="startDate"
                      lazy
                      :close-on-content-click="false"
                      v-model="start_date_menu"
                      transition="scale-transition"
                      offset-y
                      full-width
                      :nudge-bottom="-22"
                      max-width="290px"
                      :return-value.sync="start_date"
                    >
                      <v-text-field
                        slot="activator"
                        label="Start Date"
                        v-model="start_date"
                        append-icon="event"
                        readonly
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-date-picker v-model="start_date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="start_date_menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.startDate.save(start_date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm2 lg2>
                    <v-menu
                      class="pr-2"
                      ref="endDate"
                      lazy
                      :close-on-content-click="false"
                      v-model="end_date_menu"
                      transition="scale-transition"
                      offset-y
                      full-width
                      :nudge-bottom="-22"
                      max-width="290px"
                      :return-value.sync="end_date"
                    >
                      <v-text-field
                        slot="activator"
                        label="End Date"
                        v-model="end_date"
                        append-icon="event"
                        readonly
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-date-picker v-model="end_date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="end_date_menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.endDate.save(end_date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm3 md3 lg3>
                    <v-btn color="primary" flat @click="filter_report()" :disabled="!filterFormValid">Filter</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-flex>
          <v-card>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <div class="headline grey--text text--darken-1">Sales</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="headline green--text text--darken-1">{{gross_income | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm12 md12 >
                    <v-data-table
                      :headers="sales.headers"
                      :search="search"
                      :items="sales.items"
                      :rows-per-page-items="[5]"
                      class="elevation-1"
                      item-key="name"              
                      >
                      <template slot="items" slot-scope="props">         
                        <td>{{ props.item.code }}</td>
                        <td class="text-xs-center">{{ props.item.product_status.seller}}</td>
                        <td class="text-xs-center">{{ props.item.product_status.commission | currency }}</td>
                        <td class="text-xs-center">{{ moment(props.item.product_status.sold_date).format('MMMM DD, YYYY')}}</td>
                        <td class="text-xs-right">{{ props.item.product_status.selling_price | currency }}</td>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="headline grey--text text--darken-1">Expenses</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="headline red--text text--darken-1">{{total_expenses | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm12 md12 >
                    <v-data-table
                      :headers="expenses.headers"
                      :search="search"
                      :items="expenses.items"
                      :rows-per-page-items="[5]"
                      class="elevation-1"
                      item-key="name"              
                      >
                      <template slot="items" slot-scope="props">         
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-center">{{ moment(props.item.date).format('MMMM DD, YYYY')}}</td>
                        <td class="text-xs-right">{{ props.item.amount | currency }}</td>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="display-1 grey--text text--darken-1">Gross Income</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="display-1 grey--text text--darken-1">{{gross_income | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="display-1 grey--text text--darken-1">Expenses</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="display-1 red--text text--darken-1">- {{total_expenses | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="display-1 grey--text text--darken-1">Commission</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="display-1 red--text text--darken-1">- {{total_commission | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="display-1 grey--text text--darken-1">Net Income</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="display-1 green--text text--darken-1">{{net_income | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
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

export default {
  data () {
    return {
      moment: moment,
      search: '',
      original_sales: [],
      original_expenses: [],
      sales: {
        selected: [],
        headers: [
          {
            text: 'Code',
            value: 'code',
          },
          {
            text: 'Client',
            value: 'client',
            align: 'center'
          },
          {
            text: 'Commission',
            value: 'commission',
            align: 'center'
          },
          {
            text: 'Date',
            value: 'date',
            align: 'center'
          },
          {
            text: 'Amount',
            value: 'amount',
            align: 'right'
          }
        ],
        items: []
      },
      expenses: {
        selected: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Date',
            value: 'date',
            align: 'center'
          },
          {
            text: 'Amount',
            value: 'amount',
            align: 'right'
          }
        ],
        items: []
      },
      total_expenses: 0,
      total_commission: 0,
      gross_income: 0,
      net_income: 0,
      start_date: null,
      start_date_menu: false,
      end_date: null,
      end_date_menu: false,
      filterFormValid: false,
      isAdmin: false,
      rules: {
        required: value => !!value || 'Required.',
      }
    };
  },
  watch: {
    gross_income () {
      this.get_totals();
    },
    total_expenses () {
      this.get_totals();
    }
  },
  methods: {
    get_products () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('product', config).then(response => {
        let sales = response.data.products.filter(function (product) {
          if (product.product_status.status === 'Sold') {
           
            this.gross_income = this.gross_income + product.product_status.selling_price;
            this.total_commission = this.total_commission + product.product_status.commission;
            return product;
          }

          return false;
          
        }.bind(this));

        this.sales.items = sales;
        this.original_sales = sales;
      });
    },
    get_expenses () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('expense', config).then(response => {
        let expenses = response.data.expenses;

        if (!this.isAdmin) {
          expenses = response.data.expenses.filter(function (expense) {
            return expense.type === 1;
          });  
        }

        this.expenses.items = expenses;
        this.original_expenses = expenses;

        

        for (let key in expenses) {
          if (expenses.hasOwnProperty(key)) {
            this.total_expenses = this.total_expenses + expenses[key].amount;
          }
        }

      });
    },
    get_totals () {
      this.net_income = this.gross_income - (this.total_expenses + this.total_commission);
    },
    filter_report () {
      this.gross_income = 0;
      this.total_commission = 0;
      this.total_expenses = 0;

      this.sales.items = this.original_sales.filter(function (sale) {
        let date = moment(sale.product_status.sold_date);

        if (date.isBetween(this.start_date, this.end_date) || date.isSame(this.start_date) || date.isSame(this.end_date)) {
          this.gross_income = this.gross_income + sale.product_status.selling_price;
          this.total_commission = this.total_commission + sale.product_status.commission;
          return sale;
        }
        return false;
      }.bind(this));

      this.expenses.items = this.original_expenses.filter(function (expense) {
   
        let date = moment(expense.date);

        if (date.isBetween(this.start_date, this.end_date) || date.isSame(this.start_date) || date.isSame(this.end_date)) {
          this.total_expenses = this.total_expenses + expense.amount;
          return expense;
        }
        return false;
      }.bind(this));
    }
  },
  // eslint-disable-next-line
  created: function () {
    if (store.state.user.level === 0) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.get_products();
    this.get_expenses();
  },
};
</script>
