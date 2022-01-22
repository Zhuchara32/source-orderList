<template>
  <v-card class="px-2 py-2 mx-2 my-2">
    <v-img
      height="350"
      width="250"
      :src="img"
      :alt="name"
    ></v-img>
    <v-card-title>
      {{ name }}
    </v-card-title>
    <v-card-text>
      {{ '$' + price }}
    </v-card-text>
    <input class="input" type="text" v-model="count">
    <v-card-text>Сумма заказа: ${{ count * price }}</v-card-text>
    <v-btn color="success" @click="addNewOrder()">
      заказать
    </v-btn>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CardOrders',
  data () {
    return {
      count: null,
      newOrder: { // объект для отправки запроса на добавление нового заказа
        productId: null,
        count: null
      }
    }
  },
  props: [
    'id',
    'name',
    'price',
    'img'
  ],
  methods: {
    ...mapActions(['orderNewAdd']),
    async addNewOrder () { // добавляем новый заказ, предварительно собрав объект, для запроса
      this.newOrder = {
        productId: this.id,
        count: +this.count
      }
      await this.orderNewAdd(this.newOrder)
      this.$router.push({ path: '/' })
    }
  }
}
</script>
