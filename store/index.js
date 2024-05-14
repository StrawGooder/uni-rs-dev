// import Vue from 'vue'
// import Vuex from 'vuex'
// Vue.use(Vuex)
import Vue from "vue"
import "./useStore.js";

import store from "./user.js";
import mapStore from "./map.js";

function setupStorePlugin(app){
	
	app.use(store)
	app.use(mapStore)
	
}

Vue.prototype.$store = store
Vue.prototype.$mapStore = mapStore


export {setupStorePlugin}
// Vue.use(store)
// Vue.use(mapStore)

// export default store 

// export {
// 	mapStore
// }

// const store = new Vuex.Store({
// 	state: {
// 		uerInfo: {},  
// 		hasLogin: false  
// 	},
// 	getter: {
// 	},
// 	mutations: {
// 		login(state, provider) {//改变登录状态  
		
// 			state.hasLogin = true  
// 			state.uerInfo.token = provider.token  
// 			state.uerInfo.userName = provider.user_name
// 			uni.setStorage({//将用户信息保存在本地  
// 				key: 'uerInfo',  
// 				data: provider  
// 			})  
// 		},  
// 		logout(state) {//退出登录  
// 			state.hasLogin = false  
// 			state.uerInfo = {}  
// 			// uni.removeStorage({  
// 			// 	key: 'uerInfo'  
// 			// })  
// 		}  
// 	}
// })

// export default store;