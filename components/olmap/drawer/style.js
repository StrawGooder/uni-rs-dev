
import {Style, Fill, Stroke,Icon,Text,IconImage} from "ol/style";
import CircleStyle from "ol/style/Circle";
import RegularShape from "ol/style/RegularShape";
// import GeometryType from 'ol/geom/GeometryType.js';
// import {Geometry} from 'ol/geom';
import {Point,LineString,Polygon} from "ol/geom";
import {getArea,getLength, offset as computeOffsetPoint} from "ol/sphere";

import { movePoint,determineQuadrant,computePerpendicularSlotK,computeSlopeK } from "./utils";
// class PolygonDrawStyle extends Style {
	
// 	constructor(opts){
// 		super(opts)
// 	}
	
// 	styleFunction(){
		
// 	}
	
// }
const GeometryType = {
	POINT:"Point",
	POLYGON:"Polygon",
	MULTIPOLYGON:"MultiPolygon",
	LINESTRING:"LineString",
	RING:"LinearRing"
}

const areaScale = 1
const lenScale = 100

const icon_width = 16

function createCrossHairImageStyle( icon_size){
	
	icon_size = icon_size || [icon_width, icon_width]
	
	return new Icon(
			{
				src: "/static/crosshair.svg", 
				color:"red", 
				// size:"36",
				width:icon_size[0],
				height:icon_size[1],
			} 
		)
}

function makeBasePolygonDrawStyle(){
	
	const borderWidth = 2
	var dropped_style = new Style(
			{
				// fill: new Fill({color:"#ffffffa"}),
				stroke: new Stroke({color:"pink", width:borderWidth}),
				image:new CircleStyle(
							{
								radius:4,
								stroke:new Stroke({color:"orange"})
							}
				),
			}
	)
	
	// var icon_width = 16
	var float_style = new Style(
			{
				// fill: new Fill({color:"#ffffffa"}),
				stroke: new Stroke({color:"blue", width:borderWidth}),
				// image:new CircleStyle(
				// 			{
				// 				radius:5,
				// 				stroke:new Stroke({color:"red"})
				// 			}
				// ),
				image: createCrossHairImageStyle()
			}
	)
	
	return (feat)=>{
		
		var gemo = feat.getGeometry()
		// console.log("debug-ol-style ", gemo.getType(), GeometryType.POINT, feat.getProperties())
		var gemo_type = gemo.getType()
		// console.log("debug-ol-style ", gemo.getType())
		if(gemo_type == GeometryType.POINT)
		{
			var isDropped = feat.getProperties()["isDropped"]
			
			if(isDropped==1)
			{
				return dropped_style
			}
		}

		return float_style
	}
}


