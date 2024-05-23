import {Select} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
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


class ZsFeatureSelection extends Select{
	
		
	handleEvent(mapBrowserEvent){
		
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
		  map.forEachFeatureAtPixel(
			mapBrowserEvent.pixel,
			/**
			 * @param {import("../Feature.js").FeatureLike} feature Feature.
			 * @param {import("../layer/Layer.js").default} layer Layer.
			 * @return {boolean|undefined} Continue to iterate over the features.
			 */
			function (feature, layer) {
				console.log("debug-zsolmap featselect meet condition filter", )
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
		  console.log("debug-zsolmap featselect meet condition noset", )
		  map.forEachFeatureAtPixel(
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
	
	
	// ret_sel = new Select(sel_opts)
	ret_sel = new ZsFeatureSelection(sel_opts)
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