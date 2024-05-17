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
	opts = mergeObject(opts || {}, {"type":"base", "vectorType":"Polygon"} )
	
	

	// if(drawer!=null)return 
	// drawer = new Draw(
	
	// var draw_init_options = {}
	var drawer = _interaction_memo[name] || null
	// var drawType = opt

	
	if (!drawer)
	{
		
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
		}else
		{
			storedLyr = layer
		}
		
		if(opts["style"]){
			storedLyr.setStyle( opts["style"] )	
		}
		
		drawer = createDrawer(
					opts["type"],
					{
						source:storedLyr.getSource(),
						style:opts["drawStyle"],
						type:opts["vectorType"]
						
					}
				)		
					
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

function closeDrawInteraction(map, name= "default") {
	
	var drawer = hasDrawInteraction()
	if(drawer){
		map.removeInteraction(drawer)	
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


