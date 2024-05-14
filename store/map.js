// import Vue from 'vue'
import Vuex from 'vuex'
// Vue.use(Vuex)

const mapStore = new Vuex.Store({
	state: {
		// uerInfo: {},  
		// hasLogin: false  ,
		
		layers:[]
	},
	getter: {
		
		computedLayers(){
			return this.$mapStore.state.layers
		}
	},
	mutations: {
		
		addLayer(state, lyr){
			state.layers.push(lyr)
			console.log("debug-mapstore layers ", state.layers)
		},
		removeLayerByInd(state,i){
			state.layers = state.layers.slice(0,i).concat(state.layers.slice(i))
		}
	}
})

export default mapStore;