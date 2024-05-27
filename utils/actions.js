// import {getLocalStore} from "../stores/localStores"

// temp alernative
function getLocalStore(){
	
}

function timeToInt(t, ceil){

    ceil = ceil || true

    return parseInt(Math.ceil(t))

}


class Colddown{


    constructor(name, time, interval, callback){
        // this.val = val
        this.name = name
        this.time = time || 1000
        this.interval = interval || 1000
        this.callback = callback || null
        this.reset()
        this.restore()
        
    }


    _bootTimeout(){
 

        if(!this.active)
        {

            this.active = true

            // this.start_time = timeToInt(Date.now())

            // this.end_time = this.start_time + this.time

            if(this.start_time<0)
            {

                this.start_time = timeToInt(Date.now())

                this.end_time = this.start_time + this.time  
            }

            // setTimeout(
            //     ()=>{this.release()}, 
            //     this.time
            // )
            this.store()
            this._step()
        }

        // console.log(`info | cding ${this.name}`)

    }


    reboot(){

        if(!this.active)
        {

            this.active = true

            // this.start_time = timeToInt(Date.now())
            // this.end_time = this.start_time + this.time

            setTimeout(
                ()=>{this.release()}, 
                this.left()
            )

            this.store()

        }

    }


    boot(){

        this._bootTimeout()
    }


    _step(){

        console.log(`info | cding ${this.name}`)
        if(this.isEnd())
        {
            this.release()
        }
        else
        {
            setTimeout(()=>{this._step()}, this.interval)
        }
    }

    release(){

        this.reset()
    }


    isEnd(){

        return this.left()<0
    }

    isRunning(){

        return this.running
    }

    isBusy(){

        if(this.left()<0)
        {
            this.reset()
        }
        else
        {
            this.active = true
        }

        return this.active
    }


    left(precision){
        // default second
        // if(this.end_time<0)
        // {
        //     return -1
        // }

        var left = this.end_time - Date.now()

        // console.log(`colddown left ${left} `, this.end_time)
        return left
    }


    reset(){

        this.active = false
        this.timer = null

        this.start_time = -1
        // this.end_time = Date.now() + 1e3 * 3600
        this.end_time = -1

    }


    store(){

        // save
        var data = this._packageData()

        var locSto = getLocalStore("counter")

        locSto.saveItem(this.name, data)

    }

    _packageData(){

        var data = {

            "start_time":this.start_time,
            "end_time":this.end_time
        }

        // data = JSON.stringify(data)

        return data

    }


    restore(){

        var locSto = getLocalStore("counter")

        var data = locSto.getItem( this.name )
        
        this._unpackageData(data)

        if(this.isEnd()){
            this.reset()
        }

        console.log(`info | time`, data)

    }


    _unpackageData(data){

        if(!data){
            return
        }

        // data = JSON.parse(data)
        this.start_time = data["start_time"]
        this.end_time = data["end_time"]

    }


}


class Stabilizer{

    constructor(callfunc, time, opts){

        this.curVal = null
		this.prevVal = null
        
        this.time = time || 1000
        this.callfunc = callfunc
        // this.active = false

        // this.isChange=true
        this.change = 0
        this.timer = null
		
		this.opts = opts || {
			whenRejectedStop:true,
			retryTimes:1,
		}
		
		this.event_listener_map = {
			"rejected":[],
			"reached":[],
		}
		
		// this.retryCount = 0
		
		
    }

    _bootTimeout(){

        // this.active = false
        // var inst = this
        if(this.timer!=null)return 
		
		this.timer = setTimeout(
			()=>{this.tryEmit()}, 
			this.time
		)

    }

    update(val){

        // this.prevVal = this.curVal
        this._bootTimeout()
		this.change++
		this.prevVal = this.curVal
		this.curVal = val
		
		// this._bootTimeout()
    }
	
    tryEmit(){

        // var same = this.prevVal == this.curVal
        if(this.isContentTriggerCondition())
		{
            this.emit()
			return true
        }
 
	
		this.activeListener("rejected")
		
		this.reset()
		if( this.canToNextRound())
		{
			// this.reset()
			
			this._bootTimeout()	
		}	
		// else{
		// 	this.reset()
		// }
				
		
		
		return false       
    }
	
	addListener(event_name, callfunc){
		
		if(!callfunc)return
		
		var func_list = this.event_listener_map[event_name]
		if(func_list==undefined || func_list==null)
		{
			func_list = []
		}
		func_list.push(callfunc)
		this.event_listener_map[event_name] = func_list
		// if(event_name=="rejected")
		// {
		// 	this.event_listener_map[event_name].push(callfunc)
		// }
	}
	
