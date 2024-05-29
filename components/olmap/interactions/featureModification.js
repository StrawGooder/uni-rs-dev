import {Modify} from "ol/interaction"
import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style,Circle} from 'ol/style.js';
import {Point,MultiPolygon,Polygon} from "ol/geom";
import Feature from "ol/Feature"
import {intersects} from "ol/extent"


import {merge as mergeObject} from "lodash";

const _style_components = {
	"stroke": new Stroke({"color":"red", "width":"5px"})
	// "stroke":null
}
const _feat_styles = {
	"base":function(){ 
		
				var hit_mouse_style = new Style(
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 5,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "red",
									width: 2,
								  }),
								}
						)
					}
				) 
				var normal_style = new Style (
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 10,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "orange",
									width: 1,
								  }),
								}
						)
					}	
				);
				var hit_buffer_style = new Style (
					{
						// fill: new Fill({"color":"rgb(50 50 0)"}),
						// stroke: _style_components["stroke"],
						image: new Circle(
								{
								  radius: 5,
								 //  fill: new Fill({
									// color: blue,
								 //  }),
								  stroke: new Stroke({
									color: "cyan",
									width: 1,
								  }),
								}
						)
					}	
				);
				return function(feat){
					var props = feat.getProperties()
					if(props["modify_point_hit_obj"]=="nothing"){
						return normal_style
					}
					return hit_mouse_style
				}
				// return style
			
		
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
	// "click":null,
	// "hover":null,
	// "altclick":null,
	"base":null
}

class ZsModify extends Modify{
	
	constructor(opts){
		super(opts)
		
		this.features_.addEventListener(
			"add",
			this.onFeatureAdded.bind(this)
		)
		
		this.features_.addEventListener(
			"remove",
			this.onFeatureRemoved.bind(this)
		)
		
		this.curOpFeat = null
		
		this.canDragVertex = false
		
		this.hitVertextTolerance = 0.5
	}
	
	onFeatureAdded(evt){
		
		const feat = evt.element
		
		this.onFeatureAdded_(feat, evt)
	}
	
	handleDragEvent(mapBrowserEvent){
		
		if(!this.canDragVertex) return true
		return super.handleDragEvent(mapBrowserEvent)
		// this.lastPixel_
	}
	
	handleDownEvent(mapBrowserEvent){
		
		var collided = false
		if(this.curOpFeat){
			collided = this.isPointIntersectWithGeometryPoint(mapBrowserEvent.pixel, this.curOpFeat.getGeometry(), this.hitVertextTolerance)
			// console.log("debug-zsolmap modify interaction handleDragEvent ", collided)
			// if(!collided){
			// 	return true
			// }
			this.canDragVertex = collided			
		}

		console.log("debug-zsolmap modify interaction handleDownEvent ", collided)
		return super.handleDownEvent(mapBrowserEvent)
	}
	
	handleUpEvent(mapBrowserEvent){
		
		this.canDragVertex = false
		console.log("debug-zsolmap modify interaction handleUpEvent ")
// 		var collided = this.isPointIntersectWithGeometryPoint(mapBrowserEvent.pixel, this.curOpFeat.getGeometry(), 5)
// 		console.log("debug-zsolmap modify interaction handleUpEvent ", collided)
		
// 		const map = this.getMap()
// 		const posPix = mapBrowserEvent.pixel
// 		const posGeom = mapBrowserEvent.coordinate
// 		const poxCvtPix = map.getPixelFromCoordinate(posGeom)
// 		console.log("debug-zsolmap modify interaction handleUpEvent ",
// 		posGeom,
// 		poxCvtPix,
// 		// mapBrowserEvent,
// 		posPix,
// 		[posPix[0] - poxCvtPix[0], posPix[1] - poxCvtPix[1]],
		
// // 		map.getPixelFromCoordinate([
// //     109.706963,
// //     26.007462
// // ])
// 		)
		// return false
		return super.handleUpEvent(mapBrowserEvent)
	}
	
