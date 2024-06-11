// import {Select} from "ol/interaction"
// import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import {ZsFeatureSelection, ZsFeatureSelectAndDrag} from "./featureSelection.js"

import {merge as mergeObject} from "lodash";
import { createThemeStyle } from "./styles.js";

const _interaction_objs = {
	"click":null,
	"hover":null,
	"altclick":null,
}

export function openFeatureSelection(map, mode="click", opts = null){

	var ret_interaction = null
	
	// var init_opts =  mergeObject({"hitTolerance":10, "keepLabel":true}, opts)
	var init_opts =  mergeObject({"hitTolerance":10, "keepLabel":true, "styleTheme":"click"}, opts || {})
	
	// mode = mode || "click"
	
	if(mode=="click")
	{
		init_opts["condition"] = click
	}
	else if(mode=="singleclick")
	{
		
		init_opts["condition"] = null
	}
	else if(mode=="hover")
	{
		init_opts["condition"] = pointerMove
	}
	else if(mode=="altclick")
	{
		
		init_opts["condition"] = function(mapBrowserEvent){
			return altKeyOnly(mapBrowserEvent) && click(mapBrowserEvent)
		}	
	}
	else{
		
		throw new Error(`attemp to create '${mode}' mode FeatureSelection Interaction, but not found class`)
	}
	
	init_opts["style"] = init_opts["style"] || createThemeStyle(init_opts["styleTheme"])
	
	if(isFeatureSelectionEnabled(mode)){
		closeFeatureSelection(mode)
	}
	
	// ret_interaction = new Select(init_opts)
	// ret_interaction = new ZsFeatureSelection(init_opts)
	ret_interaction = new ZsFeatureSelectAndDrag(init_opts)
	_interaction_objs[mode] = ret_interaction
	
	map.addInteraction(ret_interaction)
	
	return ret_interaction
}


export function closeFeatureSelection(map, mode){
	
	mode = mode || "click"
	var obj = _interaction_objs[mode]
	if(obj)
	{
		// var obj = _interaction_objs[mode]
		obj.getFeatures().pop()
		map.removeInteraction(obj)
		delete _interaction_objs[mode];
		
		console.log("debug-zsolmap close closeFeatureSelection")
		return true
	}
	
	return false
}


export function isFeatureSelectionEnabled(mode){
	mode = mode || "click"
	return _interaction_objs[mode] == null ? false : true
	
}

export function getFeatureSelection(mode){
	mode = mode || "click"
	// console.log("debug-zsolmap getFeatureSelection ", mode, _interaction_objs)
	return _interaction_objs[mode]
}