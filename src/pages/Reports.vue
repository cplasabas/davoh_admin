<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <div class="display-1 grey--text text--darken-1">Sales</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="display-1 green--text text--darken-1">{{gross_income | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm12 md12 >
                    <v-data-table
                      :headers="sales.headers"
                      :search="search"
                      :items="sales.items"
                      :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                      class="elevation-1"
                      item-key="name"              
                      >
                      <template slot="items" slot-scope="props">         
                        <td>{{ props.item.code }}</td>
                        <td class="text-xs-center">{{ moment(props.item.product_status.sold_date).format('MMMM DD, YYYY')}}</td>
                        <td class="text-xs-right">{{ props.item.product_status.selling_price | currency }}</td>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="display-1 grey--text text--darken-1">Expenses</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="display-1 red--text text--darken-1">{{total_expenses | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm12 md12 >
                    <v-data-table
                      :headers="expenses.headers"
                      :search="search"
                      :items="expenses.items"
                      :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
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
import moment from 'moment';

export default {
  data () {
    return {
      moment: moment,
      search: '',
      sales: {
        selected: [],
        headers: [
          {
            text: 'Code',
            value: 'code',
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
      gross_income: 0,
      net_income: 0
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
            return product;
          }

          return false;
          
        }.bind(this));

        this.sales.items = sales;
      });
    },
    get_expenses () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('expense', config).then(response => {
        this.expenses.items = response.data.expenses;
        
        for (let key in response.data.expenses) {
          if (response.data.expenses.hasOwnProperty(key)) {
            this.total_expenses = this.total_expenses + response.data.expenses[key].amount;
          }
        }

      });
    },
    get_totals () {
      this.net_income = this.gross_income - this.total_expenses;
    }
  },
  // eslint-disable-next-line
  created: function () {

    this.get_products();
    this.get_expenses();
  },
};
</script>