	onFeatureAdded_(feat, evt){
	
		this.curOpFeat = feat
		
		const modifier = this
		if(feat)
		{
			// var feat_pt = new Point(feat.coordinates()[0])
			// console.log("debug-zsolmap add points",feat, sel.getFeatures().item(0))
			var pts = feat.getGeometry().getCoordinates()[0][0]
			var pt_num = pts.length
			var pt_geom ;
			var feat_pt;
			var step = 1
			var mdf_overlay_src = modifier.getOverlay().getSource()
			mdf_overlay_src.clear()
			for(var i =0;i<pt_num;i=i+step)
			{
				pt_geom = new Point(pts[i])
				// console.log("debug-zsolmap add points", pts[i])
				feat_pt = new Feature()
				feat_pt.setGeometry(pt_geom)
				feat_pt.setProperties({"modify_point_hit_obj":"nothing"})
				mdf_overlay_src.addFeature(feat_pt)
				// break
			}
		}	
	}
	
	onFeatureRemoved(evt){
		
		const feat = evt.element
		// this.curOpFeat = feat
		this.onFeatureRemoved_(feat, evt)
	}
	
	onFeatureRemoved_(feat){
		
	}
	
	isPointCollidedToPoint(pt, dst_pt, bufferDist){
		bufferDist = bufferDist || 10
		const box_pt = [ pt[0] - bufferDist, pt[1] - bufferDist, pt[0] + bufferDist, pt[1] + bufferDist]
		
		const dst_buffer_dist =  1
		const dst_box_pt = [ dst_pt[0] - dst_buffer_dist, dst_pt[1] - dst_buffer_dist, dst_pt[0] + dst_buffer_dist, dst_pt[1] + dst_buffer_dist]
		
	// 	var dx = (pt[0] - dst_pt[0]) 
	// 	var dy = (pt[1] - dst_pt[1] )
	
	// 	const dist = Math.sqrt(dx*dx + dy*dy)
	// 	if(dist<=1700){
	// 		// console.log("debug-zsolmap modify isPointCollidedToPoint ", dist, dx, dy, pt, dst_pt)
	// 		var b
	// 	}
		
		// var cli_xmin = Math.max(box_pt[0], dst_box_pt[0])
		// var cli_ymin = Math.max(box_pt[1], dst_box_pt[1])
		// var cli_xmax = Math.min(box_pt[2], dst_box_pt[2])
		// var cli_ymax = Math.min(box_pt[3], dst_box_pt[3])
		
		// const area = (cli_xmax - cli_xmin ) * (cli_ymax - cli_ymin )
		// console.log("debug-zsolmap modify isPointCollidedToPoint ", intersects(box_pt, dst_box_pt))
		// return area > 0
		
		return intersects(box_pt, dst_box_pt)
	}
	
	isPointIntersectWithGeometryPoint(pt, geom, bufferDist){
		
		var result = this.getPointsIntersectWithGeometryPoint(pt, geom, bufferDist)
		// if(result[0]>-1){
		// 	return
		// }
		return result[0]>-1
	}
	
	getPointsIntersectWithGeometryPoint(pt, geom, bufferDist){
		var found_result = [-1,-1]
		
		const geomType = geom.getType()

		var coordinates;
		if(geomType=="MultiPolygon"){
			coordinates = geom.getCoordinates()[0]
			
		}
		else if(geomType=="Polygon"){
			coordinates = geom.getCoordinates()[0]
		}

		const inter_geom_num = coordinates.length

		var i,j
		for(i=0;i<inter_geom_num;i++){
			
			const coord_array = coordinates[i]
			
			for(j in coord_array){
				
				
				const dst_pos_pix = this.getMap().getPixelFromCoordinate(coord_array[j])
				// if(j<1){
				// 	console.log("debug-zsolmap getPointsIntersectWithGeometryPoint", coord_array[j], dst_pos_pix)
				// }
				
				if( this.isPointCollidedToPoint(pt, dst_pos_pix) ){
					// found_i = 
					found_result = [i,j, coord_array[j], dst_pos_pix]
					return found_result
				}
				// break
			}
		}

		return found_result
	}
	
}


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
	
	init_opts["style"] = init_opts["style"] || _feat_styles[init_opts["styleTheme"]]()
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
// export {
// 	openFeatureModification, 
// 	closeFeatureModification, 
// 	isFeatureModificationEnabled
// }