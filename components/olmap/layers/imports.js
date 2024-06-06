
// import {VectorLayer} from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector.js"
// import Feature from "ol/Feature";
// import {MultiPolygon,Point} from "ol/geom";
// import {GeoJSON} from "ol/format";
// import {createVectorLayerFromDataObj} from "../../helpers/layers.js";
// import Map from "ol/Map.js"
import { createLayer } from "./factory"
import {createLayer as createLocationLayer } from "../locations/administrative/layers.js"
import store from "@/store/vueStores"


export function importLayer(opts){
	
	// var lyrName = ""
	if(typeof opts == 'string'){
		opts = {"name": opts}
	}
	
	opts = opts || {}
	var lyrName = opts["name"]
	if(!lyrName){
		throw new Error("attemp to import map layer, but 'name' parameter not in options")
	}
	
	const lyrRepresentType = opts["layerRepresentType"] || null
	
	
	// var map = opts["map"]
	var createLayerFunc = opts["createLayer"] || createLayer
	if(lyrRepresentType=="location"){
		createLayerFunc = createLocationLayer
	}
	
	
	if(createLayerFunc == null || createLayerFunc == undefined || typeof createLayerFunc != 'function'){
		throw new Error("attemp to import map layer, but 'createLayer' parameter not in options and require a function object")
	}
	var createLayerFuncArgs = opts["layerCreateArgs"] || {}
	var map = opts["map"]
	var prom = createLayerFunc(lyrName, createLayerFuncArgs)
	
	// if(map)
	// {
		
	// }
	
	
	
	if( !(prom instanceof Promise) ){
		
		const lyrObj = prom
		
		prom = new Promise(
					(resolve, rejected)=>{
						// resolve(lyrObj)
						resolve(lyrObj)
					}
						
				)
		// console.log(`debug-zsolmap import layer not promise '${lyrName}'`)
	}
	// else{
	// 	console.log(`debug-zsolmap import layer '${lyrName}'`)
	// }
	
// temp adding
	// store.dispatch("findLayers",
	// // {"name":"city"},
	// {"field":"name","value":"city"}
	// )
	// .then(
	// 	(lyrs)=>{
	// 		console.log(`debug-mapviewpage `, lyrs)
	// 		// return lyrs[0]
	// 		if(lyrs[0] && !lyrs[0]["visible"])
	// 		{
	// 			lyrObj.setVisible(false)
	// 		}
	// 	}
	// )
	
	return prom.then(
		
			(lyrObj)=>{
				
				// lyr.get("xname")
				return store.dispatch(
							"findLayers",
				// {"name":"city"},
							{"field":"name","value":name}
							)
							.then(
								(lyrModels)=>{
									
									// console.log(`debug-mapviewpage `, lyrModels)
									// return lyrs[0]
									if(lyrModels[0] && !lyrModels[0]["visible"])
									{
										lyrObj.setVisible(false)
									}
									return  lyrObj
								}
							)
				
			}
	)
	
	// return prom
}