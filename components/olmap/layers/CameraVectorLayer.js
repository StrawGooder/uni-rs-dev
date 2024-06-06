// import { createVectorLayerFromURL } from "../helpers/layers";
import {Style, Icon, IconImage, Circle, Stroke} from "ol/style"
// import {merge as mergeObj} from "lodash"


function createStyle(){
	
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



export {createStyle}