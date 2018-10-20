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
                  <span class="headline" v-if="is_edit">Edit Expense</span>
                  <span class="headline" v-else>New Expense</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field v-model="expense.name" label="Name" hint="Name" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-textarea v-model="expense.description" label="Description" hint="Description"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 sm12 lg 12>
                        <v-text-field v-model="expense.amount" label="Amount" value="00.00" prefix="$"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                  <v-btn color="primary" v-if="is_edit" flat @click="edit_expense()">EDIT</v-btn>
                  <v-btn color="primary" v-else flat @click="add_expense()">Add</v-btn>
                </v-card-actions>
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
                :headers="expenses.headers"
                :search="search"
                :items="expenses.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                select-all
                v-model="expenses.selected"
                
                >
                <template slot="items" slot-scope="props">
                <td>
                  <v-checkbox
                    primary
                    hide-details
                    v-model="props.selected"
                  ></v-checkbox>
                </td>              
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.description}}</td>
                  <td>{{ props.item.amount | currency }}</td>
                  <td>
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
                <span class="headline">Delete Expense</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the expense?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_expense()" class="v-btn theme--dark red">
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
      expenses: {
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
            text: 'Amount',
            value: 'amount'
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'center'
          }
        ],
        items: []
      },
      dialog: { 
        show_add: false,
        show_delete: false
      },
      expense: {
        name: '',
        description: '',
        amount: 0
      },
      is_edit: false,
      delete_id: null
    };
  },
  methods: {
    view_delete (id) {
      this.delete_id = id;
      this.dialog.show_delete = true;
    },
    async delete_expense () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('expense/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_users();
          window.getApp.$emit('EXPENSE_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('EXPENSE_DELETED_FAIL');
      }

    },
    view_edit (id) {
      this.show_add = true;
      this.is_edit = true;
      // $$.each(this.expenses.items[id], function(key, value) {
      //   this.expense[key] = value
      // });
    },
    get_expenses () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('expense', config).then(response => {
        this.expenses.items = response.data.expenses;
      });
    },
    async add_expense () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().post('expense', this.expense, config).then(response => {
          this.dialog.show_add = false;
          this.get_expenses();
          window.getApp.$emit('EXPENSE_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('EXPENSE_ADDED_FAIL');
      }
    }
  },
  // eslint-disable-next-line
  created: function () {

    this.get_expenses();
  },
};
</script>