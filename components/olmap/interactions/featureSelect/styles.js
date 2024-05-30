import {Select} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style} from 'ol/style.js';


import {merge as mergeObject} from "lodash";

const _style_components = {
	"stroke": new Stroke({"color":"orange", "width":"1px"})
	// "stroke":null
}
const _feat_styles = {
	"click":function(){ 
		
				var style = new Style(
					{
						fill: new Fill({"color":"rgb(0 50 200 / 50%)"}),
						stroke: _style_components["stroke"]
					}
				) 
				// return function(feat){
				// 	return style
				// }
				return style
			
		
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