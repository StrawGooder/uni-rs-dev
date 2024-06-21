import { createVectorLayerFromURL, createVectorByDataSource } from "../helpers/layers";

import {createStyle as createCameraStyle} from "./CameraVectorLayer.js"
import {createStyle as createStyleFromPreset} from "./layerStyleLibs.js"
import {merge as mergeObj } from "lodash"

// const _baseUrl = "/gserver/wms/layers"
const _baseUrl = "/static/map/locations"

const _layerNameToConfig = {
	"GPSLocation":{
		route:{
			baseUrl:_baseUrl,
			url:"/user/gps-location.json",
			queryParam:null,
		},
		
		layerOptions:{
			sourceData:null,
			style:createStyleFromPreset("location"),
			props:{
				geomType:"Point"
			}
		}	
	},
	"OutdoorPhotograph":{
		// baseUrl:_baseUrl,
		// url:"/outdoorCamera",
		route:{
			baseUrl:_baseUrl,
			url:"/user/photograph-locations.json",
			queryParam:null,
		},
		
		layerOptions:{
			sourceData:null,
			style:createStyleFromPreset("photograph"),
			
			props:{
				geomType:"Point"
			}
		}
	},
	"TraceMemoryLocationRed":{
		route:{
			baseUrl:_baseUrl,
			url:"/user/red-flag.json",
			queryParam:null,
		},
		
		layerOptions:{
			sourceData:null,
			style:createStyleFromPreset("redFlag"),
			
			props:{
				geomType:"Point"
			}
		}
	},
	"TraceMemoryLocationYellow":{
		route:{
			baseUrl:_baseUrl,
			url:"/user/red-flag.json",
			queryParam:null,
		},
		
		layerOptions:{
			sourceData:null,
			style:createStyleFromPreset("redFlag"),
			
			props:{
				geomType:"Point"
			}
		}
	}
}

// const _layerNameToStyle = {
// 	"outdoorCamera":createCameraStyle(),
// }

export function createLayer(name, opts){
	
	opts  = opts || {}
	
	var defaultOpts = _layerNameToConfig[name] || {}
	
	opts = mergeObj(defaultOpts, opts)
	var route = opts["route"] 
	var layerOptions = opts["layerOptions"]
	
	const finalUrl = route["baseUrl"] + route["url"]
	
	const props = layerOptions["props"] || {}
	
	// temp process
	// const sourceData = layerOptions["sourceData"] || {}
	// const sourceObj = sourceData || finalUrl
	var sourceObj =  layerOptions["sourceData"] || (finalUrl || null)
	
	return createVectorByDataSource(sourceObj, layerOptions["style"], Object.assign(props, {xname:name}))
	
}



export function registerLayerStyle(name, style){
	
	_layerNameToStyle[name] = style
	
}