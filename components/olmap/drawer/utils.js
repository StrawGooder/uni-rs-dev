
const epsilon = 1e-6

export function determineQuadrant(pointA, pointC){
	
		const centroid = pointC

		const dx = pointA[0] - centroid[0]
		const dy = pointA[1] - centroid[1]

		var district = 0
		
		// if(dx>=0 && dy>=0){

		// 	district = 1 
		// }
		// else if(dx<=0 && dy>=0){

		// 	district = 2
		// }
		// else if(dx<=0 && dy<=0){

		// 	district = 3
		// }
		// else if(dx>=0 && dy<=0){

		// 	district = 4
		// }

		if(dx>0 && dy>0){

			district = 1 
		}
		else if(dx<0 && dy>0){

			district = 2
		}
		else if(dx<0 && dy<0){

			district = 3
		}
		else if(dx>0 && dy<0){

			district = 4
		}
		
		if(dy==0){
			if(dx>0){
				district = 5
			}
			else if(dx<0){
				district = 6
			}
		}
		
		if(dx==0){
			if(dy>0){
				district = 7
			}
			else if(dy<0){
				district = 8
			}
		}
		
		// console.log("debug-zsolmap metrics dx,dy ", dx, dy)
		return district
	
}


// distance
// dir(Number): 1,2...4 represents the Quadrant of coordinate

export function movePoint(point, offset, dir){
	
	var sy = point[1],
	sx = point[0],
	offsetX,
	offsetY
	if(Array.isArray(offset)){
		offsetX = offset[0]
		offsetY = offset[1]
	}
	else{
		offsetX = offset
		offsetY = offset
	}

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
	// line is x axis direction
	else if(dir == 5){
		sx = sx + offsetX
	}
	else if(dir == 6){
		sx = sx - offsetX
	}
	// line is y axis direction
	else if(dir == 7){
		sy = sy + offsetY	
	}
	else if(dir == 8){
		sy = sy - offsetY	
	}
	// else{
	// 	sx = sx + offsetX
	// 	sy = sy + offsetY
	// }
	
	// console.log("debug-zsolmap metrics quad ", dir)
	return [sx,sy]

}


export function computeSlopeK(pointA, pointB){

		const dx = pointA[0] - pointB[0]
		const dy = pointA[1] - pointB[1] 
		
		if(dx<epsilon && dx>=0){
			// return "unlimited"
			return 2^32
		}
		
		return dy/dx
	
}

export function computePerpendicularSlotK(pointA, pointB){
	
		const dx = pointA[0] - pointB[0]
		const dy = pointA[1] - pointB[1] 
		
		// if(dx<1e-5 && dx>=0){
		// 	return 0
		// }
		if(dy<epsilon && dy>=0){
			return 2^32
		}
		
		var k = dx/dy
		
		// if(dy<epsilon && dy>=0){
			
		// }
		if(k>0){
			return -k
		}
		
		return k
		// if(dx>0 && dy>0){
		// 	return -k
		// }
		
		// else if(dx>0 && dy<0){
		// 	return k
		// }
		
	
}