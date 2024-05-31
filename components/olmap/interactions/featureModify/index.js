// import {Modify} from "ol/interaction"
// import {SelectEvent} from "ol/interaction/Select.js"
// import {clear} from "ol/obj.js"
// import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
// import {Fill, Stroke, Style,Circle} from 'ol/style.js';
// import {Point,MultiPolygon,Polygon} from "ol/geom";
// import Feature from "ol/Feature"
// import {intersects} from "ol/extent"

import {merge as mergeObject} from "lodash";
import {createThemeStyle} from "./styles.js"
import {ZsModify} from "./modify.js"

const _interaction_memo = {}

export function openFeatureModification(map, mode="base", opts = null){
	
	
	// opts = opts || {}

	var ret_intera = null
	
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
	
	init_opts["style"] = init_opts["style"] || createThemeStyle(init_opts["styleTheme"])
	// ret_intera = new Modify(init_opts)
	
	ret_intera = new ZsModify(init_opts)
	
	_interaction_memo[mode] = ret_intera
	
	map.addInteraction(ret_intera)
	
	
	
	return ret_intera
}


export function closeFeatureModification(map, mode){
	mode = mode || "base"
	var obj = _interaction_memo[mode]
	if(obj)
	{
		map.removeInteraction(obj)
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
