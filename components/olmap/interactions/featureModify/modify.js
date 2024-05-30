import {Modify} from "ol/interaction"
import PointerInteraction from "ol/interaction/Pointer"
import MapBrowserEventType from "ol/MapBrowserEventType"
// import {ModifyEventType} from "ol/interaction/Modify"
// import {SelectEvent} from "ol/interaction/Select.js"
import {clear} from "ol/obj.js"
import {altKeyOnly, click, pointerMove} from 'ol/events/condition.js';
import {Fill, Stroke, Style,Circle} from 'ol/style.js';
import {Point,MultiPolygon,Polygon} from "ol/geom";
import Feature from "ol/Feature"
import {intersects} from "ol/extent"


import {merge as mergeObject} from "lodash";

import {
  boundingExtent,
  buffer as bufferExtent,
  createOrUpdateFromCoordinate as createExtent,
} from 'ol/extent.js';
import {
  closestOnSegment,
  distance as coordinateDistance,
  equals as coordinatesEqual,
  squaredDistance as squaredCoordinateDistance,
  squaredDistanceToSegment,
} from 'ol/coordinate.js';

import {
  fromUserCoordinate,
  fromUserExtent,
  getUserProjection,
  toUserCoordinate,
  toUserExtent,
} from 'ol/proj.js';
import {getUid} from 'ol/util.js';

/**
 * @param {SegmentData} a The first segment data.
 * @param {SegmentData} b The second segment data.
 * @return {number} The difference in indexes.
 */
function compareIndexes(a, b) {
  return a.index - b.index;
}

const ModifyEventType = {
  /**
   * Triggered upon feature modification start
   * @event ModifyEvent#modifystart
   * @api
   */
  MODIFYSTART: 'modifystart',
  /**
   * Triggered upon feature modification end
   * @event ModifyEvent#modifyend
   * @api
   */
  MODIFYEND: 'modifyend',
};

function quickInsertVertexCondition(mapBrowserEvent){
	
	const b = mapBrowserEvent.type=="pointerdown"
	// const a = altKeyOnly(mapBrowserEvent)
	// console.log("debug-zsolmap insertVertexCondition ",a ,b, mapBrowserEvent)
	return true
}

function normalInsertVertexCondition(mapBrowserEvent){
	const b = mapBrowserEvent.type=="pointerdown"
	const a = altKeyOnly(mapBrowserEvent)
	// console.log("debug-zsolmap insertVertexCondition ",a ,b, mapBrowserEvent)
	return a && b
}

function distanceBetweenPoints(pt, dst_pt, norm=2){
		var dx = (pt[0] - dst_pt[0])
		var dy = (pt[1] - dst_pt[1] )
	return Math.sqrt(dx*dx+dy*dy)
}

class ZsModify extends Modify{
	
	constructor(opts){
		
		// this.insertVertexOpMode_ = opts["insertVertexOpMode"] || "normal"
		var insertVertexOpMode= opts["insertVertexOpMode"] || "normal"
		// var insertVertexOpMode= opts["insertVertexOpMode"] || "quick"
		if(insertVertexOpMode=="quick"){
			
				opts["insertVertexCondition"] = normalInsertVertexCondition
		}
		else
		{
			opts["insertVertexCondition"] = quickInsertVertexCondition
		}
		
		
		
		opts["deleteCondition"] = function(mapBrowserEvent){
			
			// const b = mapBrowserEvent.type=="pointerdown"
			const a = altKeyOnly(mapBrowserEvent)
			// console.log("debug-zsolmap insertVertexCondition ",a ,b, mapBrowserEvent)
			// return !a
			// return true
			return false
		}
		
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
		
		this.lastTouchEndPixelPos_ = [-1,-1] 
		
		// cant use single variable to store Feature
		// because feature is unique
		// this.lastTouchEndFeature_ = null
		
		this.touchEndFeatures_ = []
		this.isTouchEnd = false
		// pixel
		this.touchEndFeaturePointDeletedDist_ = 40
		
		this.insertVertexOpMode_ = insertVertexOpMode
	}
	
