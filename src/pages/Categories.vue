<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap justify-end>
        <v-flex lg2 >
            <v-dialog v-model="dialog.show_add" scrollable @keydown.esc="dialog.show_add = false" persistent max-width="700px">
              <v-btn @click="view_add" color="primary" dark slot="activator">
                <v-icon >add</v-icon>
                add
              </v-btn>
              <v-card>
                <v-form method="post" action="#" id="prodcutForm" v-model="categoryFormValid">
                  <v-card-title>
                    <span class="headline">New Category</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs6 sm6 md6>
                          <v-text-field prepend-icon="layers" v-model="category.name" label="Category Name" hint="Name of the category" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-textarea v-model="category.description" label="Description" hint="Description of the category" clearable
                          ></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm2 md2>
                          <v-text-field type="number" v-model="category.commission_rate" label="Rate" hint="Rate" suffix="%" clearable></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                    <v-btn color="primary" v-if="is_edit" flat @click="edit_user()" :disabled="!categoryFormValid">EDIT</v-btn>
                    <v-btn color="primary" v-else flat @click="add_category()" :disabled="!categoryFormValid">Add</v-btn>
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
                :headers="categories.headers"
                :search="search"
                :items="categories.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                >
                <template slot="items" slot-scope="props">             
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.description }}</td>
                  <td>{{ props.item.commission_rate }}</td>
                  <td class="text-xs-center">
                    <v-btn @click="view_edit(props.item.id)" depressed outline icon fab dark color="green" small>
                      <v-icon>create</v-icon>
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
                <span class="headline">Delete Category</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the category?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_category()" class="v-btn theme--dark red">
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

export default {
  data () {
    return {
      search: '',
      categories: {
        selected: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Description',
            value: 'description'
          },
          {
            text: 'Rate',
            value: 'commission_rate'
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
      category: {
        name: '',
        description: ''
      },
      rules: {
        required: value => !!value || 'Required.',
      },
      categoryFormValid: false,
      delete_id: null,
      isAdmin: false,
      is_edit: false,
      edit_id: null
    };
  },
  methods: {
    view_delete (product_id) {
      this.delete_id = product_id;
      this.dialog.show_delete = true;
    },
    async delete_category () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('category/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_categories();
          window.getApp.$emit('CATEGORY_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('CATEGORY_DELETED_FAIL');
      }

    },  
    view_add (id) {

      this.dialog.show_add = true;
      this.is_edit = false;

      for (let key in this.category) {
        if (this.category.hasOwnProperty(key)) {
          this.category[key] = '';
        }
      }

    },
    view_edit (id) {
      this.dialog.show_add = true;
      this.edit_id = id;
      this.is_edit = true;

      let category = this.categories.items.filter(u => u.id === id);

      for (let key in category[0]) {
        if (category[0].hasOwnProperty(key)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            this.category[key] = category[0][key];
          }
        }
      }
    },
    async edit_user () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('category/' + this.edit_id, this.category, config).then(response => {
          this.dialog.show_add = false;
          this.get_categories();
          window.getApp.$emit('CATEGORY_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('CATEGORY_EDIT_FAIL');
      }
    },
    get_categories () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('category', config).then(response => {
        this.categories.items = response.data.categories;
      });
    },
    async add_category () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().post('category', this.category, config).then(response => {
          this.dialog.show_add = false;
          this.get_categories();
          window.getApp.$emit('CATEGORY_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('CATEGORY_ADDED_FAIL');
      }
    }
  },
  // eslint-disable-next-line
  created: function () {
    this.get_categories();
  },
};
</script>