function makeMetricsDrawStyle(){
	
	const style = new Style({
	  fill: new Fill({
		color: 'rgba(255, 255, 255, 0.2)',
	  }),
	  stroke: new Stroke({
		color: 'rgba(0, 0, 0, 0.5)',
		lineDash: [10, 10],
		width: 2,
	  }),
	  image: new CircleStyle({
		radius: 5,
		stroke: new Stroke({
		  color: 'rgba(0, 0, 0, 0.7)',
		}),
		fill: new Fill({
		  color: 'rgba(255, 255, 255, 0.2)',
		}),
	  }),
	});


	const labelStyle = new Style({
	  text: new Text({
		font: '14px Calibri,sans-serif',
		fill: new Fill({
		  color: 'rgba(255, 255, 255, 1)',
		}),
		backgroundFill: new Fill({
		  color: 'rgba(0, 0, 0, 0.7)',
		}),
		padding: [3, 3, 3, 3],
		textBaseline: 'bottom',
		offsetY: -15,
		text:""
	  }),
	 //  image: new RegularShape({
		// radius: 8,
		// points: 3,
		// angle: Math.PI,
		// displacement: [0, 10],
		// fill: new Fill({
		//   color: 'rgba(0, 0, 0, 0.7)',
		// }),
	 //  }),
	});
	
	const tipStyle = new Style({
	  text: new Text({
		font: '12px Calibri,sans-serif',
		fill: new Fill({
		  color: 'rgba(255, 255, 255, 1)',
		}),
		backgroundFill: new Fill({
		  color: 'rgba(0, 0, 0, 0.4)',
		}),
		padding: [2, 2, 2, 2],
		textAlign: 'left',
		offsetX: 15,
	  }),
	});

	const segmentStyle = new Style({
	  text: new Text({
		font: '12px Calibri,sans-serif',
		fill: new Fill({
		  color: 'rgba(255, 255, 255, 1)',
		}),
		backgroundFill: new Fill({
		  color: 'rgba(0, 0, 0, 0.4)',
		}),
		padding: [2, 2, 2, 2],
		textBaseline: 'bottom',
		// offsetY: -12,
	  }),
	 //  image: new RegularShape({
		// radius: 6,
		// points: 3,
		// angle: Math.PI,
		// displacement: [0, 8],
		// fill: new Fill({
		//   color: 'rgba(0, 0, 0, 0.4)',
		// }),
	 //  }),
	});
	const segmentStyles = [segmentStyle];

	const modifyStyle = new Style({
	  image: new CircleStyle({
		radius: 5,
		stroke: new Stroke({
		  color: 'rgba(0, 0, 0, 0.7)',
		}),
		fill: new Fill({
		  color: 'rgba(0, 0, 0, 0.4)',
		}),
	  }),
	  text: new Text({
		text: 'Drag to modify',
		font: '12px Calibri,sans-serif',
		fill: new Fill({
		  color: 'rgba(255, 255, 255, 1)',
		}),
		backgroundFill: new Fill({
		  color: 'rgba(0, 0, 0, 0.7)',
		}),
		padding: [2, 2, 2, 2],
		textAlign: 'left',
		offsetX: 15,
	  }),
	});

	// bug: use the function 'getLength' and 'getArea' to get the
	// geometry statistics, the returned value unit is weird
	// getLength : need to multi 100 matching km unit
	// getArea : need to multi 10 matching 10000 km2 unit
	const formatLength = function (line) {
		const scale = 100
	  const length = getLength(line) * scale;
	  // bug: need to multi 100 matching km unit
	  // length = length * 100
	  let output;
	 //  if (length > 100) {
		// output = Math.round((length / 1000) * 100) / 100 + ' km';
	 //  } else {
		// output = Math.round(length * 100) / 100 + ' m';
	 //  }
	  if (length < 1) {
		output = Math.round((length / 1000) * 100) / 100 + ' m';
	  } else {
		output = Math.round(length * 100) / 100 + ' km';
	  }
	  return output;
	};

	const formatArea2 = function (x) {
		const scale = 10
	  const area = x * scale
	  // bug: need to multi 10 matching 10000 km2 unit
	  let output;
	 //  if (area > 10000) {
		// output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
	 //  } else {
		// output = Math.round(area * 100) / 100 + ' m\xB2';
	 //  }
	
		if (area > 10000) {
				output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
		} else {
				output = Math.round(area*10000 * 100) / 100 + ' km\xB2';
				// output = Math.round(area * 100) / 100 + ' km\xB2';
		}
	  
	  return output;
	};
	
	const formatArea = function (polygon) {
	  const area = formatArea2(getArea(polygon));
	};
	
	const geomStatInfoMap = new Map()
	
	function styleFunction(feature, segments, drawType, tip) {
		

		const styles = [];
		const geometry = feature.getGeometry();
		const type = geometry.getType();
		let metricInfoShowPos, label, line, contourLen = 0;
		var area=0
		var centroid;
		var pointTotal = 0
		
		if (!drawType || drawType === type || type === 'Point') {
			styles.push(style);
			if (type === 'Polygon') {
			  metricInfoShowPos = geometry.getInteriorPoint();
			  centroid = geometry.getInteriorPoint().getCoordinates()
			  // label = formatArea(geometry);
			  var points = geometry.getCoordinates()[0]
			  line = new LineString(points);
			  pointTotal = points.length
			  if(pointTotal<=3)
			  {
				  label = ""
			  }else
			  {	
				  area = getArea(geometry)
				  label = formatArea2(area)
				  // label = formatArea(geometry);
			  }
	
			  contourLen = formatLength(line);
			  
			  metricInfoShowPos = points[pointTotal-2]
			  
			} 
			else if (type === 'LineString') {
			  
			  // const points = geometry.getCoordinates()
			  // const firstPoint = points[0]
			  // const lastPoint = points[points.length-1]
			  // points.push(firstPoint)
			  // // console.log("Debug-zsolmap ", points)
			  // var polyGeom = new LineString(points);
			  // label = formatLength(polyGeom);
			  // point = new Point(lastPoint);
			  // line = geometry;
			  // contourLen = geometry.getLength()
			  return styles
			}
		}
		
		// var offsetY = 0.2 * Math.sqrt(area)
		// var fakeOriginPos = [0,0]

		if (segments && line) {
	
			var contLenVal = line.getLength()*1e6/pointTotal*0.025
			var refOffsetPos = computeOffsetPoint([0,0], contLenVal, 0)
			// var bufDist = Math.sqrt( refOffsetPos[0]**2 + refOffsetPos[1]**2)
			var bufDist = refOffsetPos[0] + refOffsetPos[1]
			
			let count = 0;
			line.forEachSegment(function (a, b) {
			  const segment = new LineString([a, b]);
			  const label = formatLength(segment);
			  if (segmentStyles.length - 1 < count) {
				segmentStyles.push(segmentStyle.clone());
			  }
			  
			  // midPointOnLine 
			  var labelShowPos = segment.getCoordinateAt(0.5)
			  
			  var k = computeSlopeK(a, b)
		
			  var dist = bufDist
			  var longSideLen = Math.sqrt( (1+k*k) )
			  var dx = dist * k/longSideLen
			  var dy = dist * 1/longSideLen
			  
			  // var dx = dist * 1/longSideLen
			  // var dy = dist * k/longSideLen
			  dx = Math.abs(dx)
			  dy = Math.abs(dy)
			  // var dy = 
			  // var offsetY = 0.2 * Math.sqrt(area)
			  var quadrant = determineQuadrant(labelShowPos, centroid)
			  // labelShowPos = movePoint(labelShowPos, offsetY, quadrant)
			  labelShowPos = movePoint(labelShowPos, [dx,dy], quadrant)
			  
			  // console.log("debug-zsolmap slope k ", k, bufDist, quadrant)
			  // console.log("debug-zsolmap ================================")
			  // const segmentPoint = new Point(labelShowPos);
			  
			  segmentStyles[count].setGeometry(new Point(labelShowPos));
			  segmentStyles[count].getText().setText(label);
			  styles.push(segmentStyles[count]);
			  count++;
			});
			
		}
		
		if (label || contourLen) {
			
			// place on last point
			labelStyle.setGeometry( new Point(metricInfoShowPos) );
			// labelStyle.getText().setText(label);
			
			labelStyle.getText().setText(`area:${label||0}\ncontour:${contourLen}`);
			
			if(determineQuadrant(metricInfoShowPos, centroid)>2){
				labelStyle.getText().setOffsetY(45)
			}
			else{
				labelStyle.getText().setOffsetY(-15)
			}
			
			// place on centroid
			// labelStyle.setGeometry( new Point(centroid) );
			// labelStyle.getText().setText(`0`);
			// console.log("debug-zsolmap ", labelStyle)
			// labelStyle.setText(label);
			styles.push(labelStyle);
		}
		// if (
		// tip &&
		// type === 'Point' &&
		// !modify.getOverlay().getSource().getFeatures().length
		// ) {
		// tipPoint = geometry;
		// tipStyle.getText().setText(tip);
		// styles.push(tipStyle);
		// }
			return styles;
		}
	
	return styleFunction
}


