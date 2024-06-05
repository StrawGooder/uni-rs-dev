
import {VectorLayer} from "ol/layer/Vector";
import VectorSource from "ol/source/Vector.js"
import Feature from "ol/Feature";
import {MultiPolygon,Point} from "ol/geom";
import {GeoJSON} from "ol/format";
import {createVectorLayerFromDataObj} from "../../helpers/layers.js";
import Map from "ol/Map.js"

import store from "@/store/vueStores"

// const _name_to_level = {
// 	"nation":0,
// 	"province":1,
// 	"city":2,
// 	"district":3
// }

const _level_to_name = ["nation","province","city","county"]
var _name_to_level = null

function initConfig(){
	
	if(_name_to_level==null)
	{
		_name_to_level = {}
		_level_to_name.forEach((x,i)=>{_name_to_level[x] = i})
	}
	
}

initConfig()

const _layer_name_to_render_style = {
	"nation":0,
	"province":1,
	"city":{
		geomStyle:{"color":"blue", "width":"1px"},
		// labelStyle:{"color":"red", "size":"16px", "bindProp":"name"},
		labelStyle:{"color":"rgb(255 0 0/10%)", "size":"64px", "height":1, "bindProp":"name","weight":"normal"},
	},
	"county":{
		
		geomStyle:{"color":"cyan", "width":"1px"},
		// labelStyle:{"color":"red", "size":"16px", "bindProp":"name", 
		// // "textFormat":"县区-${name} 地名代码-${cityCode}",
		// "textFormat":"县区-${name} 地名代码-${gb}"
		// },
	}
}


const _request_configs = 
	{
		"group":"geolocation",
		// "url":"/static/geolocation/nations/china",
		"url":"/static/map/locations/nations/china",
		"routes":[
			
			{
				"name":"getNations",
				"url":"/nations",
			},
			{
				"name":"getProvinces",
				"url":"/provinces",
				
			},
			{
				"name":"getCities",
				"url":"/广西壮族自治区_市.json",
			},
			{
				"name":"getCounty",
				"url":"/广西壮族自治区-县-test.json"
			}
			
		]
	}



function createLayer(name){
	
	var level = _name_to_level[name]
	if(level==null)
	{
		throw new Error(`attemp to create administrator layer, but got unknown layer name '${name}'`)
	}
	return createLayerByAdminLevel(level, {xname: name})
}


function createLayerByAdminLevel(level, props){
	
	var src_root_url = _request_configs["url"]
	var sub_url = sub_url = _request_configs["routes"][level]["url"]
	
	var final_url = src_root_url + sub_url
	
	var lyr_name = _level_to_name[level]
	var lyr_style_config = _layer_name_to_render_style[lyr_name]
	
	var prom = uni.request({
		url:final_url,
	})
	.then(
		(result)=>{
			var data = result[1].data
				
			// console.log("debug-olmap-location ", data)
			// ol's layer
			var lyr  = null
			var style_cfg = {
						geomStyle:lyr_style_config["geomStyle"], 
						labelStyle:lyr_style_config["labelStyle"],
					}
			// console.log("debug-olmap-location ", style_cfg)
			lyr = createVectorLayerFromDataObj(data, 
					style_cfg,
					props
					)
			
			if(props)
			{
				for(var k in props)
				{
					lyr.set(k, props[k])
				}
			}
			
			return lyr
		}
	)
	
	return prom
}


function importLayer(name, map){
	
	var prom = createLayer(name)
	
	if(map)
	{
		
	}
	
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
			return store.dispatch("findLayers",
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


export {
	importLayer
}