	onFeatureAdded(evt){
		
		const feat = evt.element
		
		this.onFeatureAdded_(feat, evt)
	}
	
	handleEvent(mapBrowserEvent) {
	  if (!mapBrowserEvent.originalEvent) {
	    return true;
	  }
	  this.lastPointerEvent_ = mapBrowserEvent;
	
	  let handled;
	  if (
	    !mapBrowserEvent.map.getView().getInteracting() &&
	    mapBrowserEvent.type == MapBrowserEventType.POINTERMOVE &&
	    !this.handlingDownUpSequence
	  ) {
	    this.handlePointerMove_(mapBrowserEvent);
	  }

	  
	  if (this.vertexFeature_ && this.deleteCondition_(mapBrowserEvent)) {
	    if (
	      mapBrowserEvent.type != MapBrowserEventType.SINGLECLICK ||
	      !this.ignoreNextSingleClick_
	    ) {
	      handled = this.removePoint();
	    } else {
	      handled = true;
	    }
	  }
	
		// zs-adding
	  if (mapBrowserEvent.type == MapBrowserEventType.SINGLECLICK) {
	    this.ignoreNextSingleClick_ = false;
		
		// this.lastTouchEndPixelPos_ = mapBrowserEvent.pixel
		// return true
		console.log("debug-zsolmap modify singleclick ", mapBrowserEvent.coordinate, mapBrowserEvent.type, mapBrowserEvent.originalEvent)
		// meanns that touch pixel position is on polygon border line
		
		// console.log("debug-zsolmap modify singleclick addtouch", recordTouchEndFeature.getGeometry())

		if(this.vertexFeature_){
			
			

			// this.lastTouchEndFeature_  = recordTouchEndFeature
			var overlyrSrc = this.getOverlay().getSource()
			
			var recordTouchEndFeature  = new Feature()
			overlyrSrc.addFeature(recordTouchEndFeature)
			const closestSegmentCoord = this.vertexFeature_.getGeometry().getCoordinates()
			recordTouchEndFeature.setGeometry(new Point( closestSegmentCoord ))
			
			if(this.insertVertexOpMode_!="quick"){
				
				overlyrSrc.removeFeature(this.touchEndFeatures_.pop())
				
				recordTouchEndFeature.setProperties({"modify_point_hit_obj":"touchend"})
				
				this.touchEndFeatures_.push(recordTouchEndFeature)				
			}
			else{
				// overlyrSrc
				recordTouchEndFeature.setProperties({"modify_point_hit_obj":"nothing"})
			}

			this.lastTouchEndPixelPos_ = mapBrowserEvent.pixel
			// this.lastTouchEndPixelPos_ = this.getMap().getPixelFromCoordinate(closestSegmentCoord)
			// recordTouchEndFeature.setProperties({"modify_point_hit_obj":"touchend"})
			this.prepareInsertedVertex(mapBrowserEvent.pixel, mapBrowserEvent)
		}
	  }
	  
	  else if(mapBrowserEvent.type == MapBrowserEventType.DBLCLICK){
		  // this.handlePointerAtPixel_(mapBrowserEvent.pixel, this.getMap(),  mapBrowserEvent.coordinate);
		  console.log("debug-zsolmap modify double click ", mapBrowserEvent.type)
	  }
	  // else if(mapBrowserEvent.originalEvent=="contextmenu"){
		 //  console.log("debug-zsolmap modify context ", mapBrowserEvent.type, mapBrowserEvent.originalEvent)
	  // }
	  
	
		const super_ = PointerInteraction.prototype.handleEvent
		// super_.call(this, mapBrowserEvent)
	  // return super.handleEvent(mapBrowserEvent) && !handled;
	  return super_.call(this, mapBrowserEvent) && !handled;
	}
	
