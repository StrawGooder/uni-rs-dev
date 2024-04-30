import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import {MultiPolygon,Point} from "ol/geom"
import {GeoJSON} from "ol/format"

const _geom_type_to_cls = {
	"MultiPolygon":MultiPolygon,
	"Point":Point
}

function createVectorLayerFromDataObj(data_obj){
	
	var iter_feat_data 
	
	var data = data_obj["features"]
	var i = 0
	var geom_cls = null;
	var geom_type;
	var geom;
	var warning_msg = ""
	var new_feat;
	var new_feature_array = []
	
	for(i in data)
	{
		iter_feat_data = data[i]
		
		geom_type = iter_feat_data["geometry"]["type"]
		geom_cls = _geom_type_to_cls[geom_type]
		if(!geom_cls)
		{
			warning_msg = `attemp create layer from geojson data, but got unknown geometry type ${geom_type} on ${i+1}th feature`
			// throw new Error(warning_msg)
			console.log("warning-ol ", warning_msg)
		}
		
		geom = new geom_cls(iter_feat_data["geometry"]["coordinates"])
		// geom.setCoordinates( iter_feat_data["geometry"]["coordinates"][0][0] )
		
		new_feat = new Feature()
		new_feat.setGeometry(geom)
		
		new_feature_array.push(new_feat)
	}
	
	var source_obj = new VectorSource()
	source_obj.addFeatures(new_feature_array)
	
	var lyr = new VectorLayer(
		{
			source: source_obj
		}
	)
	// lyr.addFeatures(new_feature_array)
	
	return lyr
	
}

export {
	createVectorLayerFromDataObj
}