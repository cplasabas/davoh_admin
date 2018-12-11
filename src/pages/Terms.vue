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
                <v-form method="post" action="#" id="termForm" v-model="termFormValid">
                  <v-card-title>
                    <span class="headline" v-if="is_edit">Edit Term</span>
                    <span class="headline" v-else>New Term</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs4 sm4 md4>
                          <v-text-field prepend-icon="account_balance" v-model="term.name" label="Name" hint="Name" :rules="[rules.required]" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs3 sm3 lg3 offset-xs-1 offset-sm1 offset-xs1>
                          <v-text-field prepend-icon="calendar_today" type="number" v-model="term.days" label="Days" value="0"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm2 md2 offset-xs-1 offset-sm1 offset-xs1>
                          <v-text-field type="number" v-model="term.interest" label="Interest" hint="Interest" suffix="%" readonly></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-textarea v-model="term.description" label="Description" hint="Description" clearable
                          ></v-textarea>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog.show_add = false">Close</v-btn>
                    <v-btn color="primary" v-if="is_edit" flat @click="edit_term()" :disabled="!termFormValid">EDIT</v-btn>
                    <v-btn color="primary" v-else flat @click="add_term()" :disabled="!termFormValid">Add</v-btn>
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
                :headers="terms.headers"
                :search="search"
                :items="terms.items"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="name"
                >
                <template slot="items" slot-scope="props">       
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.description}}</td>
                  <td>{{ props.item.days }}</td>
                  <td>{{ props.item.interest }}</td>
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
                <span class="headline">Delete Term</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <p>Are you sure you want to delete the term?</p>
                </v-container>
                <div class="text-xs-center">
                  <div class="v-dialog__container" inset="true" style="display: inline-block;">
                    <div class="v-dialog__activator">
                      <button type="button" @click="delete_term()" class="v-btn theme--dark red">
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
      terms: {
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
            text: 'Days',
            value: 'days'
          },
          {
            text: 'Interest (%)',
            value: 'interest'
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
      term: {
        name: '',
        description: '',
        interest: 0,
        days: 0
      },
      rules: {
        required: value => !!value || 'Required.',
      },
      termFormValid: false,
      is_edit: false,
      delete_id: null,
      edit_id: null
    };
  },
  computed: {
    days () {
      return this.term.days;
    }
  },
  watch: {
    days () {
      this.compute_interest();
    }
  },
  methods: {
    compute_interest () {
      let amount = this.term.days / 30;

      this.term.interest = (amount * 5).toFixed(2);
    },
    view_delete (id) {
      this.delete_id = id;
      this.dialog.show_delete = true;
    },
    async delete_term () {

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().delete('term/' + this.delete_id, config).then(response => {
          this.dialog.show_delete = false;
          this.get_terms();
          window.getApp.$emit('TERM_DELETED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_delete = false;
        window.getApp.$emit('TERM_DELETED_FAIL');
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

      let term = this.terms.items.filter(u => u.id === id);

      for (let key in term[0]) {
        if (term[0].hasOwnProperty(key)) {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            this.term[key] = term[0][key];
          }
        }
      }
    },
    async edit_term () {
      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('term/' + this.edit_id, this.term, config).then(response => {
          this.dialog.show_add = false;
          this.get_terms();
          window.getApp.$emit('TERM_EDIT_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('TERM_EDIT_FAIL');
      }
    },
    get_terms () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('term', config).then(response => {
        this.terms.items = response.data.terms;
      });
    },
    async add_term () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().post('term', this.term, config).then(response => {
          this.dialog.show_add = false;
          this.get_terms();
          window.getApp.$emit('TERM_ADDED_SUCCESS');
        });
      } catch (error) { 
        this.dialog.show_add = false;
        window.getApp.$emit('TERM_ADDED_FAIL');
      }
    }
  },
  // eslint-disable-next-line
  created: function () {

    this.get_terms();
  },
};
</script>
