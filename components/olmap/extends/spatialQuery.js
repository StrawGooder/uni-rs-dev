import { bufferExtent,extentToContour } from "../helpers/geo"

export function setup(olclass){
	
	extendForEachFeatureAtPixel(olclass)
	extendGetFeaturesAtPixel(olclass)
}



// function forEachFeatureAtPixel(){
	
	
// }

// function getFeaturesAtPixel(){
	
	
// }

function extendForEachFeatureAtPixel(olclass){
	
	olclass.prototype.xforEachFeatureAtPixel = function(pixelPos, callback){
	

		// var feats = this.map.getFeaturesAtPixel(evt.pixel)
							
		// var pixelPos = evt.pixel
		// var geomPos = evt.coordinate
		// const pixOffset = 0
		// var feats = this.map.getFeaturesAtPixel(
		
		// [pixelPos[0] + pixOffset, pixelPos[1] + pixOffset ]
		// )
		
		const geomPosInter = this.getCoordinateFromPixelInternal(pixelPos)
		const geomPos = geomPosInter
		// var diffGeomPos = [geomPosInter[0] - geomPos[0], geomPosInter[1] - geomPos[1]]
		// console.log("debug-zsolmap forEachFeatureAtPixel filter", geomPosInter, geomPos, diffGeomPos, pixelPos, feats)
		// try to use geometry coordinate
		const layers = this.getAllLayers()
		const lyrTotal = layers.length
		// var lastLyr = layers[lyrTotal-2]
		// var lastLyrSrc = lastLyr.getSource()
		const extentSize = 0.01
		const curResol = this.getView().getResolution()
		const distBuf = curResol * 4
		var extentBuf = [geomPos[0],geomPos[1],geomPos[0],geomPos[1]]
		extentBuf = bufferExtent(extentBuf, distBuf)
			
		var i=lyrTotal-1,
		iter_lyr,
		iter_lyr_src;
		
		var lyr_visited = {}
		var collided_feat = null
		
		for(;i>-1;i--)
		{
			iter_lyr = layers[i]
			if(!iter_lyr.getVisible() || collided_feat){
				continue
			}
			
			// console.log("debug-zsolmap ", lyr_visited)
			
			lyr_visited[i] = true
			
			iter_lyr_src = iter_lyr.getSource()
			
			iter_lyr_src.forEachFeatureIntersectingExtent(
				extentBuf,
				(feat)=>{
					
					// console.log("debug-zsolmap forEachFeatureAtPixel filter", feat)
					collided_feat = feat
					const geom = feat.getGeometry()
					// console.log("debug-zsolmap forEachFeatureAtPixel filter", feat, geom)
					
					if(callback && typeof callback === 'function'){
						callback(feat, iter_lyr)
					}
					
					// var  collided = true 
					// collided = intersects(extentBuf, geom.getExtent())
					
					// var geom_sim = geom.getSimplifiedGeometryInternal(curResol*20)
					// addCoordsToLayer(geom_sim.getCoordinates()[0], tempVecLayer, "Polygon")
					
					// geom_sim.getCoordinates()[0][0]
					// var geom_sim_extent = geom_sim.getExtent()
					// var geom_extent = geom.getExtent()
					
					// console.log("debug-zsolmap ", geom_extent, geom_sim_extent,
					// [geom_sim_extent[0]-geom_extent[0],geom_sim_extent[1]-geom_extent[1],
					// geom_sim_extent[2]-geom_extent[2],geom_sim_extent[3]-geom_extent[3],]
					// )
					// addCoordsToLayer(extentToContour(geom_sim_extent), tempVecLayer, "Polygon")
					// var new_feat = new Feature()
					// new_feat.setGeometry(feat)
					// feat = new_feat
					// addFeatures(geom_sim,  tempVecLayer)
					
					// addCoordsToLayer(extentToContour(lastLyr.getExtent()), tempVecLayer, "Polygon")
					
					// collided = intersects(extentBuf, geom_sim.getExtent())
					// var featName = feat.getProperties()["name"]
					// if(collided){
					// 	console.log("debug-zsolmap forEachFeatureAtPixel coliided", featName)
					// }
					// else
					// {
					// 	console.log("debug-zsolmap forEachFeatureAtPixel no collided", featName)
					// }

				}
			)
			
		}
		
	}
	
	// olclass.prototype.xforEachFeatureAtPixel = func

}


function extendGetFeaturesAtPixel(olclass){
	
	olclass.prototype.xgetFeaturesAtPixel = function(pixelPos){
		
		var results = []
		this.xforEachFeatureAtPixel(pixelPos, 
			(feat,layer)=>{
				results.push(feat)
			}
		)
		return results
	}
	
}




