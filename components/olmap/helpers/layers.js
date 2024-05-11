import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import {MultiPolygon,Point} from "ol/geom"
import {GeoJSON} from "ol/format"
import {Fill,Stroke,Style,Text} from "ol/style"
import {merge as mergeObject, isFunction} from "lodash"
import {createStyle} from "./styles"

const _geom_type_to_cls = {
	"MultiPolygon":MultiPolygon,
	"Point":Point
}

const _default_text_opts = {
	
	"bindProp":"name",
	"textFormat":null,

	"color":"black",
	"size":"64px",
	"height":"64px",
	"weight":"normal",
	"fontType":"Arial",
	"outlineWidth":1,

}

// geojson data object
function createVectorLayerFromDataObj(data_obj, style){
	
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
		// geom.setCoordinates( iter_feat_data["geometry"]["coordinates"][0][0] )
		
		new_feat = new Feature()
		new_feat.setProperties(iter_feat_data["properties"])
		new_feat.setGeometry(geom)
		
		new_feature_array.push(new_feat)
	}
	
	var source_obj = new VectorSource()
	source_obj.addFeatures(new_feature_array)
	

	style = style || {}
	
	var style_obj = createStyle(style["geomStyle"], style["labelStyle"])
	// style_obj = createStyle(style["geomStyle"], style["labelStyle"])
	
	var vec_opts = {
		source: source_obj,
		style: style_obj
	}
	
	var lyr = new VectorLayer(vec_opts)
	
	return lyr
	
}


function createVectorLayerFromURL(url, style){
	
	var source_obj = new VectorSource(
		{
			url:url,
			format:GeoJSON
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
	
	var lyr = new VectorLayer(vec_opts)
	// lyr.addFeatures(new_feature_array)
	
	return lyr
	
}

export {
	createVectorLayerFromDataObj
}