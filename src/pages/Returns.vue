<template>
  <div id="page-icons">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex 12>
          <v-tabs v-model="selectedTab" color="grey lighten-3">
            <v-tab ripple href="#tab-1">
              Purchase Returns
            </v-tab>
            <v-tab ripple href="#tab-2">
              Sales Returns
            </v-tab>
            <v-tabs-items v-model="selectedTab">
              <v-tab-item id="tab-1">
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
                  <v-card-text>
                    <v-data-table
                      :headers="purchase_returns.headers"
                      :search="search"
                      :items="purchase_returns.items" 
                      :rows-per-page-items="[5]"
                      class="elevation-1"
                      item-key="name"             
                      :disable-page-reset="true"
                      >
                      <template slot="items" slot-scope="props">         
                        <td>{{ props.item.product_code }}</td>
                        <td>{{ props.item.supplier_name}}</td>
                        <td>{{moment(props.item.return_date).format('MMMM DD, YYYY')}}</td>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item id="tab-2">
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
                  <v-card-text>
                    <v-data-table
                      :headers="sales_returns.headers"
                      :search="search"
                      :items="sales_returns.items" 
                      :rows-per-page-items="[5]"
                      class="elevation-1"
                      item-key="name"             
                      :disable-page-reset="true"
                      >
                      <template slot="items" slot-scope="props">         
                        <td>{{ props.item.product_code }}</td>
                        <td>{{ props.item.client_name}}</td>
                        <td>{{moment(props.item.return_date).format('MMMM DD, YYYY')}}</td>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-tab-item>              
            </v-tabs-items>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Api from '@/api/api';
import store from '@/store/store';
import NProgress from 'nprogress';
import moment from 'moment';

export default {
  data () {
    return {
      search: '',
      moment: moment,
      selectedTab: null,
      purchase_returns: {
        headers: [
          {
            text: 'Product Code',
            value: 'product_code',
          },
          {
            text: 'Supplier Name',
            value: 'supplier_name'
          },
          {
            text: 'Return Date',
            value: 'return_date'
          }
        ],
        items: []
      },
      sales_returns: {
        headers: [
          {
            text: 'Product Code',
            value: 'product_code',
          },
          {
            text: 'Client Name',
            value: 'client_name'
          },
          {
            text: 'Return Date',
            value: 'return_date'
          }
        ],
        items: []
      },
    };
  },
  computed: {

  },  
  created () {
    this.get_purchase_returns();
    this.get_sales_returns();
  },
  methods: {
    get_purchase_returns () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('purchase_returns', config).then(response => {
        this.purchase_returns.items = response.data.purchase_returns;
      });
    },
    get_sales_returns () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('sales_returns', config).then(response => {
        this.sales_returns.items = response.data.sales_returns;
      });
    },
  }
};
</script>