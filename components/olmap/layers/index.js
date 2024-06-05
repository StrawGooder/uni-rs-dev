import { createVectorLayerFromURL } from "../helpers/layers";
import {createStyle as createCameraStyle} from "./CameraVectorLayer.js"

const _baseUrl = "/static/wms/layers"

const _layerNameToConfig = {
	"outdoorCamera":{
		// baseUrl:_baseUrl,
		// url:"/outdoorCamera",
		route:{
			baseUrl:_baseUrl
			url:"/outdoorCamera"
			queryParam:null
		},
		mapRender:{
			style:createCameraStyle(),
			labelStyle:null	
		}
		
	}
}

const _layerNameToStyle = {
	"outdoorCamera":createCameraStyle(),
}

export function createLayer(name, config){
	
	config  = config || {}
	
	var defaultCfg = _layerNameToConfig[name] || {}
	
	config = mergeObj(defaultCfg, config)
	var route = config["route"] 
	var mapRender = config["mapRender"]
	
	const finalUrl = route["baseUrl"] + route["url"]
	
	return createVectorLayerFromURL(finalUrl, mapRender, {xname:name})
	
}


export function registerLayerStyle(name, style){
	
	_layerNameToStyle[name] = style
	
}