<template>
  <v-container>
    <router-link
      :to="'/add-order'"
      tag="button"
      class="elevation-2 px-4 py-2 green white--text text-uppercase"
    >
      add order
    </router-link>
    <v-col>
      <CardOrders
        v-for="(order, idx) in arrOrders"
        :key="generateKey(idx, order.active)"
        :id="idx"
        :idOrder="order.id"
        :prodId="order.productId"
        :count="order.count"
        :status="order.statusId"
        :active="order.active"
        :confirm="order.confirm"
        :delivery="order.delivery"
      />
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CardOrders from '../components/CardOrders.vue'

export default {
  name: 'Home',
  components: {
    CardOrders
  },
  mounted () {
    if (this.arrOrders.length < 1) {
      this.ordersFetch()
    }
  },
  computed: mapGetters(['arrOrders']),
  methods: {
    ...mapActions(['ordersFetch', 'productFetch', 'allFetch']),
    generateKey (id, active) { // генератор ключа для переотрисовки  списка
      const key = `${id} - ${toString(active)}`
      return key
    }
  }
}
</script>
