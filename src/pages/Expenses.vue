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
                <v-form method="post" action="#" id="expenseForm" v-model="expenseFormValid">
                  <v-card-title>
                    <span class="headline" v-if="is_edit">Edit Expense</span>
                    <span class="headline" v-else>New Expense</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs6 sm6 md6>
                          <v-text-field v-model="expense.name" label="Name" hint="Name" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-textarea v-model="expense.description" label="Description" hint="Description" clearable
                          ></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm4 lg4>
                          <v-text-field v-model="amountFormatted" label="Amount" value="00.00" prefix="₱" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4 md4>
                          <v-select
                            label="Type"
                            required
                            v-model="expense.type"
                            :items="type"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm4 lg4>
                          <v-menu
                            class="pr-2"
                            ref="statDate"
                            lazy
                            :close-on-content-click="false"
                            v-model="date_menu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-bottom="-22"
                            max-width="290px"
                            :return-value.sync="expense.date"
                          >
                            <v-text-field
                              slot="activator"
                              label="Date"
                              v-model="expense.date"
                              append-icon="event"
                              readonly
                              :rules="[rules.required]"
                            ></v-text-field>`
                            <v-date-picker v-model="expense.date" no-title scrollable>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="date_menu = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.statDate.save(expense.date)">OK</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-flex>
                        
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                    <v-btn color="primary" v-if="is_edit" flat @click="edit_expense()" :disabled="!expenseFormValid">EDIT</v-btn>
                    <v-btn color="primary" v-else flat @click="add_expense()" :disabled="!expenseFormValid">Add</v-btn>
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
                :headers="expenses.headers"
                :search="search"
                :items="expenses.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                >
                <template slot="items" slot-scope="props">             
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.description}}</td>
                  <td>{{ props.item.amount | currency }}</td>
                  <td>{{ props.item.date | moment("MMMM D, YYYY") }}</td>
                  <td>{{ props.item.type_name }}</td>
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
import store from '@/store/store';
import moment from 'moment';

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
            text: 'Date',
            value: 'date'
          },
          {
            text: 'Type',
            value: 'type_name'
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'center'
          }
        ],
        items: []
      },
      type: [
        {
          text: 'Personal',
          value: 0
        },
        {
          text: 'Davoh PH',
          value: 1
        },
        {
          text: 'Davoh Mumbai',
          value: 2
        },
        {
          text: 'Lotus Pharma',
          value: 3
        }
      ],
      date_menu: false,
      date: null,
      dialog: { 
        show_add: false,
        show_delete: false
      },
      expense: {
        name: '',
        description: '',
        amount: 0,
        type: null,
        date: null
      },
      rules: {
        required: value => !!value || 'Required.',
      },
      expenseFormValid: false,
      is_edit: false,
      delete_id: null,
      edit_id: null,
      isAdmin: false
    };
  },
  computed: {
    amountFormatted: {
      get: function () {
        return this.formatAsCurrency(this.expense.amount, 0);
      },
      set: function (newValue) {
        this.expense.amount = Number(newValue.replace(/[^0-9\.]/g, ''));
      }
    },
  },
  methods: {
    formatAsCurrency (value, dec) {
      dec = dec || 0;

      if (value === null) {
        return 0;
      }
      return value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    },
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
          this.get_expenses();
          window.getApp.$emit('EXPENSE_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('EXPENSE_DELETED_FAIL');
      }

    },
    view_add (id) {

      this.dialog.show_add = true;
      this.is_edit = false;

    },
    view_edit (id) {
      this.dialog.show_add = true;
      this.edit_id = id;
      this.is_edit = true;

      let expense = this.expenses.items.filter(u => u.id === id);

      for (let key in expense[0]) {
        if (expense[0].hasOwnProperty(key)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            let value = expense[0][key]; 

            if (key === 'date') {
              value = moment(value).format('MMMM D, YYYY');
            }

            this.expense[key] = value;
          }
        }
      }

      this.date = moment(expense.date).format('YYYY-MM-DD');
    },
    async edit_expense () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('expense/' + this.edit_id, this.expense, config).then(response => {
          this.dialog.show_add = false;
          this.get_expenses();
          window.getApp.$emit('EXPENSE_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('EXPENSE_EDIT_FAIL');
      }
    },
    get_expenses () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('expense', config).then(response => {
        for (let key in response.data.expenses) {
          if (response.data.expenses.hasOwnProperty(key)) {
            if (response.data.expenses[key].type === 0) {
              response.data.expenses[key].type_name = 'Personal';
            } else if (response.data.expenses[key].type === 1) {
              response.data.expenses[key].type_name = 'Davoh PH';
            } else if (response.data.expenses[key].type === 2) {
              response.data.expenses[key].type_name = 'Davoh Mumbai';
            } else if (response.data.expenses[key].type === 3) {
              response.data.expenses[key].type_name = 'Lotus Pharma';
            }
          }
        }
        let expenses = response.data.expenses;

        if (!this.isAdmin) {
          expenses = response.data.expenses.filter(function (expense) {
            return expense.type === 1;
          });  
        }
        
        this.expenses.items = expenses;
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
    if (store.state.user.level === 0) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.get_expenses();
  },
};
</script>
