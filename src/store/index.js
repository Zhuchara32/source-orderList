import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    urlOrders: 'https://webtest.it.ua/testApp/api/orders', // ссылка заказов
    arrOrders: [], // массив заказов
    urlProducts: 'https://webtest.it.ua/testApp/api/products', // ссылка продуктов
    arrProducts: [], // массив продуктов
    urlStatus: 'https://webtest.it.ua/testApp/api/statuses', // ссылка статусов
    arrStatus: [], // массив статусов
    changeObj: {}, // изменяемый объект
    urlUpdate: 'https://webtest.it.ua/testApp/api/orders/update', // ссылка изменения
    urlAdd: 'https://webtest.it.ua/testApp/api/orders/add', // ссылка добавления заказа
    urlDelete: 'https://webtest.it.ua/testApp/api/orders/delete/' // ссылка удаления заказа
  },
  getters: {
    arrOrders (state) {
      return state.arrOrders
    },
    arrProducts (state) {
      return state.arrProducts
    },
    arrStatus (state) {
      return state.arrStatus
    }
  },
  mutations: {
    ordersFetch (state, data) {
      state.arrOrders = data
    },
    statusFetch (state, data) {
      state.arrStatus = data
    },
    addProp (state) {
      for (let i = 0; i < state.arrOrders.length; i++) {
        state.arrOrders[i].active = false // проперти для возможности активизации режима редактирования заказа
        state.arrOrders[i].confirm = false // проперти для возможности активизации диалогового окна подтверждения удаления заказа
        state.arrOrders[i].delivery = false // проперти для возможности активизации диалогового окна предупреждения
      }
    },
    productFetch (state, data) {
      state.arrProducts = data
    },
    changeActive (state, id) {
      const clone = state.arrOrders.find((item, idx) => idx === id)
      const rightClone = Object.assign(clone)
      rightClone.active = !rightClone.active
      state.arrOrders.splice(id, 1, rightClone)
    },
    changeSave (state, result) {
      const cloneIdx = state.arrOrders.findIndex(item => item.id === result.id)
      state.arrOrders.splice(cloneIdx, 1, result)
    },
    saveLocalSt (state) {
      const parsed = JSON.stringify(state.arrOrders)
      localStorage.setItem('arrOrders', parsed)
    },
    parseLocalSt (state, id) {
      if (localStorage.getItem('arrOrders')) {
        try {
          const arrClone = JSON.parse(localStorage.getItem('arrOrders'))
          const clone = arrClone.find(item => item.id === id)
          const cloneIdx = state.arrOrders.findIndex(item => item.id === id)
          const rightClone = Object.assign(clone)
          state.arrOrders.splice(cloneIdx, 1, rightClone)
        } catch (e) {
          localStorage.removeItem('arrOrders')
        }
      }
    },
    changeProd (state, { e, id }) {
      const clone = state.arrProducts.find(item => item.name === e.target.value)
      const rightClone = Object.assign(clone)
      const cloneOrder = state.arrOrders.find((item, idx) => idx === id)
      cloneOrder.productId = rightClone.id
    },
    orderNewAdd (state, result) {
      state.arrOrders.unshift(result)
    },
    orderDelete (state, { result, id }) {
      if (result.statusId === 5 || result.statusId === 6) {
        const clone = state.arrOrders.find(item => item.id === id)
        clone.confirm = !clone.confirm
        clone.delivery = !clone.delivery
      } else {
        const findIdx = state.arrOrders.findIndex(item => item.id === id)
        state.arrOrders.splice(findIdx, 1)
      }
    },
    confirmDelete (state, id) {
      const cloneObj = state.arrOrders.find(item => item.id === id)
      const cloneIdx = state.arrOrders.findIndex(item => item.id === id)
      cloneObj.confirm = !cloneObj.confirm
      const rightClone = JSON.parse(JSON.stringify(cloneObj))
      state.arrOrders.splice(cloneIdx, 1, rightClone)
    },
    closeMessage (state, id) {
      const findIdx = state.arrOrders.findIndex(item => item.id === id)
      state.arrOrders.splice(findIdx, 1)
    }
  },
  actions: {
    async ordersFetch ({ commit, dispatch, state }) { // делаем запрос зазазов, попутно делая еще запрос продуктов + запрос статусов
      await dispatch('statusFetch')
      await dispatch('productFetch')
      const res = await fetch(state.urlOrders)
      const data = await res.json()
      commit('ordersFetch', data)
      await dispatch('addProp')
      dispatch('saveLocalSt')
    },
    async statusFetch ({ commit, state }) { // делаем запрос статусов
      const res = await fetch(state.urlStatus)
      const data = await res.json()
      commit('statusFetch', data)
    },
    async productFetch ({ commit, state }) { // делаем запрос продуктов
      const res = await fetch(state.urlProducts)
      const data = await res.json()
      commit('productFetch', data)
    },
    addProp (ctx) { // добавляем проперти в массив заказов, для возможности вызова диалоговых окон
      ctx.commit('addProp')
    },
    saveLocalSt (ctx) { // сохраняем в localStorage
      ctx.commit('saveLocalSt')
    },
    parseLocalSt (ctx, id) { // парсим localStorage
      ctx.commit('parseLocalSt', id)
    },
    changeActive (ctx, id) { // изменяем активность active проперти, для возможности редактирования заказа
      ctx.commit('changeActive', id)
    },
    changeProd (ctx, { e, id }) { // при изменение выбора продукта в заказе, изменяем данные продукта
      ctx.commit('changeProd', { e, id })
    },
    async changeSave ({ commit, state }, obj) { // сохраняем изменения в заказе
      const res = await fetch(state.urlUpdate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charser=utf-8' },
        body: JSON.stringify(obj)
      })
      const result = await res.json()
      commit('changeSave', result)
    },
    async orderNewAdd ({ commit, state }, obj) { // добавляем новый заказ
      const res = await fetch(state.urlAdd, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charser=utf-8' },
        body: JSON.stringify(obj)
      })
      const result = await res.json()
      commit('orderNewAdd', result)
    },
    async orderDelete ({ commit, state }, id) { // удаляем заказ
      const res = await fetch(state.urlDelete + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charser=utf-8' }
      })
      const result = await res.json()
      commit('orderDelete', { result, id })
    },
    confirmDelete (ctx, id) { // активируем проперти confirm, тем самым вызывая диалоговое окно подтверждения удаления заказа
      ctx.commit('confirmDelete', id)
    },
    closeMessage (ctx, id) { // снимаем активность проперти confirm, тем самым отменяем удаление
      ctx.commit('closeMessage', id)
    }
  },
  modules: {
  }
})
