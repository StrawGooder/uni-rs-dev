import { createVectorLayerFromURL, createVectorByDataSource } from "../helpers/layers";

import {createStyle as createCameraStyle} from "./CameraVectorLayer.js"
import {merge as mergeObj } from "lodash"

const _baseUrl = "/gserver/wms/layers"

const _layerNameToConfig = {
	"outdoorCamera":{
		// baseUrl:_baseUrl,
		// url:"/outdoorCamera",
		route:{
			baseUrl:_baseUrl,
			url:"/outdoorCamera",
			queryParam:null,
		},
		
		layerOptions:{
			sourceData:{},
			style:createCameraStyle(),
			
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
	const sourceData = layerOptions["sourceData"] || {}
	const sourceObj = sourceData || finalUrl
	return createVectorByDataSource(sourceObj, layerOptions["style"], Object.assign(props, {xname:name}))
	
}



export function registerLayerStyle(name, style){
	
	_layerNameToStyle[name] = style
	
}