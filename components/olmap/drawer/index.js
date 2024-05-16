import { createDrawer } from "./Drawer"
import { makePolygonDrawStyleFunc } from "./style"

// const _draw_interaction = {}
const _interaction_memo = {
	default:null
}

function openDrawInteraction(map, name, layer, opts){

	name = name || "default"
	opts = opts || {"type":"base", "vectorType":"polygon"}
	// if(drawer!=null)return 
	// drawer = new Draw(
	
	// var draw_init_options = {}
	var drawer = _interaction_memo[name]
	// var drawType = opt
	
	if(!layer){
		var recvDrawVecLyr= new VectorLayer(
			{
				source: new VectorSource(
						{
							wrapX: false
						}		
				),
				style:new style(
					{
						file: new fill({color:"#ffffffa"}),
						stroke: new Stroke({color:"pink", width:2}),
						image: new CircleStyle(
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
		recvDrawVecLyr = layer
	}
	
	
	if (!drawer)
	{
		
		drawer = createDrawer(
					opts["type"],
					{
						source:recvDrawVecLyr.getSource(),
						style:makePolygonDrawStyleFunc(),
						type:opts[vectorType]
						
					}
				)		
					
		map.addInteraction(drawer)
	}

	
	drawer.on("drawstart", (evt)=>{console.log("debug-ol-draw ", "draw start", evt)})
	drawer.on("drawend", 
		(evt)=>{
			console.log("debug-ol-draw ", "draw end")
		} 
	)
	drawer.on("drawabort", (evt)=>{console.log("debug-ol-draw ", "draw abort")})
	drawer.on("change:active", (evt)=>{console.log("debug-ol-draw ", "draw change")})
	

	// gDrawPointInta = new Draw(
	// {
	// 	source:source,
	// 	style:new style(
	// 		{
	// 			image: new CircleStyle(
	// 				{
	// 					radius:1,
	// 					stroke:new Stroke({color:"#ffffffa"})
	// 				}
	// 			)
	// 		}	
	// 	),
	// 	type:"Point"
	// })
	
	
	// map.addInteraction(drawer)
	// map.addInteraction(gDrawPointInta)
	// console.log("debug-ol ", "boot draw inta")
	return drawer
}

function closeDrawInteraction(map, name= "default") {
	
	var drawer = hasDrawerInteration()
	if(drawer){
		map.removeInteraction(drawer)	
		delete _interaction_memo[name]
	}
	
	// map.removeInteraction(gDrawPointInta)
}


function hasDrawerInteration(name){
	
	return _interaction_memo[name]
}


export {
	openDrawInteraction,
	closeDrawInteraction
}


