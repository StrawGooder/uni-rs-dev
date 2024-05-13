
import {VectorLayer} from "ol/layer/Vector";
import VectorSource from "ol/source/Vector.js"
import Feature from "ol/Feature";
import {MultiPolygon,Point} from "ol/geom";
import {GeoJSON} from "ol/format";
import {createVectorLayerFromDataObj} from "../../helpers/layers.js";
import Map from "ol/Map.js"



// const _type_to_level = {
// 	"nation":0,
// 	"province":1,
// 	"city":2,
// 	"district":3
// }

const _level_to_type = ["nation","province","city","county"]
var _type_to_level = null

function initConfig(){
	
	if(_type_to_level==null)
	{
		_type_to_level = {}
		_level_to_type.forEach((x,i)=>{_type_to_level[x] = i})
	}
	
}

initConfig()

const _type_to_layer_style = {
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



function createLayer(type){
	
	var level = _type_to_level[type]
	if(level==null)
	{
		throw new Error(`attemp to create administrator layer, but got unknown type '${type}'`)
	}
	return createLayerByAdminLevel(level)
}


function createLayerByAdminLevel(level){
	
	var src_root_url = _request_configs["url"]
	var sub_url = sub_url = _request_configs["routes"][level]["url"]
	
	var final_url = src_root_url + sub_url
	
	var lyr_style_config = _type_to_layer_style[_level_to_type[level]]
	
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
					style_cfg
					)
			
			return lyr
		}
	)
	
	return prom
}


function importLayer(type, map){
	
	var lyr = createLayer(type)
	
	if(map)
	{
		
	}
	
	return lyr
}


export {
	importLayer
}