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
	const srcUrl = "/static/logo.jpeg"
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
	
	const srcImg = new Image(imgSize[0], imgSize[1])
	// srcImg.onloadeddata(
	// 	(data)=>{
			
	// 	}
	// )
	
	srcImg.src = srcUrl
	
	var PI = 3.14*2/360
	
	return function(feat){
		if(!feat){
			return styleDefault
		}
		var featProps = feat.getProperties()
		var angle = featProps["photoAngle"] || 0
		// angle = angle * 3.14 / 360
		angle = PI * angle

		// var canvasElem = document.createElement("canvas")
		// canvasElem.setAttribute("id", "cameraFeature")
		// canvasElem.setAttribute("width", `${imgSize[0]}px`)
		// canvasElem.setAttribute("height", `${imgSize[1]}px`)
		// // const canvasElem = new HTMLCanvasElement()
		// // canvasElem.width= imgSize[0]
		// // canvasElem.height = imgSize[1]
		// const ctx = canvasElem.getContext('2d')

		// // ctx.translate(imgSize[0]/2, imgSize[1]/2)
		// // ctx.rotate(angle)
		// // ctx.translate(-imgSize[0]/2, -imgSize[1]/2)
		
		// ctx.drawImage(srcImg,0,0, 
		// imgSize[0], imgSize[1]
		// )
		
		// ctx.save()
		
		// ctx.scale()
		// ctx.getImageData()
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


export {createStyle}