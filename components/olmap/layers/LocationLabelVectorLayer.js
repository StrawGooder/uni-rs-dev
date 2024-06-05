// import { createVectorLayerFromURL } from "../helpers/layers";
import {Style, IconImage} from "ol/style"
// import {merge as mergeObj} from "lodash"


function createStyle(){
	
	var style = new Style({
		
		image: new IconImage({
			url:""
		})
	})
	
	return (feat)=>{
		
		return style
	}
}



export {createStyle}