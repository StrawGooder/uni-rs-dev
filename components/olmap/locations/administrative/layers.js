
import {VectorLayer} from "ol/layer/Vector";
import VectorSource from "ol/source/Vector.js"
import Feature from "ol/Feature";
import {MultiPolygon,Point} from "ol/geom";
import {GeoJSON} from "ol/format";
import {createVectorLayerFromDataObj} from "../../helpers/layers.js";
import Map from "ol/Map.js"



const _type_to_level = {
	"nation":0,
	"province":1,
	"city":2,
	"district":3
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
				"name":"getDistrict",
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
	
	var prom = uni.request({
		url:final_url,
	})
	.then(
		(result)=>{
			var data = result[1].data
				
			// console.log("debug-olmap-location ", data)
			// ol's layer
			var lyr  = null 
			lyr= createVectorLayerFromDataObj(data)
			
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