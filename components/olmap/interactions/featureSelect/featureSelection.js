import {Select} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import Event from "ol/events/Event.js"
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

const dragEventType = {
	dragStart:"dragStart",
	dragging:"draging",
	dragEnd:"dragEnd"
}

class DragEndEvent extends Event{
	
	constructor(type, feature, mapBrowserEvent){
		super(dragEventType.dragEnd)
		this.feature = feature
		this.mapBrowserEvent = mapBrowserEvent
	}
}

class DragStartEvent extends Event{
	
	constructor(type, feature, mapBrowserEvent){
		super(dragEventType.dragStart)
		this.feature = feature
		this.mapBrowserEvent = mapBrowserEvent
	}
}

class DragEvent extends Event{
	
	constructor(type, feature, mapBrowserEvent){
		super(dragEventType.dragging)
		this.feature = feature
		this.mapBrowserEvent = mapBrowserEvent
	}
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
		// following codes are just copied from Select's handleEvent function
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
		const features = this.getFeatures();
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
	
	handleEvent_(mapBrowserEvent){
	
		
		
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
		  
		// this.onHitDetectionAfter([selected, deselected])
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
		this.dragTimerInterval = 2000
		this.prevMapBrowserEvent = null
	}
	
	startDrag(){
		
		// const pixPos = this.curMapBrowserEvent.pixel
		// this.dragTimer = setTimeout( this.execDrag.bind(), this.dragTimerInterval ) 
		this.loopexecDrag()
	}
	
	endDrag(){
		
		// const pixPos = this.curMapBrowserEvent.pixel
		this.dragTimer = null
		this.clearDragStatus()
	}
	
	// bootDragMonitorTimer_(){
		
	// 	if(this.curDragFeat){
	// 		this.dragTimer = setTimeout( this.execDrag.bind(), this.dragTimerInterval ) 
	// 	}
	// 	else{
			
	// 	}
	// 	// this.dragTimer = setTimeout( this.execDrag.bind(), this.dragTimerInterval ) 
	// }
	
	loopexecDrag(){

		const round = this.execDrag
		
		if(this.curDragFeat){
			this.dragTimer = setTimeout(round.bind(this), this.dragTimerInterval ) 
		}
		else{
			this.endDrag()
		}	
		
	}
	
	execDrag(mapBrowserEvent){
		
		// this.loopexecDrag()
		
		var pixPos = mapBrowserEvent.pixel
		if(this.touchPixPosPrev==null){
			this.touchPixPosPrev = pixPos
		}
		const equal = pointEqual(pixPos, this.touchPixPosPrev)
		
		if(!equal && this.curDragFeat)
		{
			
			const map = this.getMap()
			const resol = map.getView().getResolution()
			
			// pixPos = []
			var moveDist = pointDiff(pixPos, this.touchPixPosPrev)
	
			const d = 3
			
			
			var moveDistCoord = [moveDist[0] * resol,  moveDist[1] * resol * -1]
			// moveDistCoord = moveDist
			
			// console.log("debug-zsolmap movie dist ", moveDist, moveDist_)
			
			const draggedFeat = this.curDragFeat
			
			var geom_old = draggedFeat.getGeometry()
			var geomType = geom_old.getType()
			
			// const geom = geom_old.clone()
			const geom = geom_old
			
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
			
			// draggedFeat.setGeometry(geom)
			
			this.dispatchEvent(
				new DragEvent(draggedFeat, mapBrowserEvent)
			)
			// var dx = 
			// var dy
		}
		
		this.touchPixPosPrev = pixPos
		
	}
	
	moveMultiPolygonGeometry(geometry, dist){
			
		// var newCoords = geom.getCoordinates()
	
		const polygons = geometry.getCoordinates();
		// var poly_cp = geometry.clone().getCoordinates();
		for (let k = 0, kk = polygons.length; k < kk; k++) {
		  const rings = polygons[k];
		  for (let j = 0, jj = rings.length; j < jj; j++) {
			const coordinates = rings[j];
			for (let i = 0, ii = coordinates.length ; i < ii; i++) {
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
		for (let j = 0, jj = rings.length; j < jj; j++) {
		  const coordinates = rings[j];
		  for (let i = 0, ii = coordinates.length; i < ii; i++) {
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
	
	handleEvent(mapBrowserEvent){
		
		// zs-adding
		if(this.inputStopped){
			return true
		}
		// following codes are just copied from Select's handleEvent function
		const eventType = mapBrowserEvent.type
		
		// console.log("debug-zsolmap FeatureSelectAndDrag", eventType)
		if (!this.condition_(mapBrowserEvent) 
		&& (eventType!=MapBrowserEventType.POINTERDRAG
		&& eventType!= MapBrowserEventType.POINTERUP
		)
		) {
			// console.log("debug-zsolmap featselect not meet condition", )
			  return true;
		}
		const prevMapBrowserEvent = this.prevMapBrowserEvent
		this.prevMapBrowserEvent = mapBrowserEvent
		
		// console.log("debug-zsolmap FeatureSelectAndDrag", eventType)
		if(eventType==MapBrowserEventType.POINTERDRAG){
			
			this.handleDragEvent_(mapBrowserEvent)
			return true
		}
		else if( this.dragging 
		&& eventType==MapBrowserEventType.POINTERUP
		// && prevMapBrowserEvent==MapBrowserEventType.POINTERDRAG
		){
			
			this.clearDragStatus()
			return true
		}
		
		// this.curMapBrowserEvent = mapBrowserEvent
		// console.log("debug-zsolmap featselect meet condition", )
		const add = this.addCondition_(mapBrowserEvent);
		const remove = this.removeCondition_(mapBrowserEvent);
		const toggle = this.toggleCondition_(mapBrowserEvent);
		const set = !add && !remove && !toggle;
		// const map = mapBrowserEvent.map;
		const features = this.getFeatures();
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
	
	handleDragEvent_(mapBrowserEvent){
	
		
		if(!this.curDragFeat)
		{

			let selectResult
			
			selectResult = this.executeHitDetection(mapBrowserEvent)
			const selected = selectResult[0][0]
			const deselected = selectResult[1]
			
			const exitedFeatures = this.getFeatures()
			
			const included = exitedFeatures.getArray().includes(selected)
			if( included){
				
				this.curDragFeat = selected
				this.dragging = true
				// this.startDrag()
				this.dispatchEvent(new DragStartEvent(selected, mapBrowserEvent))
			}			
			// console.log("debug-zsolmap feature select ", included)
		}
		else
		{
			this.execDrag(mapBrowserEvent)
			this.dispatchEvent(new DragEvent(this.curDragFeat, mapBrowserEvent))
		}
		
	}
	
	clearDragStatus(){
		this.dispatchEvent(new DragEndEvent(this.curDragFeat, this.prevMapBrowserEvent))
		this.curDragFeat = null
		this.dragging = false
		this.touchPixPosPrev = null
	}
	
}