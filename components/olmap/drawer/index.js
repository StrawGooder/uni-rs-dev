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
function openDrawInteraction(map, name, layer, opts){

	name = name || "default"
	opts = mergeObject({"type":"base", "vectorType":"Polygon"}, opts || {} )
	
	

	// if(drawer!=null)return 
	// drawer = new Draw(
	
	// var draw_init_options = {}
	var drawer = _interaction_memo[name] || null
	// var drawType = opt

	
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
										),
									}
								)
							}
						);
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
		drawer = createDrawer(
					drawStyleTheme==null||drawStyleTheme=="base"?opts["type"]:"default",
					{
						source:storedLyr.getSource(),
						style:opts["drawStyle"],
						// custom prop
						styleTheme:drawStyleTheme,
						type:opts["vectorType"],
	
					}
				)		
					
		_interaction_memo[name] = drawer
		try{
			map.addLayer(storedLyr)
		}catch(e){
			//TODO handle the exception
			console.log("error-zsolmap ", e)
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

function closeDrawInteraction(map, name = "default") {
	
	var drawer = hasDrawInteraction(name)
	if(drawer){
		map.removeInteraction(drawer)	
		
		var src = drawer.source_
		 
		var lyrs =  map.getAllLayers()
		var lyrTotal = lyrs.length
		for(var i = lyrTotal-1; i>-1;i--)
		{
			if(lyrs[i].getSource()==src){
				map.removeLayer(lyrs[i])
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


function hasDrawInteraction(name){
	
	return _interaction_memo[name]
}


export {
	openDrawInteraction,
	closeDrawInteraction
}


