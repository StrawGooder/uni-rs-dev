// import {isPlainObjectInstance, isArray} from '../../utils/objects.js'
import {isPlainObject as isPlainObjectInstance, isMap} from "lodash"
// import {getAppConfig} from "../../configs/app.js"
// const _context = window
// isArray(arg: any)
const _WLS = window.localStorage

// 'getAppConfig' existed the old project (rsisapp) 
// so use mock data to replace it
const _appCfg = {"app_mode":"prod", "client":{"id":1}}
function getAppConfig(query){
		return _appCfg[query]
}

class BaseLocalStore{

    loadItem(key){

        return _WLS.getItem(key)

    }

    saveItem(key, value){

        return _WLS.setItem(key, value)
    }

    removeItem(key){

        _WLS.removeItem(key)
    }

    clear(){
        _WLS.clear()
    }


    _makeupDataSchema(value){

        var data_type = "string"
		
		var data = {"value":value}

		if(isMap(value))
		{
			data_type = "Map"
			// value = 
			var new_val = []
			 value.keys().forEach((k)=>{new_val.push([k,value.get(k)])})
			 data["value"] = new_val
		}
        else if (isPlainObjectInstance(value) || Array.isArray(value))
        {
            data_type = "object"
        }
		data["data_type"] = data_type
        // var data = {"type":data_type, "value":value}

        return JSON.stringify(data)
    }

}


// deprecated
class LocalStoreV1 extends BaseLocalStore{

    constructor(name, scoped){
        super()
        this.name = name
        this.storeKey = name
        this.scoped = scoped || ""
        this.spliter = "_"

        this._data = {

        }

        this._updated = true
    }

    _assembleRouteKey(k){

        return
    }

    loadItem(key){

        // if (this._updated){
        //     t
        // }
        var data = _WLS.getItem(this.storeKey)

        return data[key]
    }

    saveItem(key, value){

        this._data[key] = value

        return _WLS.setItem(this.storeKey, this._data)
    }

    removeItem(key){

        delete this._data[key]

        _WLS.removeItem(this.storeKey, this._data)

    }

    clear(){
        _WLS.clear()
    }

}


class LocalStore extends BaseLocalStore{

    constructor(name, scoped, options){

        super()

        this.name = name || "global"
        // this.storeKeyPrefix = name
        this.scoped = scoped || ""

        this.spliter = "."

        this._data = {}

        this._key_to_data_type = {}

        this._stored_keys = []

        this._updated = true

        // this._key_prefix = name

        this.options = options || {}
        this.obj_save_strategy = this.options["obj_save_strategy"] || "stringify"

        // this._initStoreKey()
        this._key_prefix = null

    }

    _initStoreKey(){

        // console.log(`debug | init local store`);
        // return

        var key_prefix = ""
        var key_prefix_fields = []

        // if(this.scoped && this.scoped!="")
        // {
        //     key_prefix = this.scoped+this.spliter+this.name

        // }
        // else
        // {
        //     key_prefix = this.name
        // }

        // adding  20230915
        // var appCfg = getAppConfig()
        // var appMode = appCfg.get("app_mode")
        // var clientId = appCfg.get("client")["id"]

        var appMode = getAppConfig("app_mode")
        var clientId = getAppConfig("client")["id"]


        key_prefix_fields.push(String(clientId))
        key_prefix_fields.push(appMode)
        // adding  20230915

        key_prefix_fields.push(this.name)

        if(this.scoped && this.scoped!="")
        {
            // key_prefix = this.scoped+this.spliter+this.name
            key_prefix_fields.push(this.scoped)
        }


        if(key_prefix_fields.length>1)
        {
            this._key_prefix = key_prefix_fields.join(this.spliter)
        }
        else
        {
            this._key_prefix = this.name
        }

    }


    _assembleRouteStoreKey(key){

        // temp adding 
        // notes: 
        // when placing 'this._initStoreKey' in
        // the LocalStore class 'constructor' function 
        // , a normal initialized appConfig can be got , 
        // because of an exception caused by 
        // a reasonable vue app build order,
        // when project booting
        if (this.key_prefix == null)
        {   
            // this.key_prefix = this.name
            this._initStoreKey()
        }

        if (key && key!=this.name)
        {
            return this._key_prefix+this.spliter+key
        }

        return this._key_prefix
    }


    _constructStoreKey(key){

        // if(!key)
        // {
        //     // name is key, it's the first level route
        //     key = this.name
        // }
        // else if(key==this.name)
        // {
        //     return key
        // }
        // else
        // {

        //     key = this._assembleRouteStoreKey(key)
        // }  

        
        // else if(key==this.name)
        // {
        //     return key
        // }
        
        // $adding 20231015
        if(this._stored_keys.indexOf(key)<0)
        {
            this._stored_keys.push(key)
        }
        // $adding 20231015


        return this._assembleRouteStoreKey(key)
    }


    loadItem(key, parse_to_object){

        // if (this._updated){
        //     t
        // }
        // parse_to_object = parse_to_object || false

        var new_key = this._constructStoreKey(key)

        var data = _WLS.getItem(new_key)

        if(!data)
        {
            console.log(`warning-localstore: attemp to load  '${key}' data in ${this.name}'s LocalStorage, but not found the key`)
            return
        }

        data = JSON.parse(data)
		
		var data_val = data["value"] || data
		if(data["type"]=="Map")
		{
			data_val = new Map(data_val)
		}

        // return data["value"] || data
		return data_val

        // if (this._key_to_data_type[new_key]=="object")
        // {
        //     data = JSON.parse(data)
        // }
        // console.log("info | load item: ", new_key, data)
        // return data
    }
	
	hasItem(key){
		return _WLS.getItem( this._constructStoreKey(key) ) || null
	}


    getItem(key){

        return this.loadItem(key)
    }


    // getItem(key, parse_to_object){
    //     return this.loadItem(key, parse_to_object)
    // }


    saveItem(key, value){

        key = this._constructStoreKey(key)

        // if (isPlainObjectInstance(value) || isArray(value))
        // {
        //     value = JSON.stringify(value)

        //     this._key_to_data_type[key] = "object"
        // }
        // else
        // {
        //     this._key_to_data_type[key] = "scalar"
        // }

        var saveData = this._makeupDataSchema(value)
        // console.log("debug-localstore save locSto item ", key, value)
        // value = value["token"]["code"]
        // return _WLS.setItem(key, value)
        return _WLS.setItem(key, saveData)

    }

    setItem(key,value){
        this.saveItem(key,value)
    }


    removeItem(key){

        key = this._constructStoreKey(key)
        
        try {
            // statements
            _WLS.removeItem(key)

        } catch(e) {
            // statements
            console.log(`warning-localstore: attemp to remove key '${key}' data in ${this.name}'s LocalStorage, but not found`)
            return e
        }

    }

    // adding 20231015
    clear(){
		
		// modify-20240401
		var removeKeys;
		var firstArg;
		if(arguments.length>0)
		{
			firstArg = arguments[0]
			if(Array.isArray(firstArg))
			{
				removeKeys = firstArg
			}
			else
			{
				removeKeys = arguments.slice(0)
			}
		}
		else{
			return
		}
		
		removeKeys.forEach((k)=>{this.removeItem(k)})
		
		// // no work, because implementation issue
  //       for(var i in this._stored_keys)
  //       {
  //           this.removeItem(this._stored_keys[i])
  //       }
    }
	
    // adding 20231015

    // clear(){
    //     // _WLS.clear()
    //     _WLS.clear()
    // }

}

export {
    LocalStore
    // BaseLocalStore
}