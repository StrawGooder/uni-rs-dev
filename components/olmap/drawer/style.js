
import {Style, Fill, Stroke,Icon} from "ol/style"
import CircleStyle from "ol/style/Circle"
import GeometryType from 'ol/geom/GeometryType.js';

// class PolygonDrawStyle extends Style {
	
// 	constructor(opts){
// 		super(opts)
// 	}
	
// 	styleFunction(){
		
// 	}
	
// }

export function makePolygonDrawStyleFunc(){
	
	var dropped_style = new Style(
			{
				file: new Fill({color:"#ffffffa"}),
				stroke: new Stroke({color:"pink", width:2}),
				image:new CircleStyle(
							{
								radius:5,
								stroke:new Stroke({color:"yellow"})
							}
				),
			}
	)
	
	var icon_width = 48
	var float_style = new Style(
			{
				file: new Fill({color:"#ffffffa"}),
				stroke: new Stroke({color:"blue", width:2}),
				// image:new CircleStyle(
				// 			{
				// 				radius:5,
				// 				stroke:new Stroke({color:"red"})
				// 			}
				// ),
				image: new Icon( 
				{
					src: "/static/crosshair.svg", 
					color:"red", 
					// size:"36",
					width:icon_width,
					height:icon_width,
				} 
				)
			}
	)
	
	return (feat)=>{
		
		var gemo = feat.getGeometry()
		// console.log("debug-ol-style ", gemo.getType(), GeometryType.POINT, feat.getProperties())
		var gemo_type = gemo.getType()
		if(gemo_type == GeometryType.POINT)
		{
			var drawed_status = feat.getProperties()["drawed_status"]
			
			if(drawed_status==1)
			{
				return dropped_style
			}
		}

		return float_style
	}
}