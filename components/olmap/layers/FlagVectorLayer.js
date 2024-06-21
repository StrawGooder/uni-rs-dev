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


function createStyle(){
	
	const imgSize = [64,64]
	const srcUrl = "/static/map/pngs/flag-red.png"
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
	return styleDefault
	
}


export {createStyle}