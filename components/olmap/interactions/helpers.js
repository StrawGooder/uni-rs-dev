

export function findInteraction(map, interactionName){
	
	const allIntacts = map.getInteractions()
	
	const findIntactName = interactionName
	const intactNum = allIntacts.getLength()
	for(var i =0; i<intactNum; i++){
		const iterIntact = allIntacts.item(i)
		// console.log("debug-zsolmap interaction ", iterIntact)
		if(iterIntact.__proto__.constructor.name==findIntactName){
			return iterIntact
		}
	}
	
	return null
}

export function hasInteraction(map, interactionName){
	
	return findInteraction(map, interactionName)!=null
}