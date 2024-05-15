// import Vue from 'vue'
// import Vuex from 'vuex'
import { getLocalStore } from '../localStores';
// import {merge as mergeObject } from "lodash"


function findLayerById(state,i){
		
		// var x;
		// var layers = state.layers
		// for(var lind in layers)
		// {
		// 	x = layers[lind]
		// 	if(x["seqid"]==i)
		// 	{
		// 		return x
		// 	}
		// }
		// return 
		return state.layers.filter((x)=>{console.log("debug-mapstore ", i, x); return x["seqid"]==i})[0]
		
		
}
	
const mapStore = {
	
	state: {
		// uerInfo: {},  
		// hasLogin: false  ,
		
		// layers:[],
		layers: getLocalStore("map").loadItem("layers") || [],
		
		// temp for store bucket
		name:"map"
	
	},
	getter: {
		
		computedLayers(){
			return this.$mapStore.state.layers
		},
		

	},
	mutations: {
		
		addLayer(state, lyr){
			
			// temp adding
			if(!findLayerById(state, lyr["seqid"]))
			{
				state.layers.push(lyr)
			}
			// state.layers.push(lyr)
			// console.log("debug-mapstore layers ", state.layers)
		},
		removeLayerById(state,i){
			state.layers = state.layers.slice(0,i).concat(state.layers.slice(i))
		},
		
		setLayerPropsById(state, data){
			
			// console.log(`debug-mapstore store object`, this )
			
			var id = data["id"]
			var props = data["props"]
			// var targetLyr = this.mutations["findLayerById"](state,i) || null
			
			// this.mutations["findLayerById"](state,i)
			var targetLyr = findLayerById(state, id)
			
			if(!targetLyr)
			{
				console.log(`warning-store | not found map layer(index=${i}) on map store`)
				return false
			}
			// var argLen = arguments.length
			
			var updProps = props
			
			// if(argLen>3)
			// {
			// 	updProps[arguments[2]] = arguments[3]
			// }
			// else
			// {
			// 	updProps = props
			// }
			// targetLyr = mergeObject(targetLyr, updProps)
			Object.assign(targetLyr, updProps)
			console.log(`debug-mapstore | upd layer`, targetLyr, updProps)
			
			return true
		},
	},
	
	actions:{
		
		saveToLSTO({state,commit}){
			
			var prom = new Promise(
				(resolve,rejected)=>{
					
					var lsto = getLocalStore(state.name)
					lsto.saveItem("layers", state.layers)
				}
			)
			 // var lsto = getLocalStore("map")
			 // lsto.saveItem(state.layers)
			 return prom
		},
		
		clearLSTO({state}){
			
			var lsto = getLocalStore(state.name)
			// lsto.clear()
			lsto.clear(["layers"])
		}
	}
}

export default mapStore;