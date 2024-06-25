

// import { createVectorLayerFromURL } from "../helpers/layers";
import {Style, Icon, IconImage, Circle, Stroke} from "ol/style"
// import {merge as mergeObj} from "lodash"



function createStyle2(){
	
	var style = new Style({
		
		image: new Icon({
				src:"/static/logo.jpeg",
				width:16,
				height:16
			}
		),
		// image: new Circle(
		// 	{
		// 		radius:5,
		// 		stroke: new Stroke({color:"red"})
		// 	}
		// )
	})
	
	return function(feat){
		
		return style
	}
}


export function createStyle(name){
	
	const nameToStyle = {
		"redFlag":RedFlagStyle,
		"photograph":PhotographStyle,
		"location":LocationStyle,
		"locationDynamic":LocationDynamicStyle
	}
	
	var styleCreator = nameToStyle[name] || null
	if(styleCreator){
		return styleCreator()
	}
}

function RedFlagStyle(){
	
	// const imgSize = [64,64]
	const width = 32
	const srcUrl = "/static/map/icons/flag-red.png"
	var styleDefault = new Style({
		
		image: new Icon({
				src:srcUrl,
				width:width,
				height:width,
				anchor:[0.5,1]
			}
		),
		// image: new Circle(
		// 	{
		// 		radius:5,
		// 		stroke: new Stroke({color:"red"})
		// 	}
		// )
	})
	return styleDefault
}


function PhotographStyle(){
	
	const width = 32
	const imgSize = [width,width]
	
	const srcUrl = "/static/map/icons/angle-cyan.png"
	var styleDefault = new Style({
		
		image: new Icon({
				src:srcUrl,
				width:16,
				height:16
			}
		),
		// image: new Circle(
		// 	{
		// 		radius:5,
		// 		stroke: new Stroke({color:"red"})
		// 	}
		// )
	})
	
	var PI = 3.14*2/360
	
	return function(feat){
		if(!feat){
			return styleDefault
		}
		var featProps = feat.getProperties()
		var angle = featProps["photoAngle"] || 0
		// angle = angle * 3.14 / 360
		angle = PI * angle
	
		var style = new Style({
			
			image: new Icon({
				// img: canvasElem, 
				src:srcUrl,
				// size:[`${imgSize[0]}px`, `${imgSize[1]}px`],
				// width:`${imgSize[0]}px`,
				// height:`${imgSize[1]}px`,
				width:imgSize[0],
				height:imgSize[1],
				
				
				rotation: angle,
				anchor:[0.5,1]
				}
			),
			// image: new Circle(
			// 	{
			// 		radius:5,
			// 		stroke: new Stroke({color:"red"})
			// 	}
			// )
		})
		return style
	}
}


function LocationDynamicStyle(){
	
	const width = 24
	const imgSize = [width,width]
	
	const srcUrl = "/static/map/icons/gps-down-blue.png"
	var styleDefault = new Style({
		
		image: new Icon({
				src:srcUrl,
				width:imgSize[0],
				height:imgSize[1],
				anchor:[0.5,1]
			}
		),
		// image: new Circle(
		// 	{
		// 		radius:5,
		// 		stroke: new Stroke({color:"red"})
		// 	}
		// )
	})
	
	var PI = 3.14*2/360
	
	return function(feat){
		if(!feat){
			return styleDefault
		}
		var featProps = feat.getProperties()
		var angle = featProps["orientation"] || 0
		// angle = angle * 3.14 / 360
		angle = PI * angle
	
		var style = new Style({
			
			image: new Icon({
				// img: canvasElem, 
				src:srcUrl,
				// size:[`${imgSize[0]}px`, `${imgSize[1]}px`],
				// width:`${imgSize[0]}px`,
				// height:`${imgSize[1]}px`,
				width:imgSize[0],
				height:imgSize[1],
				
				
				rotation: angle,
				anchor:[0.5,1]
				}
			),
			// image: new Circle(
			// 	{
			// 		radius:5,
			// 		stroke: new Stroke({color:"red"})
			// 	}
			// )
		})
		return style
	}
}


function LocationStyle(){
	
	const width = 24
	const imgSize = [width,width]
	
	const srcUrl = "/static/map/icons/gps-down-blue.png"
	var styleDefault = new Style({
		
		image: new Icon({
				src:srcUrl,
				width:imgSize[0],
				height:imgSize[1],
				anchor:[0.5,1]
			}
		),
		// image: new Circle(
		// 	{
		// 		radius:5,
		// 		stroke: new Stroke({color:"red"})
		// 	}
		// )
	})
	
	return styleDefault
	
	// var PI = 3.14*2/360
	
	// return function(feat){
	// 	if(!feat){
	// 		return styleDefault
	// 	}
	// 	var featProps = feat.getProperties()
	// 	var angle = featProps["orientation"] || 0
	// 	// angle = angle * 3.14 / 360
	// 	angle = PI * angle
	
	// 	var style = new Style({
			
	// 		image: new Icon({
	// 			// img: canvasElem, 
	// 			src:srcUrl,
	// 			// size:[`${imgSize[0]}px`, `${imgSize[1]}px`],
	// 			// width:`${imgSize[0]}px`,
	// 			// height:`${imgSize[1]}px`,
	// 			width:imgSize[0],
	// 			height:imgSize[1],
				
				
	// 			rotation: angle,
	// 			anchor:[0.5,1]
	// 			}
	// 		),
	// 		// image: new Circle(
	// 		// 	{
	// 		// 		radius:5,
	// 		// 		stroke: new Stroke({color:"red"})
	// 		// 	}
	// 		// )
	// 	})
	// 	return style
	// }
}