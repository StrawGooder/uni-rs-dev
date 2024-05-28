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

const _interaction_memo = {
	"click":null,
	"hover":null,
	"altclick":null,
}

// just for test
class ZsFeatureSelection extends Select{
	
	constructor(options){
		// options["keepLabel"] = options["keepLabel"] || false
		super(options)
		
		this.keepLabel_ = options["keepLabel"] || false
	}
	
	applySelectedStyle_(feature){
		
		super.applySelectedStyle_(feature)
		
		// var feat = evt.selected
		// if(!feat)return
		
		// var featName = feat.getProperties()["name"]
		if(!this.keepLabel_)return
		
		var style = this.getLayer(feature).getStyle()
		if(typeof style =='function'){
			style = style(feature)
		}
		var textStyle = style.getText()
	
		const selectedStyle = feature.getStyle()
		selectedStyle.setText(textStyle)
	}
	
	handleEvent(mapBrowserEvent){
		// just copy from Select's handleEvent function
		if (!this.condition_(mapBrowserEvent)) {
			// console.log("debug-zsolmap featselect not meet condition", )
			  return true;
			}
		// console.log("debug-zsolmap featselect meet condition", )
		const add = this.addCondition_(mapBrowserEvent);
		const remove = this.removeCondition_(mapBrowserEvent);
		const toggle = this.toggleCondition_(mapBrowserEvent);
		const set = !add && !remove && !toggle;
		const map = mapBrowserEvent.map;
		const features = this.getFeatures();
		const deselected = [];
		const selected = [];
		if (set) {
		  // Replace the currently selected feature(s) with the feature(s) at the
		  // pixel, or clear the selected feature(s) if there is no feature at
		  // the pixel.
		  clear(this.featureLayerAssociation_);
		  console.log("debug-zsolmap featselect meet condition set", )
		  // map.forEachFeatureAtPixel(
		  map.xforEachFeatureAtPixel(
			mapBrowserEvent.pixel,
			/**
			 * @param {import("../Feature.js").FeatureLike} feature Feature.
			 * @param {import("../layer/Layer.js").default} layer Layer.
			 * @return {boolean|undefined} Continue to iterate over the features.
			 */
			function (feature, layer) {
				console.log("debug-zsolmap featselect meet condition filter", feature)
			  if (this.filter_(feature, layer)) {
				this.addFeatureLayerAssociation_(feature, layer);
				selected.push(feature);
				return !this.multi_;
			  }
			}.bind(this),
			{
			  layerFilter: this.layerFilter_,
			  hitTolerance: this.hitTolerance_,
			}
		  );
		  for (let i = features.getLength() - 1; i >= 0; --i) {
			const feature = features.item(i);
			const index = selected.indexOf(feature);
			if (index > -1) {
			  // feature is already selected
			  selected.splice(index, 1);
			} else {
			  features.remove(feature);
			  deselected.push(feature);
			}
		  }
		  if (selected.length !== 0) {
			features.extend(selected);
		  }
		} else {
		  // Modify the currently selected feature(s).
		  // console.log("debug-zsolmap featselect meet condition noset", )
		  // map.forEachFeatureAtPixel(
		  map.xforEachFeatureAtPixel(
			mapBrowserEvent.pixel,
			/**
			 * @param {import("../Feature.js").FeatureLike} feature Feature.
			 * @param {import("../layer/Layer.js").default} layer Layer.
			 * @return {boolean|undefined} Continue to iterate over the features.
			 */
			function (feature, layer) {
			  if (this.filter_(feature, layer)) {
				if ((add || toggle) && !includes(features.getArray(), feature)) {
				  this.addFeatureLayerAssociation_(feature, layer);
				  selected.push(feature);
				} else if (
				  (remove || toggle) &&
				  includes(features.getArray(), feature)
				) {
				  deselected.push(feature);
				  this.removeFeatureLayerAssociation_(feature);
				}
				return !this.multi_;
			  }
			}.bind(this),
			{
			  layerFilter: this.layerFilter_,
			  hitTolerance: this.hitTolerance_,
			}
		  );
		  for (let j = deselected.length - 1; j >= 0; --j) {
			features.remove(deselected[j]);
		  }
		  features.extend(selected);
		}
		if (selected.length > 0 || deselected.length > 0) {
		  this.dispatchEvent(
			new SelectEvent(
			  // SelectEventType.SELECT,
			  "select",
			  selected,
			  deselected,
			  mapBrowserEvent
			)
		  );
		}
		return true;
		
	}
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
	
	init_opts["style"] = init_opts["style"] || _feat_styles[init_opts["styleTheme"]]()
	
	if(isFeatureSelectionEnabled(mode)){
		closeFeatureSelection(mode)
	}
	
	// ret_interaction = new Select(init_opts)
	ret_interaction = new ZsFeatureSelection(init_opts)
	_interaction_memo[mode] = ret_interaction
	
	map.addInteraction(ret_interaction)
	
	return ret_interaction
}


export function closeFeatureSelection(map, mode){
	
	mode = mode || "click"
	var obj = _interaction_memo[mode]
	if(obj)
	{
		// var obj = _interaction_memo[mode]
		obj.getFeatures().pop()
		map.removeInteraction(obj)
		delete _interaction_memo[mode];
		
		console.log("debug-zsolmap close closeFeatureSelection")
		return true
	}
	
	return false
}


export function isFeatureSelectionEnabled(mode){
	mode = mode || "click"
	return _interaction_memo[mode] == null ? false : true
	
}

export function getFeatureSelection(mode){
	mode = mode || "click"
	console.log("debug-zsolmap getFeatureSelection ", mode, _interaction_memo)
	return _interaction_memo[mode]
}