	handleDragEvent(mapBrowserEvent){
		
		// if(!this.canDragVertex) return false
		return super.handleDragEvent(mapBrowserEvent)
		// this.lastPixel_
	}
	
	handlePointerMove_(mapBrowserEvent){
		
		// var curPixelPos = mapBrowserEvent.pixel

		var flag=  super.handlePointerMove_(mapBrowserEvent)
		if(  distanceBetweenPoints(mapBrowserEvent.pixel, this.lastTouchEndPixelPos_)
		> this.touchEndFeaturePointDeletedDist_)
		{
			this.getOverlay().getSource().removeFeature(this.touchEndFeatures_.pop())
		}
		
		return flag
	}
	
	handleDownEvent(mapBrowserEvent){
		
		var collided = false
		// if(this.curOpFeat){
		// 	collided = this.isPointIntersectWithGeometryPoint(mapBrowserEvent.pixel, this.curOpFeat.getGeometry(), this.hitVertextTolerance)
		// 	// console.log("debug-zsolmap modify interaction handleDragEvent ", collided)
		// 	// if(!collided){
		// 	// 	return true
		// 	// }
		// 	this.canDragVertex = collided			
		// }

		// // if(this.insertVertexCondition_(mapBrowserEvent)){
		// // 	this.prepareInsertedVertex(mapBrowserEvent.pixel, mapBrowserEvent)
		// // 	// return false
		// // }
		// // return true

		console.log("debug-zsolmap modify interaction handleDownEvent ", collided)
		return super.handleDownEvent(mapBrowserEvent)
		// return false
		// if(mapBrowserEvent.)
		// return true
	}
	
