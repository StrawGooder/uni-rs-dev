import {setup as setupMapSpatialQuery} from "./spatialQuery.js";
import {Map} from "ol"

// export function setupMapExtend(olclass){
// 	setupTraverse(olclass)
// }


function setupExtend(){
	
	setupMapSpatialQuery(Map)
	
}

setupExtend()