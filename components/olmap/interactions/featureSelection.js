import {Select} from "ol/interaction"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style} from 'ol/style.js';

import {merge as mergeObject} from "lodash";

const _style_components = {
	// "stroke": new Stroke({"color":"red", "width":"2px"})
	"stroke":null
}
const _feat_styles = {
	"click":function(){ 
		
		var style = new Style({
			fill: new Fill({"color":"#00aa009"}),
			stroke: _style_components["stroke"]
		}) 
		return function(feat){
			return style
		}
		// var style = feat.getStyle(); 
		// style.setColor("#00aa00ff") 
		// // new Style({fill: new Fill({"color":"#00aa009"})}) 
		// return style
	},
	"hover":function(){ 
		
		var style = new Style({
			fill: new Fill({"color":"#0000aa9"}),
			stroke: _style_components["stroke"]
		
		})
		return function(feat){
			return style
		}
		
		// var style = feat.getStyle(); 
		// style.setColor("#00aa00ff") 
		// new Style({fill: new Fill({"color":"#0000aa9"})})
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

function openFeatureSelection(map, mode="mode", opts = null){
	
	
	opts = opts || {}

	var ret_sel = null
	
	var sel_opts =  mergeObject({"hitTolerance":0}, opts)
	// mode = mode || "click"
	
	if(mode=="click")
	{
		sel_opts["style"] = _feat_styles["click"]()
		sel_opts["condition"] = click
	}
	else if(mode=="singleclick")
	{
		sel_opts["style"] = _feat_styles["click"]()
		sel_opts["condition"] = null
	}
	else if(mode=="hover")
	{
		sel_opts["style"] = _feat_styles["hover"]()
		sel_opts["condition"] = pointerMove
	}
	else if(mode=="altclick")
	{
		sel_opts["style"] = _feat_styles["altclick"]()
		sel_opts["condition"] = function(mapBrowserEvent){
			return altKeyOnly(mapBrowserEvent) && click(mapBrowserEvent)
		}	
	}
	
	
	if(isFeatureSelectionEnabled(mode)){
		closeFeatureSelection(mode)
	}
	
	
	ret_sel = new Select(sel_opts)
	_interaction_memo[mode] = ret_sel
	
	map.addInteraction(ret_sel)
	
	return ret_sel
}


function closeFeatureSelection(map, mode){
	
	
	if(isFeatureSelectionEnabled(mode))
	{
		map.removeInteraction(_interaction_memo[mode])
		delete _interaction_memo[mode]
		return true
	}
	
	
	return false
}


function isFeatureSelectionEnabled(mode){
	mode = mode || "click"
	return _interaction_memo[mode] == null ? false : true
	
}

export {
	openFeatureSelection, 
	closeFeatureSelection, 
	isFeatureSelectionEnabled
}