	handleUpEvent(mapBrowserEvent){
		
		this.canDragVertex = false
		console.log("debug-zsolmap modify interaction handleUpEvent ")
		// if(this.insertVertexCondition_(mapBrowserEvent)){
		// 	this.prepareInsertedVertex(mapBrowserEvent.pixel, mapBrowserEvent)
		// }
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
		for(i=0;i<inter_geom_num;i++)
		{
			
			const coord_array = coordinates[i]
			
			for(j in coord_array)
			{
				
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
	

	prepareInsertedVertex(pos, evt){

		// if (!this.condition_(evt)) {
		//   return false;
		// }
		// console.log("debug-zsolmap click down insert to vertex ")
		const map = this.getMap()
		const pixelCoordinate = evt.coordinate;
		// const pixelCoordinate = null;
		// this.handlePointerAtPixel_(pos, map, pixelCoordinate);
		this.dragSegments_.length = 0;
		this.featuresBeingModified_ = null;
		const vertexFeature = this.vertexFeature_;
		if (vertexFeature) {
		  const projection = map.getView().getProjection();
		  const insertVertices = [];
		  const vertex = vertexFeature.getGeometry().getCoordinates();
		  const vertexExtent = boundingExtent([vertex]);
		  const segmentDataMatches = this.rBush_.getInExtent(vertexExtent);
		  const componentSegments = {};
		  segmentDataMatches.sort(compareIndexes);
		  for (let i = 0, ii = segmentDataMatches.length; i < ii; ++i) {
			const segmentDataMatch = segmentDataMatches[i];
			const segment = segmentDataMatch.segment;
			let uid = getUid(segmentDataMatch.geometry);
			const depth = segmentDataMatch.depth;
			if (depth) {
			  uid += '-' + depth.join('-'); // separate feature components
			}
			if (!componentSegments[uid]) {
			  componentSegments[uid] = new Array(2);
			}

			if (
			  segmentDataMatch.geometry.getType() === 'Circle' &&
			  segmentDataMatch.index === CIRCLE_CIRCUMFERENCE_INDEX
			) {
			  const closestVertex = closestOnSegmentData(
				pixelCoordinate,
				segmentDataMatch,
				projection
			  );
			  if (
				coordinatesEqual(closestVertex, vertex) &&
				!componentSegments[uid][0]
			  ) {
				this.dragSegments_.push([segmentDataMatch, 0]);
				componentSegments[uid][0] = segmentDataMatch;
			  }
			  continue;
			}

			if (
			  coordinatesEqual(segment[0], vertex) &&
			  !componentSegments[uid][0]
			) {
			  this.dragSegments_.push([segmentDataMatch, 0]);
			  componentSegments[uid][0] = segmentDataMatch;
			  continue;
			}

			if (
			  coordinatesEqual(segment[1], vertex) &&
			  !componentSegments[uid][1]
			) {
			  if (
				componentSegments[uid][0] &&
				componentSegments[uid][0].index === 0
			  ) {
				let coordinates = segmentDataMatch.geometry.getCoordinates();
				switch (segmentDataMatch.geometry.getType()) {
				  // prevent dragging closed linestrings by the connecting node
				  case 'LineString':
				  case 'MultiLineString':
					continue;
				  // if dragging the first vertex of a polygon, ensure the other segment
				  // belongs to the closing vertex of the linear ring
				  case 'MultiPolygon':
					coordinates = coordinates[depth[1]];
				  /* falls through */
				  case 'Polygon':
					if (
					  segmentDataMatch.index !==
					  coordinates[depth[0]].length - 2
					) {
					  continue;
					}
					break;
				  default:
				  // pass
				}
			  }

			  this.dragSegments_.push([segmentDataMatch, 1]);
			  componentSegments[uid][1] = segmentDataMatch;
			  continue;
			}

			if (
			  getUid(segment) in this.vertexSegments_ 
			  && !componentSegments[uid][0] 
			  && !componentSegments[uid][1] 
			  && this.insertVertexCondition_(evt)
			) {
			  insertVertices.push(segmentDataMatch);
			}
		  }

		  if (insertVertices.length) {
			this.willModifyFeatures_(evt, [insertVertices]);
		  }

		  for (let j = insertVertices.length - 1; j >= 0; --j) {
			this.insertVertex_(insertVertices[j], vertex);
		  }
		}
		
		return !!this.vertexFeature_;
		
	}
	
	prepareDragsegment(){
		
		for (let i = this.dragSegments_.length - 1; i >= 0; --i) {
			  const segmentData = this.dragSegments_[i][0];
			  const geometry = segmentData.geometry;
			  if (geometry.getType() === 'Circle') {
				// Update a circle object in the R* bush:
				const coordinates = geometry.getCenter();
				const centerSegmentData = segmentData.featureSegments[0];
				const circumferenceSegmentData = segmentData.featureSegments[1];
				centerSegmentData.segment[0] = coordinates;
				centerSegmentData.segment[1] = coordinates;
				circumferenceSegmentData.segment[0] = coordinates;
				circumferenceSegmentData.segment[1] = coordinates;
				this.rBush_.update(createExtent(coordinates), centerSegmentData);
				let circleGeometry = geometry;
				const userProjection = getUserProjection();
				if (userProjection) {
				  const projection = evt.map.getView().getProjection();
				  circleGeometry = circleGeometry
					.clone()
					.transform(userProjection, projection);
				  circleGeometry = fromCircle(circleGeometry).transform(
					projection,
					userProjection
				  );
				}
				this.rBush_.update(
				  circleGeometry.getExtent(),
				  circumferenceSegmentData
				);
			  } else {
				this.rBush_.update(boundingExtent(segmentData.segment), segmentData);
			  }
			}
			if (this.featuresBeingModified_) {
			  this.dispatchEvent(
				new ModifyEvent(
				  ModifyEventType.MODIFYEND,
				  this.featuresBeingModified_,
				  evt
				)
			  );
			  this.featuresBeingModified_ = null;
			}
			return false;
	}
	
}



export {
	ZsModify
}