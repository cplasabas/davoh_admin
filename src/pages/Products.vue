<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
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
                select-all
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
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.description }}</td>
                  <td>{{ props.item.Category.name }}</td>
                  <td>{{ props.item.carat }}</td>
                  <td>{{ props.item.gold }}</td>
                  <td>{{ props.item.diamond }}</td>
                  <td>{{ props.item.Manufacturer.name}}</td>
                  <td>{{ props.item.labor }}</td>
                  <td>{{ props.item.manufacture_cost }}</td>
                  <td>{{ props.item.manufacture_date }}</td>
                  <td>{{ props.item.price }}</td>
                  <td>
                    <v-btn depressed outline icon fab dark color="primary" small>
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn depressed outline icon fab dark color="pink" small>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>  

      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Api from '@/api/api';

export default {
  data () {
    return {
      search: '',
      products: {
        selected: [],
        headers: [
          {
            text: 'Image',
            value: 'image'
          },
          {
            text: 'Name',
            value: 'name'
          },
          {
            text: 'Description',
            value: 'description'
          },
          {
            text: 'Category',
            value: 'category'
          },
          {
            text: 'Carat',
            value: 'carart'
          },
          {
            text: 'Gold',
            value: 'gold'
          },
          {
            text: 'Diamond',
            value: 'diamond'
          },
          {
            text: 'Manufacturer',
            value: 'manufacturer'
          },
          {
            text: 'Labor',
            value: 'labor'
          },
          {
            text: 'Manufacture Cost',
            value: 'manufacture_cost'
          },
          {
            text: 'Manufacture Date',
            value: 'manufacture_date'
          },
          {
            text: 'Price',
            value: 'price'
          },
          {
            text: 'Actions',
            value: 'actions'
          },
        ],
        items: []
      }
    };
  },
  created: function () {
    let config = {
      headers: { 'Authorization': this.$store.state.token }
    };

    Api().get('product', config).then(response => {
      this.products.items = response.data.products;
    });
  }
};
</script>
