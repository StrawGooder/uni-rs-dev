function computeResolution(geo_len, view_len){
	
	// var resol = geo_len/view_len
	
	return geo_len/view_len

}

function computeResolutionByExtent(geo_extent, view_size, mode){
	mode = mode || "longer"
	var geo_lat_len = Math.abs( geo_extent[3] -  geo_extent[1] )
	var geo_lot_len = Math.abs( geo_extent[2] -  geo_extent[0] )
	var view_width = view_size[0]
	var view_height = view_size[1]
	
	var ref_geo_len;
	var ref_view_len; 
	
	// var max_geo_len
	// var min_geo_len
	if(mode=="shorter")
	{	
		if(geo_lat_len>geo_lot_len)
		{
			ref_geo_len = geo_lot_len
			ref_view_len = view_width
		}
		else
		{
			ref_geo_len = geo_lat_len
			ref_view_len = view_height
		}
	}
	else if(mode=="longer")
	{
		if(geo_lat_len>geo_lot_len)
		{
			
			ref_geo_len = geo_lat_len
			ref_view_len = view_height
			console.log("debug-zsolmap compute resolution by height", )
		}
		else
		{
			ref_geo_len = geo_lot_len
			ref_view_len = view_width
			console.log("debug-zsolmap compute resolution by width", )
		}	
		
	}
	
	return computeResolution(ref_geo_len, ref_view_len)
}

function computeCenter(extent){
	
	return [(extent[0] + extent[2])/2., (extent[1] + extent[3])/2.]
}

export {
	computeCenter,
	computeResolutionByExtent,
	computeResolution,
}