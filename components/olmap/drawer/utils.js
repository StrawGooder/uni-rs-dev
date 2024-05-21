

export function determineQuadrant(pointA, pointC){
	
		const centroid = pointC

		const dx = pointA[0] - centroid[0]
		const dy = pointA[1] - centroid[1]

		var district = 0
		
		if(dx>=0 && dy>=0){

			district = 1 
		}
		else if(dx<0 && dy>=0){

			district = 2
		}
		else if(dx<0 && dy<=0){

			district = 3
		}
		else if(dx>0 && dy<=0){

			district = 4
		}
		
		return district
	
}


// dir(Number): 1,2...4 represents the Quadrant of coordinate
export function movePoint(point, offset, dir){
	
	var sy = point[1],
	sx = point[0],
	offsetX = offset, 
	offsetY = offset
	if(dir==1){
		sx = sx + offsetX
		sy = sy + offsetY
	}
	else if (dir==2){
		sx = sx - offsetX
		sy = sy + offsetY
	}
	else if (dir==3){
		sx = sx - offsetX
		sy = sy - offsetY		
	}
	else if (dir==4){
		sx = sx + offsetX
		sy = sy - offsetY		
	}
	else{
		sx = sx + offsetX
		sy = sy + offsetY
	}
	
	console.log("debug-zsolmap metrics movePoint ", dir)
	return [sx,sy]

}