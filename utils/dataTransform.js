// import _Loda from "lodash"
import { isNullOrUndefined } from "./objects";

var _Loda = require("lodash")



// for transform the response data of fetching from server
// use case 1: table container , list container pagination query 
function transformData(d, trans_table){

    // modify 20230810
    // var new_d = {},
    // var new_d = updateObject({}, d),
	var new_d = _Loda.update({},d),
        old_v,
        new_k,
        new_v,
        map_config,
        map_key_config,
        map_value_config,
        default_data_type="str",
        old_dat = d,
        map_value;

        // v;
    var judge_data_type;

    for(var old_k in old_dat)
    // for(var old_k in trans_table)

    {
        // console.log(d[k])
        map_config = trans_table[old_k]
        new_k = old_k
        // new_k = null
        old_v = d[old_k]
        new_v = old_v


        if (!isNullOrUndefined(map_config))
        {

            map_key_config = map_config["key"]
            map_value_config = map_config["value"]
            
            if (!isNullOrUndefined( map_key_config ) )
            {
                new_k = map_key_config
            }

            if (!isNullOrUndefined( map_value_config ))
            {

                map_value = map_value_config["map"]

                if (map_value)
                {
                    // console.log("transform map item config:", getClassOf(map_item_config))
                    if (_Loda.isFunction(map_value))
					// if (getClassOf(map_value).name=="Function")
                    {

                        // new_v = map_value_config["map"](old_v, old_k, d)
                        new_v = map_value(old_v, old_k, new_d)

                        // if(isPlainObjectInstance(new_v))
						if(_Loda.isPlainObject(new_v))
                        {
                            // new_d 
                            Object.assign(new_d, new_v)

                        }


                    }
                    // else if(getClassOf(map_value).name=="Object")
					else if(_Loda.isPlainObject(map_value))
                    {

                        // not found responding mapped value
                        // just fallback old value
                        new_v = map_value[old_v] || old_v
                    }
                }

                // if (!map_value && !isNullOrUndefined(map_value_config["map"][new_v]) ){
                    
                //     // if(isBool(new_v))
                //     // {
                //     //     parse
                //     // }
                //     judge_data_type = isBool(new_v)

                //     if(k=="is_online")
                //     {
                //         console.log("resp transform key: ", k, new_v)
                //     }
                    
                //     new_v = map_value_config["map"][new_v]
                // }  
            }
        }
        

        // if(new_k)
        // {
        //     new_d[new_k] =  new_v
        // }
        // else
        // {
        //     new_d[old_k] =  new_v
        // }
        new_d[old_k] = old_v
        new_d[new_k] = new_v

        // if(!map_config || !map_config["dropOld"])
        // {
        //     new_d[old_k] = old_v
        // }

        if(map_config && old_k!=new_k && map_config["dropOld"])
        {
            // new_d[old_k] = old_v
            delete new_d[old_k]
        }

        // if(old_k=="count"){
        //     console.log("rsiimageData transform ", new_k, new_v, old_v)
        // }
    }

    return new_d

}


// version2
function transformDataByNewKeyIndex(d, trans_table){


    // var new_d = updateObject({}, d)
	var new_d = _Loda.merge({},d)
	
       
    var old_v,
        old_k,
        new_k,
        new_v,
        map_config,
        map_key_config,
        map_value_config,
        default_data_type="str",
        old_dat = d,
        map_value;


    var dropKeys = []

        // v;
    var judge_data_type;

    for(new_k in trans_table)
    {
        map_config = trans_table[new_k]
        if(isNullOrUndefined(map_config))
        {
            console.log(`warning-transform | attemp to transform data to new key '${new_k}' but not found the transform config in data`)
            continue;
        }

        // default a new key given
        old_k = map_config["key"] || new_k

        if(!old_k)
        {   
            console.log(`warning-transform | attemp to transform data but not found the old key '${old_k}' in config item, scoped 'key'`)
            continue;
        }

        // for uars rank temply modification
        // old_v = new_d[old_k] || 'null'
        old_v = new_d[old_k] || ( new_d[new_k] || 'null' )

        // old_v = new_d[old_k] || 'null'

        if(isNullOrUndefined(old_v))
        // if(old_v===undefined)
        {
            console.log(`warning-transform | attemp to transform data but not found the value of old key '${old_k}' in data`)
            continue;
        }

        map_value = map_config["value"]

        new_v = old_v

        if (!isNullOrUndefined( map_value ))
        {
            
            if (_Loda.isFunction(map_value))
			// if (getClassOf(map_value).name=="Function")
            {
                // new_v = map_value_config["map"](old_v, old_k, d)
                new_v = map_value(old_v, old_k, new_d)

                // temp comments
                // if(isPlainObjectInstance(new_v))
                // {
                //     // new_d
                //     Object.assign(new_d, new_v)
                // }
            }
            // else if(getClassOf(map_value).name=="Object")
            else if(_Loda.isPlainObject(map_value))
            {
                // not found responding mapped value
                // just fallback old value
                new_v = map_value[old_v] || old_v
            }

            // temp comments
            // if(isPlainObjectInstance(new_v))
            // {
            //     // new_d
            //     Object.assign(new_d, new_v)
            // }
        }

        new_d[new_k] = new_v

        if(old_k!=new_k && map_config["dropOld"])
        {
            // delete new_d[old_k]
            dropKeys.push(old_k)
        }
    }

    dropKeys.forEach((e)=>{delete new_d[e]})

    // console.log(`debug-transform | resp data: `, new_d)

    return new_d

}


function transformDatas(ds, transTable, apiVersion){

    if(!transTable)
    {
        return ds
    }

    apiVersion = apiVersion || 2

    // array
    var new_datas = []

    var transFunc = transformData

    if(apiVersion==2)
    {
        transFunc = transformDataByNewKeyIndex
    }

    for(var i in ds)
    {
        new_datas.push(transFunc(ds[i], transTable))
    }

    return new_datas
    
}

export {
	transformDatas,
	transformData
}