
import {Modify} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style,Circle} from 'ol/style.js';
import {Point,MultiPolygon,Polygon} from "ol/geom";
import Feature from "ol/Feature"
import {intersects} from "ol/extent"


import {merge as mergeObject} from "lodash";

const _style_components = {
	"stroke": new Stroke({"color":"red", "width":"5px"})
	// "stroke":null
}
const _feat_styles = {
	"base":function(){ 
		
				var hit_mouse_style = new Style(
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 5,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "red",
									width: 2,
								  }),
								}
						)
					}
				) 
				var normal_style = new Style (
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 3,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "orange",
									width: 1,
								  }),
								}
						)
					}	
				);
				var hit_buffer_style = new Style (
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 5,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "cyan",
									width: 1,
								  }),
								}
						)
					}	
				);
				
				var touch_end_style = new Style (
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 5,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "green",
									width: 1,
								  }),
								}
						)
					}	
				);
				
				var hide_style = new Style (
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 1,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "rgb(255,255,255 / 50%)",
									width: 1,
								  }),
								}
						)
					}	
				);
				
				return function(feat){
					
					var props = feat.getProperties()
					
					var point_interaction_status = props["modify_point_hit_obj"]
					
					if(point_interaction_status=="nothing"){
						return normal_style
					}
					else if(point_interaction_status=="lastTouch"){
					
						// console.log("debug-zsolmap modify style ", point_interaction_status, feat.getGeometry().getCoordinates())
						
						return touch_end_style
					}
					else if(point_interaction_status=="hidden"){
						return hide_style
					}
					// console.log("debug-zsolmap modify style ", point_interaction_status, feat.getGeometry().getCoordinates())
					
					return hit_mouse_style
					// return touch_end_style
				}
				// return style
			
		
		// var style = feat.getStyle(); 
		// style.setColor("#00aa00ff") 
		// // new Style({fill: new Fill({"color":"#00aa00"})}) 
		// return style
	},
	"hover":function(){ 
		
		var style = new Style({
			fill: new Fill({"color":"#aa220011"}),
			stroke: _style_components["stroke"]
		
		})
		return function(feat){
			return style
		}
		
		// var style = feat.getStyle(); 
		// style.setColor("#00aa00ff") 
		// new Style({fill: new Fill({"color":"#aa220011"})})
		// return style
	},
	"altclick":function(feat, e){ 
		
		var style = new Style({
			fill: new Fill({"color":"#0099999"}),
			stroke: _style_components["stroke"]
		})
		return function(feat){
			return style
		}
		// var style = feat.getStyle(); 
		// style.setColor("#00aa00ff") 
		// // new Style({fill: new Fill({"color":"#0099999"})})
		// return style
	},
	
}

export function createThemeStyle(theme){
	return _feat_styles[theme]()
}