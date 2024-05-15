// import {} from "./vueStores"
import { getLocalStore } from '../localStores'
import Vue from "vue"

const mixin = Vue.extend({
	
	name:"VueStoreMixinComponent",
	components:{},
	methods:{
		
		$mixSaveAll(){
			
			// this.$store.saveToLSTO()
			// this.$mapStore.saveToLSTO()
			this.$store.dispatch("saveToLSTO")
		},
		
		$mixClearAll(){
			
			// this.$store.clearLSTO()
			// this.$mapStore.clearLSTO()
			this.$store.dispatch("clearLSTO")
		}
		
	},
	
	mounted(){
		// console.log('debug-VueStoreMixinComponent mounted')
	},
	
	beforeDestroy(){
		// console.log('debug-app App Hide')
		// getLocalStore("global").saveItem("app", {"exit":true})
		this.$mixSaveAll()
	}
})


export default mixin