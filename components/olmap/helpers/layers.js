import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import {MultiPolygon,Point} from "ol/geom"
import {GeoJSON} from "ol/format"
import {Fill,Stroke,Style,Text} from "ol/style"
import {merge as mergeObject, isFunction} from "lodash"


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

function formatText(feature, bindProp, textFormat){
	
	bindProp = bindProp || "name"
	textFormat = textFormat || null
	if(textFormat!=null)
	{
		
		if( isFunction(textFormat) )
		{
			return textFormat(feature.getProperties())
		}
		
		var props = feature.getProperties()
		
		var reExpr = new RegExp(/\$\{w\}/, 'g')
		
		var retStr = textFormat
		var reResultArr = textFormat.matchAll(reExpr)
		
		var iterReResult
		var strLen;
		var foundKey
		for(var i in reResultArr)
		{
			iterReResult = reResultArr[i][0]
			foundKey = iterReResult.slice(2, iterReResult.length-1)
			retStr.replace(foundKey, props[foundKey] || "null")
		}
		return retStr
		
		
	}
	else if(bindProp!=null){
		return feature.getProperties()[bindProp] || "bindEmpty"
	}
	
	return "empty"
	
}

function createTextStyleObject(feature, resolution, opts){
	
	opts = opts || {}
	
	var new_opts = mergeObject(_default_text_opts, opts)
	// Object.assign(, new_opts)
	
	const size  = new_opts["size"]
	const color = new_opts["color"]
	const weight = new_opts["weight"]
	const height = new_opts["height"]
	const fontType = new_opts["fontType"]
	const align = new_opts["align"]
	const font = weight + ' ' + size + '/' + height + ' ' + fontType;
	const fillColor = new_opts["fillColor"] || "#fffffff";
	const outlineColor = new_opts["outlineColor"] || color;
	// const outlineColor = new_opts["outlineColor"];
	const outlineWidth = new_opts["outlineWidth"];

	  return new Text({
		textAlign: align == '' ? undefined : align,
		textBaseline: new_opts["baseline"],
		font: font,
		text: formatText(feature, opts["bindProp"], opts["textFormat"]),
		fill: new Fill({color: color}),
		// stroke: new Stroke({color: outlineColor, width: outlineWidth}),
		stroke: new Stroke({color: outlineColor, width: outlineWidth}),
		
		offsetX: new_opts["offsetX"],
		offsetY: new_opts["offsetY"],
		placement: new_opts["placement"],
		maxAngle: new_opts["maxAngle"],
		overflow: new_opts["overflow"],
		rotation: new_opts["rotation"],
		// offsetX: offsetX,
		// offsetY: offsetY,
		// placement: placement,
		// maxAngle: maxAngle,
		// overflow: overflow,
		// rotation: rotation,
	  })
}

// geojson data object
function createVectorLayerFromDataObj(data_obj, style, text_style){
	
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
	
	var style_obj = null
	var text_style_obj = null
	if(text_style!=null)
	{
		
		// text_style_obj
		style_obj = function(feat, resol){
			var s = new Style(
				{
					stroke: new Stroke({"color":"blue"}),
					text: createTextStyleObject(feat, resol, text_style)
				}
			)
			console.log("debug-ollayer ", s.getText())
			return s
		}
	}
	
	if(style){
		style_obj = style
	}
	
	
	
	var lyr = new VectorLayer(
		{
			source: source_obj,
			style: style_obj
		}
	)
	// lyr.addFeatures(new_feature_array)
	
	return lyr
	
}

export {
	createVectorLayerFromDataObj
}