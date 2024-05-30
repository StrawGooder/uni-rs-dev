import {Select} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style} from 'ol/style.js';


import {merge as mergeObject} from "lodash";

// just for test
export class ZsFeatureSelection extends Select{
	
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
		  // console.log("debug-zsolmap featselect meet condition set", )
		  // map.forEachFeatureAtPixel(
		  map.xforEachFeatureAtPixel(
			mapBrowserEvent.pixel,
			/**
			 * @param {import("../Feature.js").FeatureLike} feature Feature.
			 * @param {import("../layer/Layer.js").default} layer Layer.
			 * @return {boolean|undefined} Continue to iterate over the features.
			 */
			function (feature, layer) {
				
				// console.log("debug-zsolmap feat select", feature, feature.getGeometry())
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
		  // console.log("debug-zsolmap feat select selected", selected[0].getGeometry())
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
