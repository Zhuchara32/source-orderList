<template>
  <v-card class="px-2 py-2 my-2">
    <v-row>
      <v-col class="col-3">
        <v-img
          height="370"
          :src="arrProducts[idxProd()].photoUrl"
        ></v-img>
      </v-col>
      <v-col class="col-5">
        <v-card-title v-if="!active">
          {{ arrProducts[idxProd()].name }}
        </v-card-title>
        <select class="input" name="product" v-model="productName" v-else-if="active" @change="changeProd($event, id)">
          <option
            :value="prod.name"
            v-for="prod in arrProducts"
            :key="prod.id"
          >{{ prod.name }}</option>
        </select>
        <v-card-text>
          <p>Цена {{ '$' + arrProducts[idxProd()].price }}</p>
          <p v-if="!active">Колличество {{ count }} шт.</p>
          <input class="input" type="text" v-model="newCount" v-else-if="active">
          <p v-if="!active">Сумма {{ '$' + arrProducts[idxProd()].price * count }}</p>
          <p v-else-if="active">Сумма {{ '$' + arrProducts[idxProd()].price * newCount }}</p>
        </v-card-text>
      </v-col>
      <v-col class="col-3">
        <v-card-text>
          Статус заказа: {{ statusChange() }}
        </v-card-text>
        <div v-if="!active">
          <v-btn @click="changeActive(id)">Изменить</v-btn>
        </div>
        <div v-else-if="active">
          <v-btn @click="saveChange()">Сохранить</v-btn>
          <v-btn class="ml-2" @click="parseLocalSt(idOrder)">Отмена</v-btn>
        </div>
        <v-btn class="my-2" @click="confirmDelete(idOrder)">Удалить</v-btn>
        <TheConfirmation v-if="confirm">
          <p>Вы уверены, что хотите удалить заказ?</p>
          <v-btn @click="orderDelete(idOrder)">Да</v-btn>
          <v-btn @click="confirmDelete(idOrder)">Отмена</v-btn>
        </TheConfirmation>
        <TheConfirmation v-if="delivery">
          <div class="app">
            <v-btn icon class="btn" @click="closeMessage(idOrder)">
              <v-icon right>mdi-close-circle</v-icon>
            </v-btn>
            <p>
              Заказ успешно отменен и в скором времени деньги за оплату товара вернуться на Ваш счет,
              но в связи с тем, что у заказа был статус "{{ statusChange() }}"
              мы вынужденны вычесть стоимость доставки. За дополнительной информацией обращайтесь
              в нашу тех поддержку по номеру телефона <a href="tel:+80635555555">+38(063)555-55-55</a>
            </p>
          </div>
        </TheConfirmation>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TheConfirmation from './UI/TheConfirmation.vue'

export default {
  name: 'CardOrders',
  components: {
    TheConfirmation
  },
  data () {
    return {
      statusOrder: {},
      newCount: null,
      productName: null,
      editOrder: { // объект для отправки изменяемого заказа
        id: null,
        newProdId: null,
        statusId: null,
        count: null
      }
    }
  },
  props: [
    'prodId',
    'count',
    'status',
    'active',
    'id',
    'idOrder',
    'confirm',
    'delivery'
  ],
  computed: mapGetters(['arrProducts', 'arrStatus']),
  methods: {
    ...mapActions(['changeActive', 'changeCount', 'changeSave', 'parseLocalSt', 'changeProd', 'orderDelete', 'confirmDelete', 'closeMessage']),
    idxProd () { // добываем индекс продукта
      const idx = this.arrProducts.findIndex(item => item.id === this.prodId)
      return idx
    },
    statusChange () { // добываем статус продукта
      const clone = this.arrStatus.find(item => item.id === this.status)
      this.statusOrder = Object.assign(clone)
      return this.statusOrder.name
    },
    changeProd (e, id) {
      this.$store.dispatch('changeProd', {
        e,
        id
      })
    },
    saveChange () { // собираем данные для изменяемого объекта заказа и сохраняем изменения в заказе
      const newClone = this.arrProducts.find(item => item.name === this.productName)
      const newRightClone = Object.assign(newClone)
      const newProdId = newRightClone.id
      this.editOrder = {
        id: this.idOrder,
        productId: newProdId,
        statusId: this.status,
        count: +this.newCount
      }
      this.changeSave(this.editOrder)
    }
  }
}
</script>

<style>
  .input {
    display: block;
    width: 60%;
    height: calc(2rem + 2px);
    padding: 0.375rem 0.75rem;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fefefe;
    background-clip: padding-box;
    border: 1px solid #bdbdbd;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .app {
    position: relative;
  }
  .btn {
    position: absolute !important;
    right: -5px;
    top: -15px;
  }
</style>
