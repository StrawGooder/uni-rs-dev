import {Select} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import MapBrowserEventType from 'ol/MapBrowserEventType.js';

import {merge as mergeObject} from "lodash";
import {Map} from "ol"
import {Overlay} from "ol"
// new Map().addOverlay()

function checkAndConvertPointValue(x){
	
	if(!Array.isArray(x) && typeof x == "number"){
		x = [x, x]
	}
	
	const num = x.length
	if(num < 1){
		
		console.log("warning-pointequal data is array and length is 2")
		return false
	}
	if(num==1){
		x.push(x[0])
	}
	
	return x
}

function pointEqual(pointA, pointB, tolerance){
	
	pointA = checkAndConvertPointValue(pointA)
	
	pointB = checkAndConvertPointValue(pointB)
	
	tolerance = tolerance || [0,0]
	
	tolerance = checkAndConvertPointValue(tolerance)
	
	var dx= Math.abs( pointA[0] - pointB[0] )
	var dy= Math.abs( pointA[1] - pointB[1] )

	return dx<tolerance[0] && dy<tolerance[1]
}

function pointDiff(pointA, pointB){
	
	pointA = checkAndConvertPointValue(pointA)
	
	pointB = checkAndConvertPointValue(pointB)
	
	var dx= pointA[0] - pointB[0]
	var dy= pointA[1] - pointB[1]
	
	return [dx, dy]
}

// just for test
export class ZsFeatureSelection extends Select{
	
	constructor(options){
		// options["keepLabel"] = options["keepLabel"] || false
		super(options)
		
		this.inputStopped = false
		// this.removeCondition_ = ()=>{return this.inputStopped}
		
		this.keepLabel_ = options["keepLabel"] || false
		
		this.curMapBrowserEvent = null
	}
	
	stopInput(){
		this.inputStopped = true
	}
	
	resumeInput(){
		this.inputStopped = false
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
		// zs-adding
		if(this.inputStopped){
			return true
		}
		// just copy from Select's handleEvent function
		if (!this.condition_(mapBrowserEvent)) {
			// console.log("debug-zsolmap featselect not meet condition", )
			  return true;
		}
		this.curMapBrowserEvent = mapBrowserEvent
		// console.log("debug-zsolmap featselect meet condition", )
		const add = this.addCondition_(mapBrowserEvent);
		const remove = this.removeCondition_(mapBrowserEvent);
		const toggle = this.toggleCondition_(mapBrowserEvent);
		const set = !add && !remove && !toggle;
		// const map = mapBrowserEvent.map;
		// const features = this.getFeatures();
		var deselected = [];
		var selected = [];
		
		var selectResult
		
		if (set) {
		  selectResult = this.executeHitDetection(mapBrowserEvent)
		  selected =  selectResult[0]
		  deselected = selectResult[1]
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
			// constraint
			
		  selectResult = this.executeHitDetectionOnConstraint()
		  selected =  selectResult[0]
		  deselected = selectResult[1]
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
	
	executeHitDetection(mapBrowserEvent){
		
		const map = mapBrowserEvent.map;
		const features = this.getFeatures();
		const deselected = [];
		const selected = [];
	
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
		  
		this.onHitDetectionAfter([selected, deselected])
		return [selected, deselected]
	}
	
	executeHitDetectionOnConstraint(mapBrowserEvent){
		
		// console.log("debug-zsolmap featselect meet condition", )
		const map = mapBrowserEvent.map;
		const features = this.getFeatures();
		const deselected = [];
		const selected = [];
	
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
		
		this.onHitDetectionAfter([selected, deselected])
		
		return [selected, deselected]
		
	}
	
}


export class ZsFeatureSelectAndDrag extends ZsFeatureSelection{
	
	constructor(opts){
		
		super(opts)
		
		this.curDragFeat = null
		this.dragging = false
		
		this.dragTimer = null
		this.touchPixPosPrev = null
		this.dragToleranceDist = [1,1]
	}
	
	startDrag(){
		
		const pixPos = this.curMapBrowserEvent.pixel
		this.dragTimer = setTimeout()
	}
	
	endDrag(){
		
		const pixPos = this.curMapBrowserEvent.pixel
	}
	
	collectTouchInfo(){
		
		const pixPos = this.curMapBrowserEvent.pixel
		
		const equal = pointEqual(pixPos, this.touchPixPosPrev)
		
		if(!equal && this.curDragFeat)
		{
			
			const map = this.getMap()
			const resol = map.getView().getResolution()
			var moveDist = pointDiff(pixPos, this.touchPixPosPrev)
			
			var moveDistCoord = [moveDist[0] * resol,  moveDist[1] * resol]
			
			const draggedFeat = this.curDragFeat
			
			var geom = draggedFeat.getGeometry()
			var geomType = geom.getType()
			
			// var newCoords = geom.getCoordinates()
			if(geomType=="MultiPolygon"){
				this.moveMultiPolygonGeometry(geom, moveDistCoord)
			}
			else if(geomType=="Polygon"){
				this.movePolygonGeometry(geom, moveDistCoord)
			}
			else if(geomType=="Point"){
				this.movePointGeometry(geom, moveDistCoord)
			}
			// var dx = 
			// var dy
		}
		
		this.touchPixPosPrev = pixPos
		
	}
	
	moveMultiPolygonGeometry(geometry, dist){
			
		// var newCoords = geom.getCoordinates()
	
		const polygons = geometry.getCoordinates();
		for (let k = 0, kk = polygons.length; k < kk; ++k) {
		  const rings = polygons[k];
		  for (let j = 0, jj = rings.length; j < jj; ++j) {
			const coordinates = rings[j];
			for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			  // const segment = coordinates.slice(i, i + 2);
				const coord = coordinates[i];
				coord[0] = coord[0] + dist[0]
				coord[1] = coord[1] + dist[1]
				
			}
		  }
		}
		
		geometry.setCoordinates(polygons)
		
	}
	
	movePolygonGeometry(geometry, dist){
		
		// var newCoords = geom.getCoordinates()
		
		const rings = geometry.getCoordinates();
		for (let j = 0, jj = rings.length; j < jj; ++j) {
		  const coordinates = rings[j];
		  for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			// const segment = coordinates.slice(i, i + 2);
			const coord = coordinates[i];
			coord[0] = coord[0] + dist[0]
			coord[1] = coord[1] + dist[1]

		  }
		}
		
		geometry.setCoordinates(rings)
	}
	
	movePointGeometry(geometry, dist){
		const coord = geometry.getCoordinates();
		coord[0] = coord[0] + dist[0]
		coord[1] = coord[1] + dist[1]
		geometry.setCoordinates(coord) 
	}
	
	onHitDetectionAfter(selectResult){
		
		const selected = selectResult[0]
		const deselected = selectResult[1]
		
		const exitedFeatures = this.getFeatures().getArray()
		
		const interseted = exitedFeatures.includes(selected)
		if( interseted && this.curMapBrowserEvent == MapBrowserEventType.POINTERDRAG){
			this.curDragFeat = selected
			this.dragging = true
			selectResult[0] = []
			selectResult[1] = []
		}
		
		// const featNum = exitedFeatures.getLength()
		// for(var i = featNum -1; i>-1;i--){
		// 	const iterFeat = exitedFeatures.item(i)
		// 	if(iterFeat==selected){
				
		// 	}
		// }
		
	}
	
}