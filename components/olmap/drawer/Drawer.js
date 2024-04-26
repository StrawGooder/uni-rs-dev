import Draw from "ol/interaction/Draw.js"
import Feature from "ol/Feature"
import {Point} from "ol/geom"
import Map from "ol/Map"

var mp = new Map()
// mp.render()
class Drawer extends Draw {
	
	constructor(options) {
		
		super(options)
		
		this.history_coords_ = []
		
		this.on("drawend", ()=>{  this.clearHistoryData() } )
		// this.on("drawend", ()=>{ setTimeout(()=>{this.clearHistoryData()}, 256)  } )
	}
	
	handleUpEvent(evt){
		
		console.log("debug-ol ", "mouse up", evt , Date.now())
		var pos = evt.coordinate
		// var map = evt.map
		
		// // console.log("debug-ol ", "mouse up", map.getLayers() )
		// var recv_draw_lyr = map.getLayers().getArray()[2]
		
		// var feat = new Feature(
		// 	{
		// 		"points":new Point(evt.coordinate)
		// 	}
		// )

		
		// var flag = Draw.prototype.handleUpEvent.call(this, evt)
		var flag = super.handleUpEvent(evt)
		
		// if(!this.shouldHandle_)return
		// true draw event is not processed
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
		
		var feat = new Feature()
		
		feat.setGeometry(new Point(pos))
		feat.setProperties({"drawed_status":1})
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

export function createDrawer(name, options){
	
	return new Drawer(options)
}
