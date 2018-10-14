<template>
 <div id="pageTable">
    <v-container grid-list-xl fluid>
    </v-container>
 </div>
</template>

<script>
import Api from '@/api/api';

export default {
  data () {
    return {
      product: {

      }
    };
  },
  methods: {
    get_product () {
      let config = {
        headers: { 'Authorization': this.$store.state.token }
      };

      Api().get('product/' + this.$route.params.product_id, config).then(response => {
        this.product = response.data;
      });
    },
    async update_product () { 

      try {
        let config = {
          headers: { 'Authorization': this.$store.state.token }
        };

        await Api().put('product' + this.$route.params.product_id, this.product, config).then(response => {
          this.get_product();
          window.getApp.$emit('PRODUCT_UPDATE_SUCCESS');
        });
      } catch (error) { 
        window.getApp.$emit('PRODUCT_UPDATE_FAIL');
      }
    }
  },
  // eslint-disable-next-line
  created: function () {
    this.get_product();
  },
};
</script>
