
class Source {
	
	constructor(data){
		
		this._data = data || null
		
	}
	
	setData(data){
		
		this._data = data
	}
	
	getData(){
		return this._data
	}

}

class VectorSource extends Source {
	
	constructor(data){
		
		this._data = data || null
		
		this._data_type = "vector"
		
		this.cache_transform_to = {
			"geojson":null,
			"wkt":null
		}
		
	}
	
	getType(){
		return this._data_type
	}
	
	toGeoJson(){
		
	}
	
	toWKT(){
		
	}
}


// class TDTSource extends Source {
	
// }


class TDTVectorSource extends VectorSource {
	
	
	toGeoJson(){
		
	}
	
	toWKT(){
		
	}
	
}

const _factory_cls_map = {
	// "TDT":TDTSource,
	"TDTVector":TDTVectorSource,
}

function createDataSource(name, data){
	
	var kls = _factory_cls_map[name] || null
	
	if(!kls){ throw new Error(`not found ${name}Source`) }
	
	return new kls(data)
	
}

export {
	createDataSource
}