<template>
  <v-container>
    <router-link
      :to="'/'"
      icon tag="button"
      class="my-2">
      <v-icon left>mdi-arrow-left</v-icon>
      вернуться назад
    </router-link>
    <v-row>
      <CardProducts
      v-for="prod in arrProducts"
      :key="prod.id"
      :id="prod.id"
      :name="prod.name"
      :price="prod.price"
      :img="prod.photoUrl"
      />
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CardProducts from '../components/CardProducts.vue'

export default {
  name: 'AddOrder',
  components: {
    CardProducts
  },
  created () {
    this.productFetch()
  },
  computed: mapGetters(['arrProducts']),
  methods: {
    ...mapActions(['productFetch'])
  }
}
</script>
