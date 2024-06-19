// import Vue from 'vue'
// import Vuex from 'vuex'
import { getLocalStore } from '../localStores';
import {isMap} from "lodash"
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
		return state.layers.filter((x)=>{return x["seqid"]==i})[0]
}

function normalizeConditions(conds){
	
	var new_conds = []
	
}


function validateConditions(obj, conds){
	
	if(!Array.isArray(conds))
	{
		conds = [conds]
	}
	// conds.map(
	// 	(x)=>{
	// 		if(x instanceof String)return {"field":x}}
			
	// 	)
	const total = conds.length
	var i=0
	if(total<i)return false
	// function _validate(i){
		
	// 	if(i>total-1)return false
		
	// 	return obj[conds[i]["field"]] == conds[i]["value"] && _validate(i+1)
	// }
	
	function _validate(cond){
		
		if(i>total-1) return true
		// i++
		return obj[cond["field"]] == cond["value"] && _validate(conds[++i])
	}
	
	return _validate(conds[i])
	
}

// collection(array): layers
// filters(array): query condition
function findLayers(collection, filters){
	
	return collection.filter((x)=>{return validateConditions(x,filters)})
}

function hasLayer(collection, filters){
	
	return findLayers(collection, filters)[0]
}


function loadLayers(){
	
	// zs-adding for no pc browser client
	var data
	try{
		data = getLocalStore("map").loadItem("layers")
	}catch(e){
		//TODO handle the exception
		console.log("debug-map-vuesto  init vue store from LocalStorage, happen an error", e)
		return new Map()
	}
	// var data = getLocalStore("map").loadItem("layers")
	
	if(Array.isArray(data)) return new Map(data)
	else if(isMap(data)) return data
	console.log("debug-map-vuesto init vue store from LocalStorage ", data)
	return new Map()
	
}


const mapStore = {
	
	state: {
		
		// layers:[],
		// layers: getLocalStore("map").loadItem("layers") || [],
		
		layers: loadLayers(),
		// temp for store bucket
		name:"map",
		
		indexField:"seqid",
		
		interactionMode:"read",
		
		usedMode:"view",
	
	},
	getters: {
		
		computedLayers(state){
			return [...state.layers.values()]
		},

	},
	mutations: {
		
		addLayer(state, lyr){
			
			// temp adding
			// if(!findLayerById(state, lyr["seqid"]))
			// {
			// 	state.layers.push(lyr)
			// }
			var indexVal = lyr[state.indexField]
			if(!hasLayer(this.getters.computedLayers, {"field":state.indexField, "value": indexVal} ))
			{
				// state.layers.push(lyr)
				state.layers.set(indexVal, lyr)
				console.log("debug-map-vuesto layers aa ", state.layers, indexVal, lyr)
				// new Map().set
				var a;
			}
			// state.layers.push(lyr)
			// console.log("debug-map-vuesto layers ", lyr)
		},
		
		removeLayer(state, filters){
			
			// var lyrs = findLayers(state.layers, filters)
			var lyrs = findLayers(this.getters.computedLayers, filters)
			
			if(lyrs.length>0)
			{
				// var iter_lyr;
				for(var i in lyrs)
				{
					iter_lyr = lyrs[i]
					state.layers.delete(iter_lyr[state.indexField])	
				}	
			}
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
			
			// this.getter.computedLayers
			// var targetLyr = findLayerById(state, id)
			
			// console.log(`warning-store | `, this.getters.computedLayers)
			var targetLyr = hasLayer(this.getters.computedLayers, {"field":state.indexField, "value":id})
			
			if(!targetLyr)
			{
				console.log(`warning-store | not found map layer(index=${id}) on map store`, targetLyr)
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
		
		findLayers(context, query){
			
			return findLayers(context.getters.computedLayers, query)
		},
		
		saveToLSTO({state,commit}){
			
			var prom = new Promise(
				(resolve, rejected)=>{
					
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