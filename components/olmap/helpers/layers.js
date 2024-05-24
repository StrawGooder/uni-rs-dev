import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import {MultiPolygon,Point,Polygon,LineString,LinearRing} from "ol/geom"
import {GeoJSON} from "ol/format"
import {Fill,Stroke,Style,Text} from "ol/style"
import {merge as mergeObject, isFunction} from "lodash"
import {createStyle} from "./styles"
import { extentToContour } from "./geo"

const _geom_type_to_cls = {
	"Polygon":Polygon,
	"MultiPolygon":MultiPolygon,
	"LineString":LineString,
	"Point":Point,
	"LinearRing":LinearRing
}

// const _default_text_opts = {
	
// 	"bindProp":"name",
// 	"textFormat":null,

// 	"color":"black",
// 	"size":"64px",
// 	"height":"64px",
// 	"weight":"normal",
// 	"fontType":"Arial",
// 	"outlineWidth":1,

// }

// geojson data object
export function createVectorLayerFromDataObj(data_obj, style){
	
	var iter_feat_data 
	
	var data = data_obj["features"]
	var i = 0
	var geom_cls = null;
	var geom_type;
	var geom;
	var warning_msg = ""
	var new_feat;
	var new_feature_array = []
	
	for(i in data)
	{
		iter_feat_data = data[i]
		
		geom_type = iter_feat_data["geometry"]["type"]
		geom_cls = _geom_type_to_cls[geom_type]
		if(!geom_cls)
		{
			warning_msg = `attemp create layer from geojson data, but got unknown geometry type ${geom_type} on ${i+1}th feature`
			// throw new Error(warning_msg)
			// console.log("warning-ol ", warning_msg)
			throw new Error(warning_msg)
		}
		
		geom = new geom_cls(iter_feat_data["geometry"]["coordinates"])
		
		// var coords = extentToContour(geom.getExtent())
		// coords.push(coords[0])
		// geom = new Polygon([coords])
		// console.log("debug-zsolmap area ", geom.getArea())
		// geom.setCoordinates( iter_feat_data["geometry"]["coordinates"][0][0] )
		
		new_feat = new Feature()
		new_feat.setProperties(iter_feat_data["properties"])
		new_feat.setGeometry(geom)
		
		new_feature_array.push(new_feat)
	}
	
	var source_obj = new VectorSource(
		{
			// wrapX:true,
			// wrapX:false
			
		}
	)
	
	
	// new_feature_array.forEach((x)=>{source_obj.addFeature(x)})
	source_obj.addFeatures(new_feature_array)
	

	style = style || {}
	
	var style_obj = createStyle(style["geomStyle"], style["labelStyle"])
	// style_obj = createStyle(style["geomStyle"], style["labelStyle"])
	
	var vec_opts = {
		source: source_obj,
		style: style_obj
	}
	
	
	return createVectorLayer(vec_opts)
	
}


export function createVectorLayerFromURL(url, style){
	
	var source_obj = new VectorSource(
		{
			// zs-adding 
			// set wrapX for feature selection effect
			// undefined can't be selected,
			// false cant be selected
			wrapX:false,
			// wrapX:true,
			url:url,
			format: new GeoJSON()
		}
	)
	// source_obj.addFeatures(new_feature_array)
	
	style = style || {}
	var style_obj = createStyle(style["geomStyle"], style["labelStyle"])
	// style_obj = createStyle(style["geomStyle"], style["labelStyle"])
	
	var vec_opts = {
		source: source_obj,
		style: style_obj
	}
	
	// var lyr = new VectorLayer(vec_opts)
	// lyr.addFeatures(new_feature_array)
	
	return createVectorLayer(vec_opts)
	
}


export function createVectorLayer(opts){
	
	var style = opts["style"] || null
	
	var lyr = new VectorLayer(opts)
	// lyr.addFeatures(new_feature_array)
	
	// var stroke_color = "unset"
	// var fill_color = "unset"

	var stroke_color = null
	var fill_color = null
	
	if(style)
	{
		var basic_style = null
		var stroke_style = null
		var fill_style = null

		if(isFunction(style))
		{
			basic_style = style(null,null)
		}
		else{
			basic_style = style
		}
		
		stroke_style = basic_style.getStroke()
		fill_style = basic_style.getFill()
		if(stroke_style){
			// stroke_color = stroke_style.getColor() || ""+(stroke_color)
			stroke_color = stroke_style.getColor()
		}
		if(fill_style){
			// fill_color= fill_style.getColor()|| ""+(fill_color)
			fill_color= fill_style.getColor()
		}
	}
	
	lyr.set("baseStyleEx", {"strokeColor":stroke_color, "fillColor":fill_color})
	
	return lyr
}


export function addCoordsToLayer(coords, layer, geom_type, props){
	
	var geom_cls = null;
	var geom_type;
	var geom;
	var coords_new = coords.splice(0)
	// var warning_msg;
	
	// Array.splice
	
	geom_cls = _geom_type_to_cls[geom_type]
	
	if(!geom_cls)
	{
		warning_msg = `attemp add coordinates to layer, but got unknown geometry type ${geom_type} on ${i+1}th feature`
		// throw new Error(warning_msg)
		// console.log("warning-ol ", warning_msg)
		throw new Error(warning_msg)
	}
	
	if(geom_type=="Polygon" 
	|| geom_type=="MultiPolygon"
	)
	{
		coords_new.push(coords_new[0])
		coords_new = [coords_new]
	}
	geom = new geom_cls(coords_new)
	
	// console.log("debug-zsolmap addCoordsToLayer ", coords_new)
	// geom.setCoordinates( iter_feat_data["geometry"]["coordinates"][0][0] )
	
	
	const new_feat = new Feature()
	new_feat.setProperties(props || {})
	new_feat.setGeometry(geom)
	
	// addFeature(new_feat, layer)
	
	return addFeatures(new_feat, layer)
}

export function addFeatures(feat, layer){
	
	// // temp
	// if(feat.__proto__.constructor!="Feature"){
	// 	var new_feat = new Feature()
	// 	new_feat.setGeometry(feat)
	// 	feat = new_feat
	// }
	
	var iters = []
	
	var src = layer.getSource()
	if(!Array.isArray(feat)){
		// src.addFeature(feat)
		iters.push(feat)
	}
	
	iters.forEach((x)=>{
		
		// temp
		var feat;
		if(x.__proto__.constructor.name!="Feature"){
			var new_feat = new Feature()
			new_feat.setGeometry(x)
			feat = new_feat
		}
		else{
			feat = x
		}
		// console.log("debug-zsolmap iter addFeatures ", feat)
		src.addFeature(feat)
		
	})
	// src.addFeatures(feat)
	return true
}

// export function addFeatures(feat, layer){
	
// 	// temp
// 	if(feat.__proto__.constructor!="Feature"){
// 		var new_feat = new Feature()
// 		new_feat.setGeometry(feat)
// 		feat = new_feat
// 	}
	
// 	var src = layer.getSource()
// 	if(!Array.isArray(feat)){
// 		src.addFeature(feat)
// 	}
// 	src.addFeatures(feat)
// 	return true
// }