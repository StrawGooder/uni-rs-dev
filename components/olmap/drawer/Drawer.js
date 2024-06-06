import Draw from "ol/interaction/Draw.js"
import Feature from "ol/Feature"
import {Point} from "ol/geom"

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

export function createDrawer(name, opts){
	
	var kls = null
	name = name || "base"
	if(name=="base"){
		kls = Drawer
	}
	else if(name=="default"){
		kls = Draw
	}
	else{
		throw new Error(`attemp to create '${name}' Drawer, not found it `)
	}
	
	console.log("debug-zsolmap drawer", opts)
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
