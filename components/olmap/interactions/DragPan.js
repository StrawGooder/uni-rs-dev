import {DragPan} from "ol/interaction"


export class ZsDragPan extends DragPan{
	
	constructor(opts){
		
		super(opts)
		
		this.condition_init_ = this.condition_
		
		this.handleDragEvent_init = this.handleDragEvent
	}
	
	setEnabled(val){
		
		if(!val){
			// this.lastCentroid = null
			// this.condition_ = (evt)=>{return false}
			this.handleDragEvent = function(evt){return true}.bind(this)
			
		}
		else{
			// this.restoreInputCondition()
			this.handleDragEvent = this.handleDragEvent_init
		}
		
	}
	
	restoreInputCondition(){
		// this.condition_ = this.condition_init_
		this.handleDragEvent = this.handleDragEvent_init
	}
	
	// saveInputCondition(){
		
	// }
}