	removeListener(event_name, callfunc){
		
		if(event_name=="rejected")
		{
			
			this.event_listener_map[event_name].push(callfunc)
		}
		
		var func_list = event_listener_map[event_name]
		func_num = func_list.length
		var found_ind = -1
		for(var i = 0 ; i<func_num;i++)
		{
			if(func_list[i]===callfunc)
			{
				found_ind=i
				break
			}
		}
		
		if(found_ind>-1)
		{
			func_list = func_list.slice(0, found_ind) + func_list.slice(found_ind+1, func_num)
			this.event_listener_map[event_name] = func_list
		}
	}
	
	activeListener(event_name){
		
		var func_list = this.event_listener_map[event_name]
		var _this = this
		if( !Array.isArray(func_list)) return
		func_list.forEach(
			(f)=>{
				f(
					_this._callback_func_args || this.curVal
				)
			}
		)
	}

    isContentTriggerCondition(){
        return this.change<1
    }
	
	canToNextRound(){
		
		return !this.opts["whenRejectedStop"] || this.change<this.opts["retryTimes"]
	}

    reset(){

        this.timer = null
        // this.change = 0

    }
	
    emit(){

        // this.active = true
        this.reset()
        this.callfunc(this.curVal)

    }
	
}


class TimesTrigger extends Stabilizer {
	
	constructor(callfunc, time, opts){
		
		super(callfunc, time, opts)
		// this.opts = opts || {}
		this.max_times = this.opts["times"] || 1
		this.opts["whenRejectedStop"] = true
		this.count = 0
		this.old_count = 0
		
		this._callback_func_args = null
	}
	
	isContentTriggerCondition(){
		
		return this.count==this.max_times
	}
	
	isLargerTriggerCondition(){
		
		return this.count>this.max_times
	}
	
	isLessTriggerCondition(){
		return this.count<this.max_times
	}
	
	setArgs(args){
		
		// temp process
		// bug
		
		// when the clicked action was triggered quickly on several times
		// and the clicked objects isnt same,
		// call reset() handle this case
		// rejected to emit callback
		if(this._callback_func_args!=null && this._callback_func_args!=args)
		{
			this.reset()
			return
		}
		this._callback_func_args = args
	}
	
	
	increase(){
		
		super.update(1)
		this.count++
	}
	
	tryEmit(){
		
		var listn_event_name = null
		if(this.isLargerTriggerCondition())
		{
			listn_event_name = "largerrejected"
		}
		else if(this.isLessTriggerCondition())
		{
			listn_event_name = "lessrejected"
		}
		if(listn_event_name!=null)this.activeListener(listn_event_name)
		
		super.tryEmit()
		
	}

    emit(){

        // this.active = true
        
        this.callfunc(this._callback_func_args)
		this.reset()
    }
	
	reset(){
	
	    this.timer = null
		this._callback_func_args = null
		this.old_count = this.count
		this.count = 0
		
	}
	
}


class OnceStabilizer extends Stabilizer{
	
}

class LongTimeMonitor extends OnceStabilizer{
	
	// constructor(){
		
	// }

	isContentTriggerCondition(){
		
	    return this.curVal == this.prevVal
	}
}


class Delay{

    constructor(callfunc, time){
  
        this.callfunc = callfunc
        this.time = time || 1000

        this.func_args = []

        const fix_args_len = 2
        const func_args_num = arguments.length - fix_args_len

        for(var i = fix_args_len; i< func_args_num; i++){

            this.func_args.push(arguments[i])
        }

    }

    boot(){

        this._bootTimeout()
    }

    _bootTimeout(){

        // var inst = this
        // setTimeout(function(){
        //     inst.emit()
        // }, this.time)

        // note:
        // arrow func: this is current object inst
        // otherwise, other function as anonymouse function
        // this isn't not current object
        setTimeout(()=>{

            this.emit()

        }, 
            this.time
        )
    }

    emit(){

        this.callfunc()
    }
}



const Delayer = Delay
const TimeCounter = Colddown
const ColddownCounter = Colddown

function getActionTrigger(type){

    if("Colddown"==type){
        return Colddown
    }
    else if("Delay"==type){
        return Delay
    }
    else if("Stabilizer"==type ||"Debounce"==type){

        return Stabilizer
    }
	else if("LongTimeMonitor"){
		return LongTimeMonitor
	}
	else if ("TimesTrigger"==type){
		return TimesTrigger
	}
    return null
}


function createActionTrigger(type, callfunc, time, opts){
	
	var cls = getActionTrigger(type)
	return new cls(callfunc, time, opts)
}


export {
    // Colddown,
    // Stabilizer, 
    // Delay,
    // Delayer,
    // TimeCounter,
    // ColddownCounter,
	createActionTrigger,
    // getActionTrigger
}