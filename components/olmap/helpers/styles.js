import Feature from "ol/Feature"
import {Fill,Stroke,Style,Text} from "ol/style"
import {merge as mergeObject, isFunction } from "lodash"

const _default_text_style = {
	"color":"black",
	"size":"16px",
	"height":1,
	"placement":"point",
	"align":"center",
	"rotation":0,
	"baseline":"center",
	"weight":"bold",
	// family
	"fontType":"arial"
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
		// '${prop01}' 
		var reExpr = new RegExp(/\$\{\w+\}/, 'g')
		// var reExpr = new RegExp(/[a-zA-Z]+/, 'g')
		
		
		var retStr = textFormat
		// var reResultArr = textFormat.matchAll(reExpr)
		var reResultArr = textFormat.match(reExpr)
		// ''.matchAl
		
		
		var iterReResult
		var strLen;
		var foundKey
		for(var i in reResultArr)
		{
			iterReResult = reResultArr[i]
			foundKey = iterReResult.slice(2, iterReResult.length-1)
			retStr = retStr.replace(iterReResult, props[foundKey] || "null")
		}
		// console.log("debug-zsolmap ", iterReResult, foundKey, props[foundKey], props)
		
		return retStr
		
		
	}
	else if(bindProp!=null)
	{
		return feature.getProperties()[bindProp] || "bindEmpty"
	}
	
	return "emptyProp"
	
}

function createTextStyleObject(feature, resolution, opts){
	
	opts = opts || {}
	
	var new_opts = mergeObject(_default_text_style, opts)
	// Object.assign(, new_opts)
	
	const size  = new_opts["size"]
	
	const weight = new_opts["weight"]
	const height = new_opts["height"]
	const fontType = new_opts["fontType"]
	
	const font = weight + ' ' + size + '/' + height + ' ' + fontType;
	
	const color = new_opts["color"]
	const fillColor = new_opts["fillColor"] || "#fffffff";
	const outlineColor = new_opts["outlineColor"] || color;
	// const outlineColor = new_opts["outlineColor"];
	const outlineWidth = new_opts["outlineWidth"];

	const align = new_opts["align"]

	console.log("debug-zsolmap layer text style ", font)
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


function createStyle(style, text_style){
	
	
	var style_obj = null
	var text_style_obj = null
	

	var style_final = {
		"stroke":{
			"color":"black",
			"width":"1px"
		}
	}
	// console.log("debug-ollayer create style", style, text_style)

	
	if(style!=null || text_style!=null)
	{
		// var stroke_opts = {
		// 	"color":style["color"] || "black",
		// 	"width":style["width"] || "1px"
		// }
		style_final["stroke"]["color"] = style["color"] || style_final["stroke"]["color"]
		style_final["stroke"]["width"] = style["width"] || style_final["stroke"]["width"]
		
		
		var text_style_func = null
		
		if(text_style==null)
		{
			style_obj = new Style(
							{
								stroke: new Stroke(style_final["stroke"])
							}
						)
			
		}
		else
		{
			style_obj = function(feat, resol){
							var s = new Style(
								{
									stroke: new Stroke(style_final["stroke"]),
									text: createTextStyleObject(feat, resol, text_style)
								}
							)
							// console.log("debug-ollayer ", s.getText())
							return s
					}
			
			// console.log("debug-ollayer create text style", style_obj)
			
		}
		
		
	}
	
	// console.log("debug-ollayer create style", style_obj)
	
	return style_obj
}


export {
	createStyle
}