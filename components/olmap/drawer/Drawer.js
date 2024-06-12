import Draw from "ol/interaction/Draw.js"
import PointerInteraction from "ol/interaction/Pointer.js"
import MapBrowserEventType from "ol/MapBrowserEventType.js"
import Feature from "ol/Feature"
import {Point,LineString} from "ol/geom"

import {createStyleByTheme as createStyleByTheme} from "./style.js"
// import Map from "ol/Map"
// var mp = new Map()
// mp.render()

class Drawer extends Draw {
	
	constructor(options) {
		
		// options["style"] = createDrawStyle("base")
		
		super(options)
		
		this.history_coords_ = []
		
		this.on("drawend", ()=>{  this.clearHistoryData() } )
		// this.on("drawend", ()=>{ setTimeout(()=>{this.clearHistoryData()}, 256)  } )
	}
	
	handleUpEvent(evt){
		
		// console.log("debug-ol ", "mouse up", evt , Date.now())
		
		// var flag = Draw.prototype.handleUpEvent.call(this, evt)
		var flag = super.handleUpEvent(evt)
		
		// if(!this.shouldHandle_)return
		// flag is true, the touch up event was not handled
		if(flag) return
		
		
		// temp fixup
		 // the last double-clicked point was drawed 
		 // when drawing a polygon is finished (close a curve polygon)

		if(this.history_coords_==null)
		{
			this.resetHistoryData()
			// returning false aim to avoid the map layer responses 
			// the pointer dragging event
			return false
		}
		
		var pos = evt.coordinate
		
		var feat = new Feature()
		
		feat.setGeometry(new Point(pos))
		feat.setProperties({"isDropped":1})
		// recv_draw_lyr.getSource().addFeature(feat)
		// map.render()
		// return this.__proto__.handleUpEvent.apply(this, evt)
		
		feat.getGeometry().setCoordinates(pos)
		
		// this.getOverlay().getSource().addFeatures([feat])
		// return false
		// this.getOverlay().getSource().clear(true)
		this.history_coords_.push(feat)
		
		return flag
		
	}
	
	updateSketchFeatures_(){
		
		// Draw.prototype.updateSketchFeatures_.call(this)
		
		super.updateSketchFeatures_()
		
		this.getOverlay().getSource().addFeatures(this.history_coords_)
		
	}
	
	// finishDrawing(){
		
	// 	this.history_coords_ = []
		
	// 	Draw.prototype.finishDrawing.call(this)
	
	// }
	
	clearHistoryData(){
		
		this.history_coords_ = null
	}
	
	resetHistoryData(){
		
		this.history_coords_ = []
	}
}

class Doodle extends Draw {
	
	constructor(opts){
	
		opts["type"] = "LineString"
		
		if(opts["color"]){
			var style = createStyleByTheme("doodle")(feat)
			style.getStroke().setColor(opts["color"])
			if(opts["width"]){
				style.getStroke().setWidth(opts["width"])
			}
			opts["style"] = style
			// style = function()
		}
		else{
			opts["style"] = createStyleByTheme("doodle")
		}
		
		// opts["style"] = createStyleByTheme("doodle")
		super(opts)
		
		this.lastTouchCoordPos_ = null
		
		this.sketchFeatureLineCoords_ = []
	}
	
	handleEvent(mapBrowserEvent){
		
		const eventType = mapBrowserEvent.type
		var handled = false
		if(eventType==MapBrowserEventType.POINTERMOVE){
			if(!this.sketchPoint_){
				this.sketchPoint_ = new Feature(new Point(mapBrowserEvent.coordinate))
			}
			else{
				this.sketchPoint_.getGeometry().setCoordinates(mapBrowserEvent.coordinate)
			}
			
			this.updateSketchFeatures_()
		}
		else if(eventType==MapBrowserEventType.POINTERDRAG){
			
			handled = this.handleDragEvent(mapBrowserEvent)
		}
		else if(eventType==MapBrowserEventType.POINTERUP){
			console.log("debug-zsolmap draw doodle ptr up")
			handled = this.handleUpEvent(mapBrowserEvent)
		}

		
		return handled
	}
	
	handleDragEvent(mapBrowserEvent){
		
		const curCoordPos = mapBrowserEvent.coordinate
		
		// const newGeomLine = new LineString()
		// new_geom_line.setCoordinates([[this.lastTouchCoordPos_],[curCoordPos]])
		
		// this.sketchFeatureLineCoords_.push([curCoordPos])
		
		// var sketchFeature = this.sketchFeature_
		// if(!sketchFeature){
		// 	sketchFeature = new Feature()
		// 	this.sketchFeature_ = sketchFeature
		// 	sketchFeature.setGeometry(new LineString([[0,0]]))
		// }
		
		// sketchFeature.getGeometry().setCoordinates(this.sketchFeatureLineCoords_)
		// this.appendCoordinates([this.lastTouchCoordPos_, curCoordPos])
		// this.sketchCoords_ = this.sketchFeatureLineCoords_
		
		// this.appendCoordinates([this.lastTouchCoordPos_, curCoordPos])
		this.appendCoordinates([ curCoordPos])
		
		// this.addToDrawing
		// this.modifyDraw()
	
	}
	
	handleUpEvent(mapBrowserEvent){
		
		this.sketchFeatureLineCoords_ = []
		// this.updateSketchFeatures_()
		this.finishDrawing()
		
		// super.handleUpEvent(mapBrowserEvent)
		return true
	}
	
	
	appendCoordinates(coordinates) {
		const mode = this.mode_;
		const newDrawing = !this.sketchFeature_;
		if (newDrawing) {
		  this.startDrawing_(coordinates[0]);
		}
		/** @type {LineCoordType} */
		let sketchCoords;
		if (mode === 'LineString' || mode === 'Circle') {
		  sketchCoords = /** @type {LineCoordType} */ (this.sketchCoords_);
		} else if (mode === 'Polygon') {
		  sketchCoords =
			this.sketchCoords_ && this.sketchCoords_.length
			  ? /** @type {PolyCoordType} */ (this.sketchCoords_)[0]
			  : [];
		} else {
		  return;
		}

		if (newDrawing) {
		  sketchCoords.shift();
		}

		// // Remove last coordinate from sketch drawing (this coordinate follows cursor position)
		// sketchCoords.pop();

		// Append coordinate list
		for (let i = 0; i < coordinates.length; i++) {
		  this.addToDrawing_(coordinates[i]);
		}

		// const ending = coordinates[coordinates.length - 1];
		// Duplicate last coordinate for sketch drawing (cursor position)
		// this.addToDrawing_(ending);
		// this.modifyDrawing_(ending);
	  }
	
}

export function createDrawer(name, opts){
	
	var kls = null
	name = name || "base"
	name = name.toLowerCase()
	if(name=="base"){
		kls = Drawer
	}
	else if(name=="default"){
		kls = Draw
	}
	else if(name=="doodle"){
		kls = Doodle
	}
	else{
		throw new Error(`attemp to create '${name}' Drawer, not found it `)
	}
	
	
	// console.log("debug-zsolmap drawer", opts)
	// zs-adding 20240509
	var styleTheme = opts["styleTheme"]
	if(styleTheme)
	{
		// more prior style theme
		var passedStyle = opts["style"]
		opts["style"] = createStyleByTheme(styleTheme) || passedStyle
		delete opts["styleTheme"]
	}
	// opts["style"] = createDrawStyle("base")
	
	return new kls(opts)
}
