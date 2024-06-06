import { createDrawer } from "./Drawer"
import { makePolygonDrawStyleFunc } from "./style"
import {Stroke,Fill, Circle, Style} from "ol/style"
// import CircleStyle from "ol/style/Circle"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"

import {merge as mergeObject} from "lodash"
// const _draw_interaction = {}
const _interaction_memo = {
	default:null
}

// layer: store those features that was drawed by user
// opts(object):
// 	type: drawer type
// 	drawStyle: setup the overlap layer style (response the user drawing action)
//	vectorType: drawed geometry type
export function openDrawInteraction(map, name, layer, opts){

	name = name || "default"
	opts = mergeObject({"type":"base", "vectorType":"Polygon"}, opts || {} )
	
	var drawer = _interaction_memo[name] || null

	if (!drawer)
	{
		// the layer stores the drawed finish polygon
		var storedLyr = null
		if(!layer)
		{
			storedLyr= new VectorLayer(
							{
								source: new VectorSource(
										{
											wrapX: false
										}		
								),
								style:new Style(
									{
										file: new Fill({color:"#ffffffa"}),
										stroke: new Stroke({color:"pink", width:2}),
										image: new Circle(
													{
														radius:5,
														stroke:new Stroke({color:"yellow"})
													}
												)
										,
									}
								)
							}
						);
						
			storedLyr.set("xtemporary")
		}
		else
		{
			storedLyr = layer
		}
		
		if(opts["style"]){
			storedLyr.setStyle( opts["style"] )	
		}
		
		// temp process
		var drawStyleTheme = opts["drawStyleTheme"] || null
		
		var drawVecType = opts["vectorType"]
		var classType = "default";
		
		if(drawVecType=="Point"){
			classType = "default"
			drawStyleTheme=　"point"
			opts["drawStyle"] = null
		}
		else if(drawVecType=="Polygon" || drawVecType=="MultiPolygon")
		{
			if(drawStyleTheme=="base"){
				classType = opts["type"] ||　classType
			}
		}
		
		drawer = createDrawer(
					classType,
					{
						source:storedLyr.getSource(),
						style:opts["drawStyle"],
						// custom prop
						styleTheme:drawStyleTheme,
						type:drawVecType,
	
					}
				)		
					
		_interaction_memo[name] = drawer
		try{
			map.addLayer(storedLyr)
		}catch(e){
			//TODO handle the exception
			console.log("error-zsolmap add layer to drawer", e)
		}
		
		map.addInteraction(drawer)
	}

	
	// drawer.on("drawstart", (evt)=>{console.log("debug-ol-draw ", "draw start", evt)})
	// drawer.on("drawend", 
	// 	(evt)=>{
	// 		console.log("debug-ol-draw ", "draw end")
	// 	} 
	// )
	// drawer.on("drawabort", (evt)=>{console.log("debug-ol-draw ", "draw abort")})
	// drawer.on("change:active", (evt)=>{console.log("debug-ol-draw ", "draw change")})
	
	return drawer
}

export function closeDrawInteraction(map, name = "default") {
	
	var drawer = getDrawInteraction(name)
	if(drawer)
	{
		map.removeInteraction(drawer)	
		
		var src = drawer.source_
		 
		var lyrs =  map.getAllLayers()
		var lyrTotal = lyrs.length
		for(var i = lyrTotal-1; i>-1;i--)
		{
			const iterLyr = lyrs[i]
			if(iterLyr.getSource()==src){
				if(iterLyr.get("xtemporary")){
					map.removeLayer(iterLyr)
				}
				
				console.log("debug-zsolmap-drawer remove draw stored layer")
				break;
			}
		}
		
		// var targetLry = map.getAllLayers().filter((x)=>x.getSource()==src)[0]
		// if(targetLry){
		// 	map.removeLayer(targetLry)
		// 	console.log("debug-zsolmap-drawer remove draw stored layer")
		// }
		
		delete _interaction_memo[name]
	}
	
	// map.removeInteraction(gDrawPointInta)
}


export function getDrawInteraction(name){
	
	return _interaction_memo[name]
}

function hasDrawInteraction(name){
	
	return _interaction_memo[name]
}