function makePointDrawStyle(){
	
	const style = new Style({
		 //  image: new CircleStyle({
			// radius: 3,
			// stroke: new Stroke({
			//   color: 'red',
			// }),
			// fill: new Fill({
			//   color: 'rgba(255, 255, 255, 0.2)',
			// }),
		 //  }),
		  image: createCrossHairImageStyle()
		}
	);
	
	return (feat)=>{ return style }
	
}


function makeDoodleDrawStyle(){
	
	const style = new Style(
		{
			stroke: new Stroke({color:"red", width:5}),
			image: new CircleStyle({radius:5, stroke:new Stroke({color:"red"})})
		}
	)
	return function(feat){
		return style
	}
}


const themeToStyle_ = {
	"base":makeBasePolygonDrawStyle,
	"metric":makeMetricsDrawStyle,
	"point":makePointDrawStyle,
	"doodle":makeDoodleDrawStyle,
}

export function createStyleByTheme(name){
	// if(type=="base"){
	// 	return makeBasePolygonDrawStyle()
	// }
	// else if(type=="metric"){
	// 	return makeMetricsDrawStyle()
	// }
	// return makeBasePolygonDrawStyle()
	
	var styleObj = themeToStyle_[name] || makeBasePolygonDrawStyle
	if(typeof styleObj == 'function'){
		styleObj = styleObj()
	}
	return styleObj
}

export function registerDrawStyleTheme(name, style){
	if(!themeToStyle_[name]){
		themeToStyle_[name] = style
		return true
	}
	else{
		console.log(`warning-zsolmap draw style theme '{name}' has existed`)
		return false
	}
}

export function unregisterDrawStyleTheme(name){
	delete themeToStyle_[name]
}