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
import {projectedDistanceToSegmentDataSquared} from "./helper.js";
import VectorSource from "ol/source/Vector.js"
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
	console.log("debug-zsolmap insertVertexCondition ",a ,b, mapBrowserEvent)
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
			
				opts["insertVertexCondition"] = quickInsertVertexCondition
		}
		else
		{
			opts["insertVertexCondition"] = normalInsertVertexCondition
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
		
		// this.features_.addEventListener(
		// 	"change",
		// 	()=>{
		// 	this.console.log("debug-zsolmap modify feature changed", this.rBush_.getAll().length);
			
		// 	}
		// )
		
		this.curOpFeat = null
		
		this.canDragVertex = false
		this.isDragging = false
		
		this.hitVertextTolerance = 0.5
		
		this.lastTouchPixelPos_ = [-1,-1] 
		
		// cant use single variable to store Feature
		// because feature is unique
		// this.lastTouchEndFeature_ = null
		
		this.lastTouchFeatures = []
		this.isTouchEnd = false
		// pixel
		this.lastTouchHitDistTolerance = 40
		
		this.insertVertexOpMode_ = insertVertexOpMode
	}
	

	
	// addFeature_(feature) {
	//   const geometry = feature.getGeometry();
	//   if (geometry) {
	//     const writer = this.SEGMENT_WRITERS_[geometry.getType()];
	//     if (writer) {
	//       writer(feature, geometry);
	// 	  console.log("debug-zsolmap items ", this.rBush_.getAll().length)
	//     }
	//   }
	//   const map = this.getMap();
	//   if (map && map.isRendered() && this.getActive()) {
	//     this.handlePointerAtPixel_(this.lastPixel_, map);
	//   }
	//   feature.addEventListener(EventType.CHANGE, this.boundHandleFeatureChange_);
	// }
	
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
	  if (mapBrowserEvent.type == MapBrowserEventType.SINGLECLICK) 
	  {
	    this.ignoreNextSingleClick_ = false;
		
		// this.lastTouchPixelPos_ = mapBrowserEvent.pixel
		// return true
		// console.log("debug-zsolmap modify singleclick ", mapBrowserEvent.coordinate, mapBrowserEvent.type, mapBrowserEvent.originalEvent)
		// console.log("debug-zsolmap modify items ", this.rBush_.getAll().length)
		// meanns that touch pixel position is on polygon border line
		
		// console.log("debug-zsolmap modify singleclick addtouch", recordLastTouchPosFeat.getGeometry())
		
		// zs-adding
		if(this.vertexFeature_)
		{
			
			// console.log("debug-zsolmap modify singleclick ", mapBrowserEvent.coordinate, mapBrowserEvent.type, mapBrowserEvent.originalEvent)
			// this.deleteVertexOnCoord(mapBrowserEvent.coordinate)
			// return 
			var overlyrSrc = this.getOverlay().getSource()
			const closestSegmentCoord = this.vertexFeature_.getGeometry().getCoordinates()
			
			// var recordLastTouchPosFeat  = new Feature()
			
			
			// recordLastTouchPosFeat.setGeometry(new Point( closestSegmentCoord ))
			
			// normal insert mode
			if(this.insertVertexOpMode_!="quick")
			{
			
				if(this.insertVertexCondition_(mapBrowserEvent))
				{
					// this.prepareInsertedVertex(closestSegmentCoord, mapBrowserEvent)
					var a_
				}
				else
				{
					overlyrSrc.removeFeature(this.lastTouchFeatures.pop())
					// this.lastTouchFeatures.push(recordLastTouchPosFeat)	
					// recordLastTouchPosFeat.setProperties({"modify_point_hit_obj":"touchend"})
					// overlyrSrc.addFeature(recordLastTouchPosFeat)
					const addedFeat = this.addPointOnOverlay(closestSegmentCoord, overlyrSrc, "lastTouch")
					this.lastTouchFeatures.push(addedFeat)	
				}
				
			}
			else
			{
				this.addPointOnOverlay(closestSegmentCoord, overlyrSrc, "nothing")
				// overlyrSrc
				// recordLastTouchPosFeat.setProperties({"modify_point_hit_obj":"nothing"})
				
				// overlyrSrc.addFeature(recordLastTouchPosFeat)
				
				
			}
			
			
			this.lastTouchPixelPos_ = mapBrowserEvent.pixel
			
			
			
			// this.lastTouchPixelPos_ = this.getMap().getPixelFromCoordinate(closestSegmentCoord)
			// recordLastTouchPosFeat.setProperties({"modify_point_hit_obj":"touchend"})
			// this.prepareInsertedVertex(mapBrowserEvent.pixel, mapBrowserEvent)
		}
	  }
	  else if(mapBrowserEvent.type == MapBrowserEventType.DBLCLICK){
		  // this.handlePointerAtPixel_(mapBrowserEvent.pixel, this.getMap(),  mapBrowserEvent.coordinate);
		  console.log("debug-zsolmap modify double click ", mapBrowserEvent.type)
		  
		  // this.deleteVertexOnCoord(mapBrowserEvent.coordinate)
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
		if(!this.isDragging){
				this.deletePointOnOverlay(mapBrowserEvent.coordinate)
		}
		
		this.isDragging = true
		return super.handleDragEvent(mapBrowserEvent)
		// this.lastPixel_
	}
	
	handlePointerMove_(mapBrowserEvent){
		
		// var curPixelPos = mapBrowserEvent.pixel

		var flag =  super.handlePointerMove_(mapBrowserEvent)
		
		// clear last touch point on polygon sketch
		if(  this.lastTouchHitDistTolerance <
		distanceBetweenPoints(mapBrowserEvent.pixel, this.lastTouchPixelPos_)
		)
		{
			this.getOverlay().getSource().removeFeature(this.lastTouchFeatures.pop())
			// this.deletePointOnOverlay()
			this.lastTouchPixelPos_ = [-1,-1]
		}
		
		return flag
	}
	
	handleDownEvent(evt){
		
		var collided = false
		
		if (!this.condition_(evt)) {
		  return false;
		}
		const pixelCoordinate = evt.coordinate;
		this.handlePointerAtPixel_(evt.pixel, evt.map, pixelCoordinate);
		this.dragSegments_.length = 0;
		this.featuresBeingModified_ = null;
	
		this.prepareInsertedVertex(evt.coordinate, evt)
		
		return !!this.vertexFeature_
		
		
	}
	
	handleUpEvent(mapBrowserEvent){
		
		
		this.canDragVertex = false
	
		// return false
		if(
		// this.lastPointerEvent_== "pointermove" &&
		this.isDragging
		)
		{
			this.addPointOnOverlay(mapBrowserEvent.coordinate, null, 'nothing')
		}
		this.isDragging = false
		
		return super.handleUpEvent(mapBrowserEvent)
	}
	
	onFeatureAdded(evt){
		
		const feat = evt.element
		
		this.onFeatureAdded_(feat, evt)
	}
	
	onFeatureAdded_(feat, evt){
	
		this.curOpFeat = feat
		
		// const modifier = this
		if(feat)
		{
			// var feat_pt = new Point(feat.coordinates()[0])
			// console.log("debug-zsolmap add points",feat, sel.getFeatures().item(0))
			var pts = feat.getGeometry().getCoordinates()[0][0]
			var pt_num = pts.length
			// var pt_geom ;
			// var feat_pt;
			var step = 1
			var mdf_overlay_src = this.getOverlay().getSource()
			mdf_overlay_src.clear()
			for(var i =0;i<pt_num;i=i+step)
			{
				// pt_geom = new Point(pts[i])
				// // console.log("debug-zsolmap add points", pts[i])
				// feat_pt = new Feature()
				// feat_pt.setGeometry(pt_geom)
				// feat_pt.setProperties({"modify_point_hit_obj":"nothing"})
				// mdf_overlay_src.addFeature(feat_pt)
				this.addPointOnOverlay(pts[i], mdf_overlay_src, "nothing")
				// break
			}
			
		}	
		
		console.log("debug-zsolmap modify items add ", this.rBush_.getAll().length)
	}
	
	
	onFeatureRemoved(evt){
		
		const feat = evt.element
		// this.curOpFeat = feat
		this.onFeatureRemoved_(feat, evt)
	}
	
	
	onFeatureRemoved_(feat){
		
		console.log("debug-zsolmap modify items remove", this.rBush_.getAll().length) 
		
		this.getOverlay().getSource().clear()
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
	
	// pos(Array): coordinate
	prepareInsertedVertex(pos, evt){

		// if (!this.condition_(evt)) {
		//   return false;
		// }
		// console.log("debug-zsolmap click down insert to vertex ")
		const map = this.getMap()
		// const pixelCoordinate = evt.coordinate;
		const pixelCoordinate = pos
		// const pixelCoordinate = null;
		// this.handlePointerAtPixel_(pos, map, pixelCoordinate);
		this.dragSegments_.length = 0;
		this.featuresBeingModified_ = null;
		const vertexFeature = this.vertexFeature_;
		
		if (vertexFeature 
		// && this.insertVertexCondition_(evt)
		) 
		{
			// console.log("debug-zsolmap prepareInsertedVertex ")
			
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
				// affect overlay
				// const insertedPosFeat = new Feature()
				// insertedPosFeat.setGeometry( new Point( closestSegmentCoord ) )
				// insertedPosFeat.setProperties({"modify_point_hit_obj":"nothing"})
				// this.getOverlay().getSource().addFeature(insertedPosFeat)
				
				
				this.addPointOnOverlay(pos, null, "nothing")
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

		
		// origin codes
		return !!this.vertexFeature_;
		
		// zs-modify
		// return insertVertices.length > 0
		
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


	
	deleteVertexOnCoord(pixelCoordinate, hitTolerance, projection){
		
		// super
		const map = this.getMap()
		projection = projection || map.getView().getProjection()
		let tempExtent = [0,0,0,0]
		const viewExtent = fromUserExtent(
		  createExtent(pixelCoordinate, tempExtent),
		  projection
		);
		
		// this.pixelTolerance_ = 10
		const buffer = map.getView().getResolution() * this.pixelTolerance_;
		const box = toUserExtent(
		  bufferExtent(viewExtent, buffer, tempExtent),
		  projection
		);
		
		
		const sortByDistance = function (a, b) {
		  return (
		    projectedDistanceToSegmentDataSquared(pixelCoordinate, a, projection) -
		    projectedDistanceToSegmentDataSquared(pixelCoordinate, b, projection)
		  );
		};
		
	
		const clickedPixelPos = map.getPixelFromCoordinate(pixelCoordinate)
		
		
		const items = this.rBush_.getAll()
		
		// console.log("debug-zsolmap modify ", items.length)
		
		let nodes = this.rBush_.getInExtent(box);
		// console.log("debug-zsolmpa modify delete vertex target nodes ", nodes, box)
		// the found node is closest node4
		var node_sort = nodes.sort(sortByDistance).slice(0, 2)
		const node  = node_sort[0]
		const segment = node.segment
		const pixelPosA =   map.getPixelFromCoordinate( segment[0] )
		const pixelPosB = map.getPixelFromCoordinate( segment[1] )
		
		
		const  clickToADist = squaredCoordinateDistance(pixelPosA, clickedPixelPos)
		const  clickToBDist = squaredCoordinateDistance(pixelPosB, clickedPixelPos)
		
		let minDist
		let minPixInd
		if(clickToADist>clickToBDist){
			minDist = clickToBDist
			minPixInd = 1
		}
		else{
			minDist = clickToADist
			minPixInd = 0
		}
		
		if(minDist>this.pixelTolerance_){
			return false
		}
		
		node_sort = node_sort.sort((a,b)=>{return a.index<b.index})
		
		// left right
		this.dragSegments_ = [ 
			[node_sort[0], 0],
			[node_sort[1], 1]
		]
		// node_sort.forEach((it)=>{
		// 	this.dragSegments_.push([it,1])
		// })
		
		// console.log("debug-zsolmap delete vertex ", node_sort[0])
		const deleted = this.removePoint()
		console.log("debug-zsolmap delete vertex ", deleted)
		if(deleted){
			
			this.deletePointOnOverlay(pixelCoordinate)
		}
		
		return deleted
	}
	
	deletePointOnOverlay(pixelCoordinate, projection){
	
		const map = this.getMap()
		projection = projection || map.getView().getProjection()
		let tempExtent = [0,0,0,0]
		const viewExtent = fromUserExtent(
		  createExtent(pixelCoordinate, tempExtent),
		  projection
		);
		
		// this.pixelTolerance_ = 10
		const buffer = map.getView().getResolution() * this.pixelTolerance_;
		const box = toUserExtent(
		  bufferExtent(viewExtent, buffer, tempExtent),
		  projection
		);
		
		const overlyrSrc = this.getOverlay().getSource()
		
		const deletedFeatOnOverlay = []
		// overlyrSrc.forEachFeatureInExtent(
		overlyrSrc.forEachFeatureIntersectingExtent(
			box,
			(feat)=>{
				
				// const geom = feat.getGeometry()
				// const geom_ext = createExtent(geom.getCoordinates())
				 // bufferExtent()geom.getCoordinates()
				 // if(intersect){
					// const intersect = intersects(box, geom_ext)
					// deletedFeatOnOverlay.push(feat)
					// console.log("debug-zsolmap deleted overlay feature ", intersect)	 
				 // }
				 deletedFeatOnOverlay.push(feat)
				
				return true
			}
		)
		// console.log("debug-zsolmap deleted overlay feature ", deletedFeatOnOverlay[0])
		
		deletedFeatOnOverlay.forEach(
		(x)=>{overlyrSrc.removeFeature(x)})
		// overlyrSrc.removeFeature(deletedFeatOnOverlay[0])
	}
	
	markPointOnOverlay(point, lyrSrc, hitObj){
		
		lyrSrc =  lyrSrc || this.getOverlay().getSource()
		hitObj = hitObj || null
		

		// feat_pt.setGeometry(pt_geom)
		// feat_pt.setProperties({"modify_point_hit_obj":"nothing"})
		// lyrSrc.addFeature(feat_pt)
		const pt_geom = new Point(point)
		// console.log("debug-zsolmap add points", pts[i])
		const feat_pt = new Feature()
		feat_pt.setProperties({"modify_point_hit_obj":hitObj})
		
		// this.addFeatureOnOverlay(feat_pt, lyrSrc)
		
		overlyrSrc.removeFeature(this.lastTouchFeatures.pop())
		this.lastTouchFeatures.push(feat_pt)	
		
		
		overlyrSrc.addFeature(recordLastTouchPosFeat)
		
	}
	
	addPointOnOverlay(point, lyrSrc, hitObj){
		
		// only for Polygon , MultiPolygon, LinearLine
		// lyr = lyr || this.getOverlay()
		
		lyrSrc =  lyrSrc || this.getOverlay().getSource()
		hitObj = hitObj || null

		const pt_geom = new Point(point)
		// console.log("debug-zsolmap add points", pts[i])
		const feat_pt = new Feature()
		feat_pt.setGeometry(pt_geom)
		feat_pt.setProperties({"modify_point_hit_obj": hitObj})
		lyrSrc.addFeature(feat_pt)
			// break
		return feat_pt
		
	}
	
	// addFeatureOnOverlay(feat, lyrSrc){
		
	// }
	
	createClosestVertex(pixelPos){
		
		
		pixelPos = pixelPos ||　this.lastTouchPixelPos_
		const coordPos = this.getMap().getCoordinateFromPixel(pixelPos)
		if(!this.vertexFeature_){
			this.handlePointerAtPixel_(pixelPos,null)
			coordPos = this.vertexFeature_.getGeometry().getCoordinate()
		}
		// this.handlePointerAtPixel_(pixelPos,null)
		const storedInsertCond = this.insertVertexCondition_
		this.insertVertexCondition_ = ()=>{return true}
		var success = this.prepareInsertedVertex(coordPos)
		this.insertVertexCondition_ = storedInsertCond
		return success
	}

	removeClosestVertex(pixelPos){
		
		pixelPos = pixelPos ||　this.lastTouchPixelPos_
		const coordPos = this.getMap().getCoordinateFromPixel(pixelPos)
		if(!this.vertexFeature_){
			this.handlePointerAtPixel_(pixelPos,null)
			coordPos = this.vertexFeature_.getGeometry().getCoordinate()
		}
		
		var success=  this.removeVertex_()
		this.deletePointOnOverlay(coordPos)
		return success
	}
	
	removeVertex_() {
	  const dragSegments = this.dragSegments_;
	  const segmentsByFeature = {};
	  let deleted = false;
	  let component, coordinates, dragSegment, geometry, i, index, left;
	  let newIndex, right, segmentData, uid;
	  
	  for (i = dragSegments.length - 1; i >= 0; --i) {
	    dragSegment = dragSegments[i];
	    segmentData = dragSegment[0];
		
	    uid = getUid(segmentData.feature);
	    if (segmentData.depth) {
	      // separate feature components
	      uid += '-' + segmentData.depth.join('-');
	    }
	    if (!(uid in segmentsByFeature)) {
	      segmentsByFeature[uid] = {};
	    }
	    if (dragSegment[1] === 0) {
	      segmentsByFeature[uid].right = segmentData;
	      segmentsByFeature[uid].index = segmentData.index;
	    } else if (dragSegment[1] == 1) {
	      segmentsByFeature[uid].left = segmentData;
	      segmentsByFeature[uid].index = segmentData.index + 1;
	    }
	  }
	  for (uid in segmentsByFeature) {
	    right = segmentsByFeature[uid].right;
	    left = segmentsByFeature[uid].left;
	    index = segmentsByFeature[uid].index;
	    newIndex = index - 1;
	    if (left !== undefined) {
	      segmentData = left;
	    } else {
	      segmentData = right;
	    }
	    if (newIndex < 0) {
	      newIndex = 0;
	    }
	    geometry = segmentData.geometry;
	    coordinates = geometry.getCoordinates();
	    component = coordinates;
	    deleted = false;
	    switch (geometry.getType()) {
	      case 'MultiLineString':
	        if (coordinates[segmentData.depth[0]].length > 2) {
	          coordinates[segmentData.depth[0]].splice(index, 1);
	          deleted = true;
	        }
	        break;
	      case 'LineString':
	        if (coordinates.length > 2) {
	          coordinates.splice(index, 1);
	          deleted = true;
	        }
	        break;
	      case 'MultiPolygon':
	        component = component[segmentData.depth[1]];
	      /* falls through */
	      case 'Polygon':
	        component = component[segmentData.depth[0]];
	        if (component.length > 4) {
	          if (index == component.length - 1) {
	            index = 0;
	          }
	          component.splice(index, 1);
	          deleted = true;
	          if (index === 0) {
	            // close the ring again
	            component.pop();
	            component.push(component[0]);
	            newIndex = component.length - 1;
	          }
	        }
	        break;
	      default:
	      // pass
	    }
	
	    if (deleted) {
	      this.setGeometryCoordinates_(geometry, coordinates);
	      const segments = [];
	      if (left !== undefined) {
	        this.rBush_.remove(left);
	        segments.push(left.segment[0]);
	      }
	      if (right !== undefined) {
	        this.rBush_.remove(right);
	        segments.push(right.segment[1]);
	      }
	      if (left !== undefined && right !== undefined) {
	        /** @type {SegmentData} */
	        const newSegmentData = {
	          depth: segmentData.depth,
	          feature: segmentData.feature,
	          geometry: segmentData.geometry,
	          index: newIndex,
	          segment: segments,
	        };
	
	        this.rBush_.insert(
	          boundingExtent(newSegmentData.segment),
	          newSegmentData
	        );
	      }
	      this.updateSegmentIndices_(geometry, index, segmentData.depth, -1);
	      if (this.vertexFeature_) {
	        this.overlay_.getSource().removeFeature(this.vertexFeature_);
	        this.vertexFeature_ = null;
	      }
	      dragSegments.length = 0;
	    }
	  }
	  return deleted;
	}
	
	isTouchPointOnPolygonBoundary(){
		
		// if(this.vertexFeature_!=null){
			
		// }
		return this.vertexFeature_!=null
	}
	
	
	setInsertMode(mode){
		
		if(mode || mode=="quick"){
			
			this.insertVertexCondition_ = quickInsertVertexCondition
		}
		else{
			this.insertVertexCondition_ = normalInsertVertexCondition
		}
	}

}



export {
	ZsModify
}