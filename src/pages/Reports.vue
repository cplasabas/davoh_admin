<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg4>
          <div class="headline grey--text text--darken-1 filter_text">Filter Date:</div>
          <v-menu full-width offset-y :close-on-content-click="false" v-model="dateMenu" bottom>
            <v-btn color="primary" outline slot="activator">{{ range[0] }} &mdash; {{ range[1] }}</v-btn>
            <v-card>
              <v-card-text>
                <v-daterange :options="dateRangeOptions" :no-presets="true" @input="onDateRangeChange" />
              </v-card-text>
            </v-card>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex lg12 v-if="$store.state.user.level === 0">
          <v-tabs v-model="selectedTab" color="grey lighten-3">
            <v-tab ripple href="#tab-1">
              Personal Report
            </v-tab>
            <v-tab ripple href="#tab-2">
              General Report
            </v-tab>
            <v-tabs-items v-model="selectedTab">
              <v-tab-item id="tab-1">
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
                            :headers="sales.personal_headers"
                            :search="sales_search"
                            :items="sales.items"
                            :rows-per-page-items="[5]"
                            class="elevation-1"
                            item-key="name"              
                            >
                            <template slot="items" slot-scope="props">         
                              <td>{{ props.item.code }}</td>
                              <td class="text-xs-center">{{ props.item.product_detail.labor | currency }}</td>
                              <td class="text-xs-center">{{ props.item.product_detail.manufacture_cost | currency }}</td>
                              <td class="text-xs-center">{{ props.item.product_status.seller}}</td>
                              <td class="text-xs-center">{{ moment(props.item.product_status.sold_date).format('MMMM DD, YYYY')}}</td>
                              <td class="text-xs-center">{{ props.item.product_status.commission | currency }}</td>
                              <td class="text-xs-right">{{ props.item.product_status.selling_price | currency }}</td>
                            </template>
                          </v-data-table>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="headline grey--text text--darken-1">Expenses</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="headline red--text text--darken-1">{{total_expenses_personal | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs12 sm12 md12 >
                          <v-data-table
                            :headers="expenses.headers"
                            :search="expense_search"
                            :items="expenses.items"
                            :rows-per-page-items="[5]"
                            class="elevation-1"
                            item-key="name"              
                            >
                            <template slot="items" slot-scope="props">         
                              <td>{{ props.item.name }}</td>
                              <td>{{ props.item.type_text }}</td>
                              <td class="text-xs-center">{{ moment(props.item.date).format('MMMM DD, YYYY')}}</td>
                              <td class="text-xs-right">{{ props.item.amount | currency }}</td>
                            </template>
                          </v-data-table>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Gross Income</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title grey--text text--darken-1">{{gross_income | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Expenses</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title red--text text--darken-1">- {{total_expenses_personal | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Manufacturing Cost</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title red--text text--darken-1">- {{total_manufacturing | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Labor</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title red--text text--darken-1">- {{total_labor | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Commission</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title red--text text--darken-1">- {{total_commission | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Net Income</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title green--text text--darken-1">{{net_income_personal | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item id="tab-2">
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
                            :headers="sales.general_headers"
                            :search="sales_search"
                            :items="sales.items"
                            :rows-per-page-items="[5]"
                            class="elevation-1"
                            item-key="name"              
                            >
                            <template slot="items" slot-scope="props">         
                              <td>{{ props.item.code }}</td>
                              <td class="text-xs-center">{{ props.item.product_status.seller}}</td>
                              <td class="text-xs-center">{{ moment(props.item.product_status.sold_date).format('MMMM DD, YYYY')}}</td>
                              <td class="text-xs-center">{{ props.item.product_status.commission | currency }}</td>
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
                            :search="expense_search"
                            :items="general_expenses"
                            :rows-per-page-items="[5]"
                            class="elevation-1"
                            item-key="name"              
                            >
                            <template slot="items" slot-scope="props">         
                              <td>{{ props.item.name }}</td>
                              <td>{{ props.item.type_text }}</td>
                              <td class="text-xs-center">{{ moment(props.item.date).format('MMMM DD, YYYY')}}</td>
                              <td class="text-xs-right">{{ props.item.amount | currency }}</td>
                            </template>
                          </v-data-table>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Gross Income</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title grey--text text--darken-1">{{gross_income | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Expenses</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title red--text text--darken-1">- {{total_expenses | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Commission</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title red--text text--darken-1">- {{total_commission | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                          <div class="title grey--text text--darken-1">Net Income</div>
                          <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs6 sm6 md6 class="text-xs-right">
                          <div class="title green--text text--darken-1">{{net_income | currency}}</div>
                          <v-divider></v-divider>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-tab-item>              
            </v-tabs-items>
          </v-tabs>
        </v-flex>  
        <v-flex lg12 v-else>
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
                      :headers="sales.general_headers"
                      :search="sales_search"
                      :items="sales.items"
                      :rows-per-page-items="[5]"
                      class="elevation-1"
                      item-key="name"              
                      >
                      <template slot="items" slot-scope="props">         
                        <td>{{ props.item.code }}</td>
                        <td class="text-xs-center">{{ props.item.product_status.seller}}</td>
                        <td class="text-xs-center">{{ moment(props.item.product_status.sold_date).format('MMMM DD, YYYY')}}</td>
                        <td class="text-xs-center">{{ props.item.product_status.commission | currency }}</td>
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
                      :search="expense_search"
                      :items="general_expenses"
                      :rows-per-page-items="[5]"
                      class="elevation-1"
                      item-key="name"              
                      >
                      <template slot="items" slot-scope="props">         
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.type_text }}</td>
                        <td class="text-xs-center">{{ moment(props.item.date).format('MMMM DD, YYYY')}}</td>
                        <td class="text-xs-right">{{ props.item.amount | currency }}</td>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="title grey--text text--darken-1">Gross Income</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="title grey--text text--darken-1">{{gross_income | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="title grey--text text--darken-1">Expenses</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="title red--text text--darken-1">- {{total_expenses | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="title grey--text text--darken-1">Commission</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="title red--text text--darken-1">- {{total_commission | currency}}</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <div class="title grey--text text--darken-1">Net Income</div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 sm6 md6 class="text-xs-right">
                    <div class="title green--text text--darken-1">{{net_income | currency}}</div>
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
      selectedTab: null,
      sales_search: '',
      expense_search: '',
      sales: {
        personal_headers: [
          {
            text: 'Code',
            value: 'code',
          },
          {
            text: 'Labor',
            value: 'product_detail.labor',
          },
          {
            text: 'Manufacturing Cost',
            value: 'product_detail.manufacture_cost',
          },
          {
            text: 'Client',
            value: 'client',
            align: 'center'
          },
          {
            text: 'Sold Date',
            value: 'date',
            align: 'center'
          },
          {
            text: 'Commission',
            value: 'commission',
            align: 'center'
          },
          {
            text: 'Amount',
            value: 'amount',
            align: 'right'
          },
        ],
        general_headers: [
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
            text: 'Sold Date',
            value: 'date',
            align: 'center'
          },
          {
            text: 'Commission',
            value: 'commission',
            align: 'center'
          },
          {
            text: 'Amount',
            value: 'amount',
            align: 'right'
          },
        ],
        items: []
      },
      expenses: {
        headers: [
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Type',
            value: 'type_text',
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
      dateMenu: false,
      range: [
        moment().startOf('month').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ],
      dateRangeOptions: {
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        format: 'YYYY-MM-DD'
      }
    };
  },
  computed: {
    gross_income: function () {
      return this.sales.items.reduce((a, b) => a + b.product_status.selling_price, 0);
    },
    total_expenses_personal: function () {
      return this.expenses.items.reduce((a, b) => a + b.amount, 0);
    },
    total_commission: function () {
      return this.sales.items.reduce((a, b) => a + b.product_status.commission, 0);
    },
    total_manufacturing: function () {
      return this.sales.items.reduce((a, b) => a + b.product_detail.manufacture_cost, 0);
    },
    total_labor: function () {
      return this.sales.items.reduce((a, b) => a + b.product_detail.labor, 0);
    },
    net_income_personal: function () {
      return this.gross_income - (this.total_expenses_personal + this.total_commission + this.total_manufacturing + this.total_labor);
    },
    total_expenses: function () {
      return this.expenses.items.reduce((a, b) => {
        if (b.type !== 0) {
          return a + b.amount;
        }

        return a + 0;
      }, 0);
    },
    net_income: function () {
      return this.gross_income - (this.total_expenses + this.total_commission);
    },
    general_expenses: function () {
      return this.expenses.items.filter(expense => expense.type !== 0);
    }
  },
  created: function () {
    this.get_sales();
  },
  methods: {
    onDateRangeChange (range) {
      this.range = range;
      this.get_sales();
    },
    get_sales () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get(`sales?start_date=${this.range[0]}&end_date=${this.range[1]}`, config).then(response => {
        this.sales.items = response.data.sales;

        this.get_expenses();
      });
    },
    get_expenses () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get(`expense?start_date=${this.range[0]}&end_date=${this.range[1]}`, config).then(response => {
        this.expenses.items = response.data.expenses;

        this.expenses.items.map(expense => {
          
          if (expense.type === 0) {
            expense.type_text = 'Personal';
          }

          if (expense.type === 1) {
            expense.type_text = 'Davoh PH';
          }

          if (expense.type === 2) {
            expense.type_text = 'Davoh Mumbai';
          }

          if (expense.type === 3) {
            expense.type_text = 'Lotus Pharma';
          }

          return expense;
        });
      });
    }
  }

};
</script>

<style scoped lang="css">
.filter_text {
  float: left;
  margin-top: 0.5rem;
}
</style>