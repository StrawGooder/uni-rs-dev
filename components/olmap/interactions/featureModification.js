import {Modify} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style,Circle} from 'ol/style.js';


import {merge as mergeObject} from "lodash";

const _style_components = {
	"stroke": new Stroke({"color":"red", "width":"5px"})
	// "stroke":null
}
const _feat_styles = {
	"base":function(){ 
		
				var style = new Style(
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
									width: 5,
								  }),
								}
						)
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

const _interaction_memo = {
	"click":null,
	"hover":null,
	"altclick":null,
}


export function openFeatureModification(map, mode="base", opts = null){
	
	
	// opts = opts || {}

	var ret_sel = null
	
	var init_opts =  mergeObject({"styleTheme":"base"}, opts || {})
	
	// var theme = init_opts["styleTheme"]
	// mode = mode || "click"
	
	// if(mode=="click")
	// {
	// 	init_opts["style"] = _feat_styles["click"]()
	// 	init_opts["condition"] = click
	// }
	// else if(mode=="singleclick")
	// {
	// 	init_opts["style"] = _feat_styles["click"]()
	// 	init_opts["condition"] = null
	// }
	// else if(mode=="hover")
	// {
	// 	init_opts["style"] = _feat_styles["hover"]()
	// 	init_opts["condition"] = pointerMove
	// }
	// else if(mode=="altclick")
	// {
	// 	init_opts["style"] = _feat_styles["altclick"]()
	// 	init_opts["condition"] = function(mapBrowserEvent){
	// 		return altKeyOnly(mapBrowserEvent) && click(mapBrowserEvent)
	// 	}	
	// }
	
	if(isFeatureModificationEnabled(mode)){
		closeFeatureModification(mode)
	}
	
	init_opts["style"] = init_opts["style"] || _feat_styles[init_opts["styleTheme"]]()
	ret_sel = new Modify(init_opts)
	
	_interaction_memo[mode] = ret_sel
	
	map.addInteraction(ret_sel)
	
	return ret_sel
}


export function closeFeatureModification(map, mode){
	mode = mode || "base"
	var obj = _interaction_memo[mode]
	if(obj)
	{
		delete _interaction_memo[mode]
		return true
	}
	
	return false
}


export function isFeatureModificationEnabled(mode){
	mode = mode || "base"
	return _interaction_memo[mode] == null ? false : true
	
}

export function getFeatureModificationEnabled(mode){
	mode = mode || "base"
	return _interaction_memo[mode]
	
}
// export {
// 	openFeatureModification, 
// 	closeFeatureModification, 
// 	isFeatureModificationEnabled
// }